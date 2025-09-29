import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isEmployeeOrAdmin } from "@/lib/auth-utils"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !isEmployeeOrAdmin(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, slug, description, unitCost, categoryId, currentInventory, specs, available, searchTags } = body

  const retailItem = await prisma.retailItem.update({
    where: { id: params.id },
    data: {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(description !== undefined && { description }),
      ...(unitCost && { unitCost: parseFloat(unitCost) }),
      ...(categoryId && { categoryId }),
      ...(currentInventory !== undefined && { currentInventory: Number(currentInventory) }),
      ...(specs !== undefined && { specs: specs ? JSON.parse(specs) : null }),
      ...(available !== undefined && { available: Boolean(available) }),
      ...(searchTags !== undefined && { searchTags }),
    },
    include: { category: true },
  })

  return NextResponse.json(retailItem)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !isEmployeeOrAdmin(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.retailItem.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
