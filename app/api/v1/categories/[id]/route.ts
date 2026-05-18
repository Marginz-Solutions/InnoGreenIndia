import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getAuthContext } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * @method PATCH /api/v1/categories/[id]
 * @description Update an existing category with the given ID
 * @requires { name: string } - Name of the category to be updated
 * @param {string} id - ID of the category to be updated
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
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
      where: { name: { contains: name, mode: 'insensitive' as const } },
      select: { id: true }
    })

    if(exists) {
      return NextResponse.json({ error: 'Category name already exists in the db' }, { status: 400 });
    }
  
    const slug = generateSlug(name);
    const updatedCategoy = await prisma.category.update({
      where: { id },
      data: { name, slug }
    })

    return NextResponse.json({ data: updatedCategoy });
  }
  catch(error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @method DELETE /api/v1/categories/[id]
 * @description Delete an existing category with the given id
 * @param {string} id - id of the category to be deleted
 */
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const { user } = await getAuthContext();

  if(!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // const { error } = await supabase.from('categories').delete().eq('id', id);
    const deletedCategory = await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ data: deletedCategory });
  }
  catch(error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
