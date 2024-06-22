import { db } from "@/lib/extensions/enhanced"
import prisma from "@/lib/prisma"
import { faker } from "@faker-js/faker"
import { enhance } from "@zenstackhq/runtime"
import { hash } from "bcrypt"

async function main() {
  await prisma.user.deleteMany()
  await prisma.label.deleteMany()
  await prisma.workspace.deleteMany()

  // const db = enhance(prisma, {}, { logPrismaQuery: true })

  // Create labels
  const labels = await prisma.label.createManyAndReturn({
    data: [
      { name: "Bug", color: "red" },
      { name: "Feature", color: "green" },
      { name: "Documentation", color: "blue" },
      { name: "Improvement", color: "yellow" },
      { name: "Duplicate", color: "gray" },
      { name: "Help Wanted", color: "purple" },
      { name: "Good First Issue", color: "orange" },
    ],
  })

  const labelIds = labels.map((label) => label.id)

  // Create users
  // let users
  // for (let i = 0; i < 10; i++) {
  //   const firstName = faker.person.firstName()
  //   const lastName = faker.person.lastName()
  //   const hashedPassword = await hash("12345678", 13)
  //   users = await prisma.user.create({
  //     data: {
  //       image: faker.image.avatar(),
  //       name: `${firstName} ${lastName}`,
  //       email: faker.internet.exampleEmail({ firstName, lastName }),
  //       hashedPassword,
  //     },
  //   })
  // }

  let userData = Array.from({ length: 20 }, async () => ({
    image: faker.image.avatar(),
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: faker.internet.exampleEmail(),
    hashedPassword: await hash("12345678", 13),
  }))

  let users = await prisma.user.createManyAndReturn({
    data: await Promise.all(userData),
    skipDuplicates: true,
  })

  // Create 3 more users that own a workspace
  let numOfWorkspaces = 3
  for (let i = 0; i < numOfWorkspaces; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const hashedPassword = await hash("12345678", 13)
    let user = await prisma.user.create({
      data: {
        image: faker.image.avatar(),
        name: `${firstName} ${lastName}`,
        email: faker.internet.exampleEmail({ firstName, lastName }),
        hashedPassword,
      },
    })

    let workspace = await prisma.workspace.create({
      data: {
        name: faker.company.name(),
        ownerId: user.id,
      },
    })

    // add members to workspace
    // for (let j = 0; j < 10; j++) {
    //   await prisma.workspaceMember.create({
    //     data: {
    //       userId: faker.helpers.arrayElement(users.map((user) => user.id)),
    //       workspaceId: workspace.id,
    //       // role: faker.helpers.arrayElement(["ADMIN", "MEMBER"]),
    //     },
    //   })
    // }

    let workspaceMemberData = Array.from({ length: 10 }, async () => ({
      userId: faker.helpers.arrayElement(users.map((user) => user.id)),
      workspaceId: workspace.id,
    }))

    let workspaceMembers = await prisma.workspaceMember.createManyAndReturn({
      data: await Promise.all(workspaceMemberData),
      skipDuplicates: true,
    })

    // make 2 added members admins
    const shuffledMemberIds = faker.helpers.shuffle(
      workspaceMembers.map((member) => member.userId),
    )
    const adminIds = shuffledMemberIds.slice(0, 2)

    for (const adminId of adminIds) {
      await prisma.workspaceMember.updateMany({
        where: {
          userId: adminId,
          workspaceId: workspace.id,
        },
        data: {
          role: "ADMIN",
        },
      })
    }

    // for (const adminId of adminIds) {
    //   await prisma.workspaceMember.update({
    //     where: {
    //       userId_workspaceId: {
    //         userId: adminId,
    //         workspaceId: workspace.id,
    //       },
    //     },
    //     data: {
    //       role: "ADMIN",
    //     },
    //   })
    // }

    // Get all members with admin role
    // const admins = await prisma.workspaceMember.findMany({
    //   where: {
    //     workspaceId: workspace.id,
    //     role: "ADMIN",
    //   },
    // })

    // Create 5 projects for each workspace
    for (let i = 0; i < numOfWorkspaces; i++) {
      const project = await prisma.project.create({
        data: {
          title: faker.lorem.word(7),
          workspaceId: workspace.id,
        },
      })

      // add workspace members to project
      let projectMembers = await prisma.projectMember.createManyAndReturn({
        data: await Promise.all(
          Array.from({ length: 3 }, async () => ({
            userId: faker.helpers.arrayElement(
              workspaceMembers.map((user) => user.userId),
            ),
            projectId: project.id,
          })),
        ),
        skipDuplicates: true,
      })

      // Create 5 issues for each project
      for (let j = 0; j < 5; j++) {
        await prisma.$transaction(async (tx) => {
          const issue = await tx.issue.create({
            data: {
              title: faker.hacker.phrase(),
              description: faker.lorem.paragraph(3),
              priority: faker.helpers.arrayElement([
                "low",
                "medium",
                "high",
                "no-priority",
              ]),
              status: faker.helpers.arrayElement([
                "open",
                "closed",
                "in-progress",
                "duplicate",
              ]),
              ownerId: faker.helpers.arrayElement(
                projectMembers.map((user) => user.userId),
              ),
              projectId: project.id,
            },
          })

          // Shuffle the label IDs and take a random number of unique labels
          const shuffledLabelIds = faker.helpers.shuffle(labelIds)
          const numLabels = faker.number.int({
            min: 0,
            max: Math.min(4, labelIds.length),
          })
          const selectedLabelIds = shuffledLabelIds.slice(0, numLabels)

          // Create IssueLabels
          for (const labelId of selectedLabelIds) {
            await tx.issueLabel.create({
              data: {
                issueId: issue.id,
                labelId: labelId,
              },
            })
          }
        })
      }
    }
  }

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
      userId: true,
    },
  })

  const db_user = enhance(prisma, { user: { id: getProjectMember.userId } })

  const issue = await prisma.issue.findFirstOrThrow({
    where: {
      projectId: getProject.id,
    },
    select: {
      id: true,
      ownerId: true,
    },
  })

  if (issue && getProjectMember) {
    // update issue status
    const updateStatus = await db_user.issue.update({
      select: {
        status: true,
        id: true,
      },
      where: {
        id: issue.id,
      },
      data: {
        status: faker.helpers.arrayElement([
          "open",
          "closed",
          "in-progress",
          "duplicate",
        ]),
      },
    })

    console.log("Issue status updated:", updateStatus.status, issue.id, getProjectMember.userId)

    // create status activity
    const statusActivity = await db.statusActivity.create({
      data: {
        userId: getProjectMember.userId,
        issueId: updateStatus.id,
        name: updateStatus.status,
      },
    })

    console.log("Status activity created:", statusActivity)
  } else {
    console.log("No issue or project member found")
  }
}

console.log("Done seeding!")

main()
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
