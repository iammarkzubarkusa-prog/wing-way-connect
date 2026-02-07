-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.generate_tracking_id()
RETURNS TEXT AS $$
BEGIN
    RETURN 'WC-SH-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.generate_booking_ref()
RETURNS TEXT AS $$
BEGIN
    RETURN 'WC-FL-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.generate_quote_ref()
RETURNS TEXT AS $$
BEGIN
    RETURN 'WC-QT-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql SET search_path = public;