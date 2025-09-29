import { adminUpdate, adminDelete } from '@/lib/admin-crud';
import { NextRequest } from 'next/server';

// PUT - Update package (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const prepareUpdateData = (body: any) => {
    const { name, slug, description, dailyRate, categoryId, rentalItems, searchTags } = body;

    let parsedItems: Array<{ rentalId: string; count: number }> | undefined;
    if (rentalItems !== undefined) {
      if (typeof rentalItems === "string") {
        try {
          parsedItems = JSON.parse(rentalItems);
        } catch (error) {
          throw new Error("Invalid rental items payload");
        }
      } else if (Array.isArray(rentalItems)) {
        parsedItems = rentalItems;
      }
    }

    return {
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
    };
  };

  return adminUpdate('package', params.id, req, prepareUpdateData, { category: true, packageItems: true });
}

// DELETE - Delete package (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return adminDelete('package', params.id);
}
