-- Creating the table for categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)

-- Creating the triggers for the auto-update the updateAt field
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURN TRIGGER AS $$
BEGIN
    NEW."updated_at" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Creating the indexes
CREATE INDEX IF NOT EXISTS index_categories_name ON public.categories (name);

-- Enabling the RLS policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read the categories
CREATE POLICY "categories_read_all" 
ON public.categories
FOR SELECT
USING (true);

-- Only authenticated users can insert, update or delete categories
CREATE POLICY "categories_admin_insert"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "categories_admin_update"
ON public.categories
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "categories_admin_delete"
ON public.categories
FOR DELETE
TO authenticated
USING (true)

-- Seeding some dummy data
INSERT INTO public.categories (name, slug) VALUES
('Fertilizers', 'fertilizers'),
('Pesticides', 'pesticides'),
('Seeds', 'seeds'),
('Tools', 'tools');