import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, created_at, updated_at')
    .order('name', { ascending: true });

  if(error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
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
    .insert({ name, slug })
    .select('id, name, slug, created_at, updated_at')
    .single();

  if(error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
