-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Canada',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create shipments table for cargo/courier orders
CREATE TABLE public.shipments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tracking_id TEXT NOT NULL UNIQUE,
    route TEXT NOT NULL CHECK (route IN ('bd-to-ca', 'ca-to-bd')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'pickup_scheduled', 'picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'cancelled')),
    cargo_type TEXT,
    weight DECIMAL(10,2),
    packages INTEGER DEFAULT 1,
    contents TEXT,
    -- Sender info
    sender_name TEXT NOT NULL,
    sender_phone TEXT NOT NULL,
    sender_email TEXT,
    pickup_address TEXT,
    from_city TEXT,
    -- Receiver info
    receiver_name TEXT NOT NULL,
    receiver_phone TEXT NOT NULL,
    delivery_address TEXT,
    to_city TEXT,
    -- Pricing
    service_type TEXT DEFAULT 'standard' CHECK (service_type IN ('standard', 'express', 'priority')),
    base_cost DECIMAL(10,2),
    insurance_cost DECIMAL(10,2) DEFAULT 0,
    fragile_fee DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,2),
    -- Insurance & options
    has_insurance BOOLEAN DEFAULT false,
    is_fragile BOOLEAN DEFAULT false,
    -- Dates
    estimated_delivery DATE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Shipments policies
CREATE POLICY "Users can view their own shipments"
ON public.shipments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shipments"
ON public.shipments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shipments"
ON public.shipments FOR UPDATE
USING (auth.uid() = user_id);

-- Create shipment_timeline table for tracking events
CREATE TABLE public.shipment_timeline (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    location TEXT,
    description TEXT,
    is_current BOOLEAN DEFAULT false,
    event_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipment_timeline ENABLE ROW LEVEL SECURITY;

-- Timeline policy - users can view timeline of their shipments
CREATE POLICY "Users can view timeline of their shipments"
ON public.shipment_timeline FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.shipments
        WHERE shipments.id = shipment_timeline.shipment_id
        AND shipments.user_id = auth.uid()
    )
);

-- Create flight_bookings table for air ticket orders
CREATE TABLE public.flight_bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    booking_ref TEXT NOT NULL UNIQUE,
    pnr TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    -- Flight details
    airline TEXT,
    flight_number TEXT,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TEXT,
    arrival_date DATE,
    arrival_time TEXT,
    duration TEXT,
    stops INTEGER DEFAULT 0,
    stop_location TEXT,
    cabin_class TEXT DEFAULT 'economy' CHECK (cabin_class IN ('economy', 'premium', 'business', 'first')),
    trip_type TEXT DEFAULT 'round-trip' CHECK (trip_type IN ('one-way', 'round-trip')),
    return_date DATE,
    -- Passengers
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    -- Pricing
    price_per_person DECIMAL(10,2),
    total_price DECIMAL(10,2),
    -- Dates
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.flight_bookings ENABLE ROW LEVEL SECURITY;

-- Flight bookings policies
CREATE POLICY "Users can view their own flight bookings"
ON public.flight_bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own flight bookings"
ON public.flight_bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flight bookings"
ON public.flight_bookings FOR UPDATE
USING (auth.uid() = user_id);

-- Create passengers table for flight bookings
CREATE TABLE public.passengers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.flight_bookings(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    ticket_number TEXT,
    passport_number TEXT,
    is_adult BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;

-- Passengers policy
CREATE POLICY "Users can view passengers of their bookings"
ON public.passengers FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.flight_bookings
        WHERE flight_bookings.id = passengers.booking_id
        AND flight_bookings.user_id = auth.uid()
    )
);

CREATE POLICY "Users can add passengers to their bookings"
ON public.passengers FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.flight_bookings
        WHERE flight_bookings.id = booking_id
        AND flight_bookings.user_id = auth.uid()
    )
);

-- Create quotes table for quote requests
CREATE TABLE public.quotes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quote_ref TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('cargo', 'flight')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'expired')),
    -- Contact info
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    -- Cargo specific
    route TEXT,
    cargo_type TEXT,
    weight DECIMAL(10,2),
    contents TEXT,
    from_city TEXT,
    to_city TEXT,
    -- Flight specific
    trip_type TEXT,
    departure_date DATE,
    return_date DATE,
    adults INTEGER,
    children INTEGER,
    flight_class TEXT,
    -- Quote response
    quoted_price DECIMAL(10,2),
    quoted_at TIMESTAMP WITH TIME ZONE,
    -- Dates
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Quotes policies
CREATE POLICY "Users can view their own quotes"
ON public.quotes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quotes"
ON public.quotes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate tracking ID
CREATE OR REPLACE FUNCTION public.generate_tracking_id()
RETURNS TEXT AS $$
BEGIN
    RETURN 'WC-SH-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to generate booking ref
CREATE OR REPLACE FUNCTION public.generate_booking_ref()
RETURNS TEXT AS $$
BEGIN
    RETURN 'WC-FL-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to generate quote ref
CREATE OR REPLACE FUNCTION public.generate_quote_ref()
RETURNS TEXT AS $$
BEGIN
    RETURN 'WC-QT-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON public.shipments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flight_bookings_updated_at
    BEFORE UPDATE ON public.flight_bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();