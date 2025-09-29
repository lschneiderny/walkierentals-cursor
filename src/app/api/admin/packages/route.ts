import { adminGetAll, adminCreate } from '@/lib/admin-crud';
import { NextRequest } from 'next/server';

// GET - List all packages (admin only)
export async function GET() {
  return adminGetAll('package');
}

// POST - Create new package (admin only)
export async function POST(req: NextRequest) {
  interface PackageBody {
    name: string;
    slug?: string;
    description?: string;
    dailyRate: string;
    categoryId: string;
    rentalItems: string | Array<{ rentalId: string; count: number }>;
    searchTags?: string;
  }

  const prepareData = (body: PackageBody, userId: string) => {
    const { name, slug, description, dailyRate, categoryId, rentalItems, searchTags } = body;

    let parsedItems: Array<{ rentalId: string; count: number }> = [];
    if (typeof rentalItems === "string") {
      try {
        parsedItems = JSON.parse(rentalItems);
      } catch (error) {
        throw new Error("Invalid rental items payload");
      }
    } else if (Array.isArray(rentalItems)) {
      parsedItems = rentalItems;
    }

    if (!name || !dailyRate || !categoryId || parsedItems.length === 0) {
      throw new Error("Missing required fields");
    }

    return {
      name,
      slug,
      description,
      dailyRate: parseFloat(dailyRate),
      categoryId,
      searchTags,
      userId,
      packageItems: {
        create: parsedItems.map((item) => ({
          rentalId: item.rentalId,
          count: Number(item.count) || 1,
        })),
      },
    };
  };

  // @ts-expect-error
  return adminCreate('package', req, prepareData);
}
