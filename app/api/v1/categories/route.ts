import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

import { getAuthContext } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

/**
 * @method GET /api/v1/categories
 * @description Get all categories
 */
export async function GET() {

  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        updatedAt: true,
      },
      orderBy: { ['name']: 'asc' }
    });

    return NextResponse.json({ data: categories ?? [] });
  }
  catch(error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @method POST /api/v1/categories
 * @description Create a new category with the given name
 * @requires { name: string } - Name of the category to be created
 */
export async function POST(request: NextRequest) {
  const { user } = await getAuthContext();

  if(!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { name?: string };
  try {
    body = await request.json();
  } 
  catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if(!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  try {
    const exists = await prisma.category.findFirst({
      where: { name: { contains: name, mode: 'insensitive' as const }},
      select: { id: true }
    })

    if(exists) {
      return NextResponse.json({ error: 'Category name already exists in the db' }, { status: 400 });
    }

    const slug = generateSlug(name);

    const newCategory = await prisma.category.create({
      data: { name, slug }
    })

    return NextResponse.json({ data: newCategory }, { status: 201 });
  }
  catch(error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
