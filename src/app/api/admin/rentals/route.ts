import { adminGetAll, adminCreate } from '@/lib/admin-crud';
import { NextRequest } from 'next/server';

// GET - List all rentals (admin only)
export async function GET() {
  return adminGetAll('rental');
}

// POST - Create new rental (admin only)
export async function POST(req: NextRequest) {
  const prepareData = (body: any, userId: string) => {
    const { name, description, price, categoryId, quantity, specs, availabilityDate } = body;

    if (!name || !price || !categoryId) {
      throw new Error("Missing required fields");
    }

    return {
      name,
      description,
      price: parseFloat(price),
      categoryId,
      quantity: quantity ? parseInt(quantity, 10) : 1,
      specs: specs ? JSON.parse(specs) : null,
      availabilityDate: availabilityDate ? new Date(availabilityDate) : null,
      userId,
    };
  };

  // @ts-expect-error
  return adminCreate('rental', req, prepareData);
}
