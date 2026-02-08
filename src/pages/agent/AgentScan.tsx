import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import QRScanner from "@/components/qr/QRScanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle, Package } from "lucide-react";

export default function AgentScan() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scannedData, setScannedData] = useState<{ id: string } | null>(null);
  const [shipmentInfo, setShipmentInfo] = useState<any>(null);
  const [scanType, setScanType] = useState("checkpoint");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScan = async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.id && parsed.type === 'shipment') {
        setScannedData(parsed);
        const { data: shipment } = await supabase
          .from('shipments')
          .select('*')
          .eq('tracking_id', parsed.id)
          .maybeSingle();
        
        if (shipment) {
          setShipmentInfo(shipment);
          toast({ title: "Shipment found! ✅", description: `Tracking: ${parsed.id}` });
        } else {
          toast({ title: "Shipment not found", description: "No shipment found for this QR code", variant: "destructive" });
        }
      }
    } catch {
      toast({ title: "Invalid QR code", description: "This QR code is not a WACC shipment", variant: "destructive" });
    }
  };

  const handleSubmitScan = async () => {
    if (!user || !shipmentInfo) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('shipment_scans').insert({
        shipment_id: shipmentInfo.id,
        scanned_by: user.id,
        scan_type: scanType,
        location: location || null,
        notes: notes || null,
      });

      if (error) throw error;

      if (scanType === 'delivery') {
        await supabase.from('shipments').update({ status: 'delivered', actual_delivery: new Date().toISOString() }).eq('id', shipmentInfo.id);
      }

      const scanTypeLabels: Record<string, string> = {
        pickup: "Picked up", handover: "Handed over",
        delivery: "Delivery completed", checkpoint: "Checkpoint passed"
      };

      await supabase.from('shipment_timeline').insert({
        shipment_id: shipmentInfo.id,
        status: scanType === 'delivery' ? 'delivered' : shipmentInfo.status,
        description: scanTypeLabels[scanType] + (location ? ` - ${location}` : ''),
        location: location || null,
        is_current: scanType === 'delivery',
      });

      setScanSuccess(true);
      toast({ title: "Scan successful! ✅", description: scanTypeLabels[scanType] });
    } catch (e: any) {
      toast({ title: "Scan failed", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetScan = () => {
    setScannedData(null);
    setShipmentInfo(null);
    setScanType("checkpoint");
    setLocation("");
    setNotes("");
    setScanSuccess(false);
  };

  if (scanSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold font-display mb-2">Scan Complete!</h2>
        <p className="text-muted-foreground mb-6">Tracking: {scannedData?.id}</p>
        <Button onClick={resetScan} className="bg-cta hover:bg-cta/90 text-cta-foreground">Scan Another</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold font-display mb-6">QR Scan</h1>

      {!shipmentInfo ? (
        <QRScanner onScan={handleScan} onError={(err) => toast({ title: "Camera error", description: err, variant: "destructive" })} />
      ) : (
        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-border/50 p-5">
            <div className="flex items-center gap-3 mb-3">
              <Package className="h-6 w-6 text-primary" />
              <div>
                <p className="font-bold text-primary">{scannedData?.id}</p>
                <p className="text-sm text-muted-foreground">{shipmentInfo.route === 'bd-to-ca' ? '🇧🇩→🇨🇦' : '🇨🇦→🇧🇩'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-muted-foreground">Sender</p><p className="font-medium">{shipmentInfo.sender_name}</p></div>
              <div><p className="text-muted-foreground">Receiver</p><p className="font-medium">{shipmentInfo.receiver_name}</p></div>
              <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{shipmentInfo.receiver_phone}</p></div>
              <div><p className="text-muted-foreground">Weight</p><p className="font-medium">{shipmentInfo.weight || '-'} kg</p></div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label>Scan Type</Label>
              <Select value={scanType} onValueChange={setScanType}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="handover">Handover</SelectItem>
                  <SelectItem value="checkpoint">Checkpoint</SelectItem>
                  <SelectItem value="delivery">Delivery (Complete)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location</Label>
              <Input placeholder="e.g. Dhaka Office" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Input placeholder="Any comments..." value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1.5" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={resetScan}>Cancel</Button>
              <Button className="flex-1 bg-cta hover:bg-cta/90 text-cta-foreground" onClick={handleSubmitScan} disabled={submitting}>
                {submitting ? "Saving..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
