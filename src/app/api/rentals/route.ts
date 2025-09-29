import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { mockRentals } from "@/lib/mock-data"

export async function GET() {
  try {
    // Try to get rentals from database first
    const rentals = await prisma.rental.findMany({
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

    // If no rentals in database, return mock data
    if (rentals.length === 0) {
      return NextResponse.json(mockRentals)
    }

    return NextResponse.json(rentals)
  } catch (error) {
    console.error("Error fetching rentals:", error)
    // Return mock data if database fails
    return NextResponse.json(mockRentals)
  }
}
