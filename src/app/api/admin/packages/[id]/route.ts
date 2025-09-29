import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isEmployeeOrAdmin } from "@/lib/auth-utils"

// PUT - Update package (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isEmployeeOrAdmin(session.user?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug, description, dailyRate, categoryId, rentalItems, searchTags } = body

    let parsedItems: Array<{ rentalId: string; count: number }> | undefined
    if (rentalItems !== undefined) {
      if (typeof rentalItems === "string") {
        try {
          parsedItems = JSON.parse(rentalItems)
        } catch (error) {
          return NextResponse.json({ error: "Invalid rental items payload" }, { status: 400 })
        }
      } else if (Array.isArray(rentalItems)) {
        parsedItems = rentalItems
      }
    }

    const packageData = await prisma.package.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(dailyRate && { dailyRate: parseFloat(dailyRate) }),
        ...(categoryId && { categoryId }),
        ...(searchTags !== undefined && { searchTags }),
        ...(parsedItems && {
          packageItems: {
            deleteMany: {},
            create: parsedItems.map((item) => ({
              rentalId: item.rentalId,
              count: Number(item.count) || 1,
            })),
          },
        }),
      },
      include: {
        category: true,
        packageItems: true,
      }
    })

    return NextResponse.json(packageData)
  } catch (error) {
    console.error("Error updating package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete package (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isEmployeeOrAdmin(session.user?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.package.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
