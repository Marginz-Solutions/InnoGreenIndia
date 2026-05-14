-- Creating the table for contacts
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE CHECK (email ~* '^[a-z0-9._%-]+@[a-z0-9.-]+[.][a-z]+$'),
    phone_no TEXT NOT NULL UNIQUE CHECK (phone_no ~ '^[0-9]{10}$'),
    whatsapp TEXT NOT NULL UNIQUE CHECK (whatsapp ~ '^[0-9]{10}$'),
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT CHECK (pincode ~ '^[0-9]{6}$'),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
)

-- Creating the triggers for the auto-update the updateAt field
CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Creating the indexes
CREATE INDEX IF NOT EXISTS index_contacts_categories_id ON public.contacts (id);
CREATE INDEX IF NOT EXISTS index_contacts_phone_no ON public.contacts (phone_no);
CREATE INDEX IF NOT EXISTS index_contacts_email ON public.contacts (email);

-- Enabling the RLS policies
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Authenticated admin users can read all contacts
CREATE POLICY "contacts_admin_read_all"
ON public.contacts
FOR SELECT
TO authenticated
USING (TRUE);

-- Authenticated admin users can insert new contacts
CREATE POLICY "contacts_admin_insert"
ON public.contacts
FOR INSERT
TO authenticated
WITH CHECK (TRUE);
 
-- Authenticated admin users can update any contacts
CREATE POLICY "contacts_admin_update"
ON public.contacts
FOR UPDATE
TO authenticated
USING (TRUE)
WITH CHECK (TRUE);
 
-- Authenticated admin users can delete any contacts
CREATE POLICY "contacts_admin_delete"
ON public.contacts
FOR DELETE
TO authenticated
USING (TRUE);

-- Seeding some dummy data
INSERT INTO public.contacts (name, email, phoneNo, whatsapp, addressLine1, addressLine2, city, state, pincode) VALUES
('John Doe', 'john.doe@example.com', '9876543210', '9876543210', '123 Main St', 'Apt 4B', 'New York', 'NY', 10001),
('Jane Smith', 'jane.smith@example.com', '8765432109', '8765432109', '456 Oak Ave', 'Suite 2C', 'Los Angeles', 'CA', 90210),
('Alice Johnson', 'alice.johnson@example.com', '7654321098', '7654321098', '789 Pine Rd', 'Unit 3D', 'Chicago', 'IL', 60601);