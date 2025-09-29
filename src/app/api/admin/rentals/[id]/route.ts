import { adminUpdate, adminDelete } from '@/lib/admin-crud';
import { NextRequest } from 'next/server';

// PUT - Update rental (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const prepareUpdateData = (body: any) => {
    const { name, slug, description, dailyRate, categoryId, currentInventory, specs, availabilityDate, available, searchTags } = body;

    return {
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
    };
  };

  return adminUpdate('rental', params.id, req, prepareUpdateData, { category: true, packageItems: true });
}

// DELETE - Delete rental (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return adminDelete('rental', params.id);
}
