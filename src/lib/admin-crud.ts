import { prisma } from './prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { isEmployeeOrAdmin } from './auth-utils';

type PrismaModel = 'package' | 'rental' | 'retailItem';

export async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error
  if (!session || !isEmployeeOrAdmin(session.user?.role)) {
    return null;
  }
  return session;
}

export async function adminGetAll(model: PrismaModel) {
  const session = await checkAdminAccess();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // @ts-expect-error
    const items = await prisma[model].findMany({
      include: {
        category: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error(`Error fetching ${model}s:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function adminDelete(model: PrismaModel, id: string) {
  const session = await checkAdminAccess();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await (prisma as any)[model].delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting ${model}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export type PrepareDataFn = (body: Record<string, unknown>, userId: string) => Record<string, unknown>;

export async function adminCreate(model: PrismaModel, req: NextRequest, prepareData: PrepareDataFn, include: any = { category: true }) {
  const session = await checkAdminAccess();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    // @ts-expect-error
    const data = prepareData(body, session.user.id);
    const item = await (prisma as any)[model].create({
      data,
      include
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error(`Error creating ${model}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export type PrepareUpdateDataFn = (body: Record<string, unknown>) => Record<string, unknown>;

export async function adminUpdate(model: PrismaModel, id: string, req: NextRequest, prepareUpdateData: PrepareUpdateDataFn, include: any = { category: true }) {
  const session = await checkAdminAccess();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data = prepareUpdateData(body);
    const item = await (prisma as any)[model].update({
      where: { id },
      data,
      include
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error(`Error updating ${model}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
