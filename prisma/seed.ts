import { faker } from "@faker-js/faker"
import { hash } from "bcrypt"
import prisma from "@/lib/prisma"

async function main() {
  // await prisma.project.deleteMany()

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

    await prisma.project.create({
      data: {
        title: faker.lorem.word(7),
        issues: {
          createMany: {
            data: Array.from({ length: 5 }).map(() => ({
              title: faker.hacker.phrase(),
              description: faker.lorem.paragraph(4),
              priority: faker.helpers.arrayElement([
                "Low",
                "Medium",
                "High",
                "No Priority",
              ]),
              status: faker.helpers.arrayElement([
                "Open",
                "Closed",
                "In Progress",
              ]),
              label: [
                faker.helpers.arrayElement([
                  "Bug",
                  "Feature",
                  "Documentation",
                  "Improvement",
                  "Duplicate",
                ]),
              ],
              userId: user.id,
            })),
          },
        },
      },
    })
  }
}

console.log("Projects Created")

main()
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })