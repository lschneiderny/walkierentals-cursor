import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isEmployeeOrAdmin } from "@/lib/auth-utils"

// GET - List all store items (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isEmployeeOrAdmin(session.user?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const storeItems = await prisma.storeItem.findMany({
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

    return NextResponse.json(storeItems)
  } catch (error) {
    console.error("Error fetching store items:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new store item (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isEmployeeOrAdmin(session.user?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, price, categoryId, quantity, specs } = body

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const storeItem = await prisma.storeItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        quantity: quantity || 1,
        specs: specs ? JSON.parse(specs) : null,
        userId: session.user.id,
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(storeItem, { status: 201 })
  } catch (error) {
    console.error("Error creating store item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
