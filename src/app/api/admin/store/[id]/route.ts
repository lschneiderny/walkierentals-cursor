import { adminUpdate, adminDelete } from '@/lib/admin-crud';
import { NextRequest } from 'next/server';

// PUT - Update store item (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const prepareUpdateData = (body: any) => {
    const { name, description, price, categoryId, quantity, specs, available } = body;

    return {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(price && { price: parseFloat(price) }),
      ...(categoryId && { categoryId }),
      ...(quantity !== undefined && { quantity }),
      ...(specs !== undefined && { specs: specs ? JSON.parse(specs) : null }),
      ...(available !== undefined && { available }),
    };
  };

  return adminUpdate('retailItem', params.id, req, prepareUpdateData);
}

// DELETE - Delete store item (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return adminDelete('retailItem', params.id);
}
