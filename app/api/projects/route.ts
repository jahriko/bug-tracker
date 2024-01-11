import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const response = await prisma.project.findMany()
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error })
  }
}
