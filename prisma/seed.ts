/* eslint-disable guard-for-in */
import prisma from "@/lib/prisma"
import { faker } from "@faker-js/faker"
import { Priority, Status } from "@prisma/client"
import { enhance } from "@zenstackhq/runtime"
import { hash } from "bcrypt"

const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/ /g, "-") // Replace space with dash
    .replace(/[^a-z0-9-]/g, "") // no special characters
    .replace(/-{2,}/g, "-") // Prevent more than one dash between letters/numbers
    .replace(/^-/, "") // Remove dash if it's the first character
}

async function main() {
  await prisma.$transaction(
    async (tx) => {
      // Clear existing data
      await Promise.all([
        tx.user.deleteMany(),
        tx.label.deleteMany(),
        tx.issue.deleteMany(),
        tx.issueActivity.deleteMany(),
      ])

      // Create labels
      const labelData = [
        { name: "Bug", color: "red" },
        { name: "Feature", color: "green" },
        { name: "Documentation", color: "blue" },
        { name: "Improvement", color: "yellow" },
        { name: "Help Wanted", color: "purple" },
        { name: "Good First Issue", color: "orange" },
      ]

      const labels = await tx.label.createManyAndReturn({ data: labelData })
      const labelIds = labels.map((label) => label.id)

      // Create users
      const users = await tx.user.createManyAndReturn({
        data: await Promise.all(
          Array.from({ length: 50 }, async () => ({
            image: faker.image.avatar(),
            name: `${faker.person.firstName()} ${faker.person.lastName()}`,
            email: faker.internet.exampleEmail(),
            hashedPassword: await hash("12345678", 13),
          })),
        ),
        skipDuplicates: true,
      })

      // Create 3 more users that own a workspace
      const numOfWorkspaces = 3
      for (let i = 0; i < numOfWorkspaces; i++) {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const hashedPassword = await hash("12345678", 13)
        const user = await tx.user.create({
          data: {
            image: faker.image.avatar(),
            name: `${firstName} ${lastName}`,
            email: faker.internet.exampleEmail({ firstName, lastName }),
            hashedPassword,
          },
        })

        const fakeWorkspace = faker.company.name()
        const workspace = await tx.workspace.create({
          data: {
            name: fakeWorkspace,
            ownerId: user.id,
            url: slugify(fakeWorkspace),
          },
        })

        const userIds = users.map((user) => user.id)
        const workspaceMembersData = Array.from({ length: 10 }, () => ({
          userId: faker.helpers.arrayElement(userIds),
          workspaceId: workspace.id,
        })).filter((member) => member.userId !== user.id)

        const workspaceMembers = await tx.workspaceMember.createManyAndReturn({
          data: workspaceMembersData,
          skipDuplicates: true,
        })

        // Update the last workspace URL for each user
        await Promise.all(
          workspaceMembers.map((member) =>
            tx.user.update({
              where: {
                id: member.userId,
              },
              data: {
                lastWorkspaceUrl: slugify(fakeWorkspace),
              },
            }),
          ),
        )

        // make 5 added members admins
        const shuffledMemberIds = faker.helpers.shuffle(workspaceMembers.map((member) => member.userId))
        const adminIds = shuffledMemberIds.slice(0, 5)

        for (const adminId of adminIds) {
          await tx.workspaceMember.updateMany({
            where: {
              userId: adminId,
              workspaceId: workspace.id,
            },
            data: {
              role: "ADMIN",
            },
          })
        }

        const projectTitle = faker.lorem.word()
        const projectId = projectTitle.substring(0, 3).toUpperCase()

        // Create projects each workspace
        const project = await tx.project.createManyAndReturn({
          data: await Promise.all(
            Array.from({ length: 5 }, async () => ({
              title: projectTitle,
              identifier: projectId,
              workspaceId: workspace.id,
            })),
          ),
          skipDuplicates: true,
        })

        // Add members each project
        const projectMembers = await tx.projectMember.createManyAndReturn({
          data: await Promise.all(
            Array.from({ length: 10 }, async () => ({
              userId: faker.helpers.arrayElement(workspaceMembers.map((user) => user.userId)),
              projectId: faker.helpers.arrayElement(project.map((project) => project.id)),
            })),
          ),
          skipDuplicates: true,
        })

        // Create issues each project
        const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "NO_PRIORITY"]
        const statuses: Status[] = ["BACKLOG", "IN_PROGRESS", "DONE", "CANCELLED"]

        const issue = await tx.issue.createManyAndReturn({
          data: await Promise.all(
            Array.from({ length: 15 }, async () => ({
              title: faker.hacker.phrase(),
              description: generateMarkdownDescription(),
              priority: faker.helpers.arrayElement(priorities),
              status: faker.helpers.arrayElement(statuses),
              projectId: faker.helpers.arrayElement(project.map((project) => project.id)),
              ownerId: faker.helpers.arrayElement(projectMembers.map((member) => member.userId)),
            })),
          ),
        })

        // Assign each issues a label
        const createIssueLabelData = (issueId, labelId) => ({
          issueId,
          labelId,
        })

        const numLabels = faker.number.int({
          min: 0,
          max: Math.min(4, labelIds.length),
        })
        const selectedLabelIds = faker.helpers.shuffle(labelIds).slice(0, numLabels)

        if (selectedLabelIds.length > 0) {
          await tx.issueLabel.createMany({
            data: selectedLabelIds.map((labelId) =>
              createIssueLabelData(faker.helpers.arrayElement(issue.map((issue) => issue.id)), labelId),
            ),
          })
        }
      }
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 20000, // default: 5000
    },
  )
  const workspaceAdmin = await prisma.workspaceMember.findFirstOrThrow({
    where: {
      role: "ADMIN",
    },
    select: {
      workspaceId: true,
      userId: true,
    },
  })

  const getProject = await prisma.project.findFirstOrThrow({
    where: {
      workspaceId: workspaceAdmin.workspaceId,
    },
  })

  const getProjectMember = await prisma.projectMember.findFirstOrThrow({
    where: {
      projectId: getProject.id,
    },
    select: {
      user: {
        select: {
          name: true,
        },
      },
      userId: true,
    },
  })

  const enhanced = enhance(prisma, { user: { id: getProjectMember.userId } })

  const user_db = enhanced.$extends({
    name: "logIssueUpdate",
    query: {
      issue: {
        async update({ args }) {
          const createIssueActivity = await enhanced.issue.update(args)

          for (const field in args.data) {
            switch (field) {
              case "title":
                await enhanced.titleActivity.create({
                  data: {
                    userId: getProjectMember.userId,
                    issueId: args.where.id!,
                    title: args.data[field] as string,
                  },
                })
                break
              case "description":
                console.log("Description updated:", args.data[field])
                break
              case "priority":
                await enhanced.priorityActivity.upsert({
                  where: {
                    activityId: {
                      userId: getProjectMember.userId,
                      issueId: args.where.id!,
                      name: args.data[field] as string,
                    },
                  },
                  update: {
                    name: args.data[field] as string,
                  },
                  create: {
                    userId: getProjectMember.userId,
                    issueId: args.where.id!,
                    priorityName: args.data[field] as string,
                  },
                })
                break
              case "status":
                await enhanced.statusActivity.create({
                  data: {
                    userId: getProjectMember.userId,
                    issueId: args.where.id!,
                    statusName: args.data[field] as string,
                  },
                })
                break
              default:
                break
            }
          }

          return createIssueActivity
        },
      },
    },
  })

  const issue = await prisma.issue.findFirst({
    where: {
      projectId: getProject.id,
    },
    select: {
      id: true,
      ownerId: true,
    },
  })

  if (issue) {
    // update issue status
    const updateStatus = await user_db.issue.update({
      select: {
        status: true,
        id: true,
      },
      where: {
        id: issue.id,
      },
      data: {
        status: faker.helpers.arrayElement(["BACKLOG", "IN_PROGRESS", "DONE", "CANCELLED"]),
      },
    })

    console.log("Issue status updated:", updateStatus.status, issue.id, getProjectMember.userId)
  } else {
    console.error("No issue or project member found")
  }
}

function generateMarkdownDescription() {
  return `
${faker.lorem.paragraphs()}

## Steps to Reproduce

1. ${faker.lorem.sentence()}
2. ${faker.lorem.sentence()}
3. ${faker.lorem.sentence()}

## Expected Behavior

${faker.lorem.paragraph()}

## Actual Behavior

${faker.lorem.paragraph()}

## Additional Notes

${faker.lorem.paragraph()}
  `.trim()
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
