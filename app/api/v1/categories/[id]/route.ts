import { NextRequest, NextResponse } from 'next/server';

import { getAuthContext } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * @method PATCH /api/v1/admin/categories/[id]
 * @description Update an existing category with the given ID
 * @requires { name: string } - Name of the category to be updated
 * @param {string} id - ID of the category to be updated
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const { supabase, user } = await getAuthContext();

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

  const res = await supabase.from('categories').select('id').eq('name', name).limit(1).maybeSingle();
  if(res.data) {
    return NextResponse.json({ error: 'Category name already exists in the db' }, { status: 400 });
  }

  const slug = generateSlug(name);

  const { data, error } = await supabase
    .from('categories')
    .update({ name, slug })
    .eq('id', id)
    .select('id, name, slug, created_at, updated_at')
    .single();

  if(error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/**
 * @method DELETE /api/v1/admin/categories/[id]
 * @description Delete an existing category with the given id
 * @param {string} id - id of the category to be deleted
 */
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const { supabase, user } = await getAuthContext();

  if(!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if(error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
