import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isEmployeeOrAdmin } from "@/lib/auth-utils"

// PUT - Update rental (admin only)
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
    const { name, slug, description, dailyRate, categoryId, currentInventory, specs, availabilityDate, available, searchTags } = body

    const rental = await prisma.rental.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(dailyRate && { dailyRate: parseFloat(dailyRate) }),
        ...(categoryId && { categoryId }),
        ...(currentInventory !== undefined && { currentInventory: Number(currentInventory) }),
        ...(searchTags !== undefined && { searchTags }),
        ...(specs !== undefined && { specs: specs ? JSON.parse(specs) : null }),
        ...(availabilityDate !== undefined && {
          availabilityDate: availabilityDate ? new Date(availabilityDate) : null
        }),
        ...(available !== undefined && { available }),
      },
      include: {
        category: true,
        packageItems: true,
      }
    })

    return NextResponse.json(rental)
  } catch (error) {
    console.error("Error updating rental:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete rental (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isEmployeeOrAdmin(session.user?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.rental.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting rental:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
