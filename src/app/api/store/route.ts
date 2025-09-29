import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { mockRetailItems } from "@/lib/mock-data"

export async function GET() {
  try {
    // Try to get store items from database first
    // @ts-ignore
    const storeItems = await prisma.retailItem.findMany({
      include: {
        category: true
      },
      where: {
        available: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // If no store items in database, return mock data
    if (storeItems.length === 0) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json([], { status: 200 });
      }
      return NextResponse.json(mockRetailItems);
    }

    return NextResponse.json(storeItems)
  } catch (error) {
    console.error("Error fetching store items:", error)
    // Return mock data if database fails
    return NextResponse.json(mockRetailItems)
  }
}
