// import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { enhance } from "@zenstackhq/runtime"

// const session = await auth()

const extendedPrisma = prisma.$extends({
  query: {
    issue: {
      async update({ args, query }) {
        const context = Prisma.getExtensionContext(this)
        const modelName = context.$name
        const modelFields = Prisma.dmmf.datamodel.models.find(
          (model) => model.name === modelName,
        )?.fields

        console.log(`Model: ${modelName}`)
        console.log("Fields:", modelFields)

        return query(args)
      },
    },
  },
})

// type SessionUser = User & { userId: string; lastWorkspace: string }

export const db = enhance(
  extendedPrisma,
  {},
  { logPrismaQuery: true },
)
