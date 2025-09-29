import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isEmployeeOrAdmin } from "@/lib/auth-utils"

// GET - List all packages (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isEmployeeOrAdmin(session.user?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const packages = await prisma.package.findMany({
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

    return NextResponse.json(packages)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new package (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isEmployeeOrAdmin(session.user?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug, description, dailyRate, categoryId, rentalItems, searchTags } = body

    let parsedItems: Array<{ rentalId: string; count: number }> = []
    if (typeof rentalItems === "string") {
      try {
        parsedItems = JSON.parse(rentalItems)
      } catch (error) {
        return NextResponse.json({ error: "Invalid rental items payload" }, { status: 400 })
      }
    } else if (Array.isArray(rentalItems)) {
      parsedItems = rentalItems
    }

    if (!name || !dailyRate || !categoryId || parsedItems.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const packageData = await prisma.package.create({
      data: {
        name,
        slug,
        description,
        dailyRate: parseFloat(dailyRate),
        categoryId,
        searchTags,
        userId: session.user.id,
        packageItems: {
          create: parsedItems.map((item) => ({
            rentalId: item.rentalId,
            count: Number(item.count) || 1,
          })),
        },
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(packageData, { status: 201 })
  } catch (error) {
    console.error("Error creating package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
