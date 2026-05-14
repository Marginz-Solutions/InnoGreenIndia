import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

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

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if(!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if(error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
