-- Creating the table for contacts
CREATE TABLE IF NOT EXISTS public.admin_contact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    alt_phone TEXT,
    email TEXT,
    website TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    lat NUMERIC(10, 6),
    lng NUMERIC(10, 6),
    altitude TEXT,
    accuracy TEXT,
    operating_hours TEXT,
    timezone TEXT,
    commander_name TEXT,
    commander_contact TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Creating the trigger for auto-updating the updated_at field
CREATE TRIGGER update_admin_contact_updated_at
BEFORE UPDATE ON public.admin_contact
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Creating the indexes
CREATE INDEX IF NOT EXISTS index_admin_contact_city  ON public.admin_contact (city);
CREATE INDEX IF NOT EXISTS index_admin_contact_state ON public.admin_contact (state);
CREATE INDEX IF NOT EXISTS index_admin_contact_email ON public.admin_contact (email);

-- Enabling RLS policies
ALTER TABLE public.admin_contact ENABLE ROW LEVEL SECURITY;

-- Anyone can read contacts
CREATE POLICY "admin_contact_public_read"
ON public.admin_contact
FOR SELECT
USING (TRUE);

-- Authenticated admin users can insert new contacts
CREATE POLICY "admin_contact_admin_insert"
ON public.admin_contact
FOR INSERT
TO authenticated
WITH CHECK (TRUE);

-- Authenticated admin users can update any contact
CREATE POLICY "admin_contact_admin_update"
ON public.admin_contact
FOR UPDATE
TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

-- Authenticated admin users can delete any contact
CREATE POLICY "admin_contact_admin_delete"
ON public.admin_contact
FOR DELETE
TO authenticated
USING (TRUE);

-- Seeding some dummy data
-- INSERT INTO public.admin_contact (phone, alt_phone, email, website, address, city, state, pincode, lat, lng, altitude, accuracy, operating_hours, timezone, commander_name, commander_contact)
-- VALUES
--   (
--     '+91 98765 43210',
--     '+91 91234 56789',
--     'erode.command@fieldops.in',
--     'https://fieldops.in/erode',
--     '123 Field Route, Industrial Area',
--     'Erode',
--     'Tamil Nadu',
--     '638001',
--     11.341000,
--     77.717200,
--     '184 m',
--     '±3 m',
--     '06:00 – 22:00 IST',
--     'Asia/Kolkata (UTC+5:30)',
--     'Maj. Arjun Selvam',
--     '+91 99887 76655'
--   );