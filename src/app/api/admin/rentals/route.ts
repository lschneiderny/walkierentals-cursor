import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isEmployeeOrAdmin } from "@/lib/auth-utils"

// GET - List all rentals (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isEmployeeOrAdmin(session.user?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rentals = await prisma.rental.findMany({
      include: {
        category: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(rentals)
  } catch (error) {
    console.error("Error fetching rentals:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new rental (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isEmployeeOrAdmin(session.user?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, price, categoryId, quantity, specs, availabilityDate } = body

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const rental = await prisma.rental.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        quantity: quantity ? parseInt(quantity, 10) : 1,
        specs: specs ? JSON.parse(specs) : null,
        availabilityDate: availabilityDate ? new Date(availabilityDate) : null,
        userId: session.user.id,
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(rental, { status: 201 })
  } catch (error) {
    console.error("Error creating rental:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
