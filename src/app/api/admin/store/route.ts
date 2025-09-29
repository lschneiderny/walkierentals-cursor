import { adminGetAll, adminCreate } from '@/lib/admin-crud';
import { NextRequest } from 'next/server';

// GET - List all store items (admin only)
export async function GET() {
  return adminGetAll('retailItem');
}

// POST - Create new store item (admin only)
export async function POST(req: NextRequest) {
  const prepareData = (body: any, userId: string) => {
    const { name, description, price, categoryId, quantity, specs } = body;

    if (!name || !price || !categoryId) {
      throw new Error("Missing required fields");
    }

    return {
      name,
      description,
      price: parseFloat(price),
      categoryId,
      quantity: quantity || 1,
      specs: specs ? JSON.parse(specs) : null,
      userId,
    };
  };

  return adminCreate('retailItem', req, prepareData);
}
