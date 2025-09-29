import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { mockPackages } from "@/lib/mock-data"

export async function GET() {
  try {
    // Try to get packages from database first
    const packages = await prisma.package.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // If no packages in database, return mock data
    if (packages.length === 0) {
      return NextResponse.json(mockPackages)
    }

    return NextResponse.json(packages)
  } catch (error) {
    console.error("Error fetching packages:", error)
    // Return mock data if database fails
    return NextResponse.json(mockPackages)
  }
}
