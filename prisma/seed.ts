import prisma from "@/lib/prisma"
import { faker } from "@faker-js/faker"
import { hash } from "bcrypt"
import { cookies } from "next/headers"

async function main() {
  console.log("Deleting previous seed...")
  await prisma.user.deleteMany()
  await prisma.workspace.deleteMany()
  await prisma.project.deleteMany()

  //Delete browser cookies
  console.log("Deleting cookies...")
  cookies()
    .getAll()
    .forEach((cookie) => {
      cookies().delete(cookie.name)
    })

  await prisma.label.createMany({
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

  for (let i = 0; i < 5; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const hashedPassword = await hash("12345678", 13)

    const user = await prisma.user.create({
      data: {
        image: faker.image.avatar(),
        name: `${firstName} ${lastName}`,
        email: `${firstName.charAt(0).toLowerCase()}${lastName}@email.com`,
        hashedPassword,
      },
    })

    const workspace = await prisma.workspace.create({
      data: {
        name: faker.lorem.word(8),
        ownerId: user.id,
      },
    })

    const project = await prisma.project.create({
      data: {
        title: faker.lorem.word(7),
        workspaceId: workspace.id,
        issues: {
          createMany: {
            data: Array.from({ length: 5 }).map(() => ({
              title: faker.hacker.phrase(),
              description: faker.lorem.paragraph(4),
              priority: faker.helpers.arrayElement([
                "low",
                "medium",
                "high",
                "no-priority",
              ]),
              status: faker.helpers.arrayElement(["open", "closed", "in-progress"]),
              userId: user.id,
            })),
          },
        },
      },
    })

    const issues = await prisma.issue.create({
      data: {
        title: faker.hacker.phrase(),
        description: faker.lorem.paragraph(4),
        priority: faker.helpers.arrayElement(["low", "medium", "high", "no-priority"]),
        status: faker.helpers.arrayElement(["open", "closed", "in-progress"]),
        issueLabels: {
          createMany: {
            data: Array.from({ length: 2 }).map(() => ({
              labelId: faker.number.int({ min: 1, max: 7 }),
            })),
          },
        },
        userId: user.id,
        projectId: project.id,
      },
    })
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
