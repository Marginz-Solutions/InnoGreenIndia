-- Creating the table for brands
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    description TEXT,
    logo_url TEXT NOT NULL,
    image_url TEXT,
    website_url TEXT,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE RESTRICT,
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
)

-- Creating the triggers for the auto-update the updateAt field
CREATE TRIGGER update_brands_updated_at
BEFORE UPDATE ON public.brands
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Creating the indexes
CREATE INDEX IF NOT EXISTS index_brands_categories_id ON public.brands (category_id);
CREATE INDEX IF NOT EXISTS index_brands_is_active ON public.brands (is_active);
CREATE INDEX IF NOT EXISTS index_brands_slug ON public.brands (slug);

-- Enabling the RLS policies
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Anyone can read the only the active brands
CREATE POLICY "brands_public_read"
ON public.brands
FOR SELECT
USING (is_active = TRUE);

-- Authenticated admin users can read all brands
CREATE POLICY "brands_admin_read_all"
ON public.brands
FOR SELECT
TO authenticated
USING (TRUE);

-- Authenticated admin users can insert new brands
CREATE POLICY "brands_admin_insert"
ON public.brands
FOR INSERT
TO authenticated
WITH CHECK (TRUE);
 
-- Authenticated admin users can update any brand
CREATE POLICY "brands_admin_update"
ON public.brands
FOR UPDATE
TO authenticated
USING (TRUE)
WITH CHECK (TRUE);
 
-- Authenticated admin users can delete any brand
CREATE POLICY "brands_admin_delete"
ON public.brands
FOR DELETE
TO authenticated
USING (TRUE);

-- Seeding some dummy data
-- INSERT INTO public.brands (name, slug, category_id, description, tags, is_active)
-- VALUES
--   (
--     'FINOZEN',
--     'finozen',
--     1, 
--     'Premium water-soluble nutrition for fertigation and foliar programs.',
--     '{"fertigation", "foliar", "premium"}',
--     TRUE
--   ),
--   (
--     'INNOGREEN',
--     'innogreen',
--     2,
--     'Bio-stimulants and micronutrient solutions for sustainable performance farming.',
--     '{"bio-stimulant", "micronutrients", "sustainable"}',
--     TRUE
--   ),
--   (
--     'Meenakshi Agro Chemicals',
--     'meenakshi-agro-chemicals',
--     4,
--     'Crop protection products aligned to major crops and regional field realities.',
--     '{"insecticides", "fungicides", "crop-protection"}',
--     TRUE
--   );