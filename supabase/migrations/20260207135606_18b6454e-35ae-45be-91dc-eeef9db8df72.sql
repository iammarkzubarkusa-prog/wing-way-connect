
-- Add is_approved column to user_roles for agent approval
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Set existing admin roles as approved
UPDATE public.user_roles SET is_approved = true WHERE role = 'admin';

-- Add assigned_agent column to shipments
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS assigned_agent UUID;

-- Create shipment_scans table for QR scan tracking
CREATE TABLE public.shipment_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  scanned_by UUID NOT NULL,
  scan_type TEXT NOT NULL DEFAULT 'checkpoint',
  location TEXT,
  notes TEXT,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shipment_scans ENABLE ROW LEVEL SECURITY;

-- RLS policies for shipment_scans
CREATE POLICY "Admins can view all scans" ON public.shipment_scans
FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert scans" ON public.shipment_scans
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agents can view their scans" ON public.shipment_scans
FOR SELECT USING (scanned_by = auth.uid() AND public.has_role(auth.uid(), 'agent'::app_role));

CREATE POLICY "Agents can create scans" ON public.shipment_scans
FOR INSERT WITH CHECK (auth.uid() = scanned_by AND public.has_role(auth.uid(), 'agent'::app_role));

CREATE POLICY "Users can view scans of their shipments" ON public.shipment_scans
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.shipments 
  WHERE shipments.id = shipment_scans.shipment_id 
  AND shipments.user_id = auth.uid()
));

-- Agents can view assigned shipments
CREATE POLICY "Agents can view assigned shipments" ON public.shipments
FOR SELECT USING (assigned_agent = auth.uid() AND public.has_role(auth.uid(), 'agent'::app_role));

-- Agents can update assigned shipments (status updates)
CREATE POLICY "Agents can update assigned shipments" ON public.shipments
FOR UPDATE USING (assigned_agent = auth.uid() AND public.has_role(auth.uid(), 'agent'::app_role));

-- Allow admins to update user_roles (for approval)
CREATE POLICY "Admins can update roles" ON public.user_roles
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for shipment_scans
ALTER PUBLICATION supabase_realtime ADD TABLE public.shipment_scans;
