import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isEmployeeOrAdmin } from "@/lib/auth-utils"

// PUT - Update store item (admin only)
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
    const { name, description, price, categoryId, quantity, specs, available } = body

    const storeItem = await prisma.storeItem.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(categoryId && { categoryId }),
        ...(quantity !== undefined && { quantity }),
        ...(specs !== undefined && { specs: specs ? JSON.parse(specs) : null }),
        ...(available !== undefined && { available }),
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(storeItem)
  } catch (error) {
    console.error("Error updating store item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete store item (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isEmployeeOrAdmin(session.user?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.storeItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting store item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
