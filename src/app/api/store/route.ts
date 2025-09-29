import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { mockStoreItems } from "@/lib/mock-data"

export async function GET() {
  try {
    // Try to get store items from database first
    const storeItems = await prisma.storeItem.findMany({
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
      return NextResponse.json(mockStoreItems)
    }

    return NextResponse.json(storeItems)
  } catch (error) {
    console.error("Error fetching store items:", error)
    // Return mock data if database fails
    return NextResponse.json(mockStoreItems)
  }
}
