import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import QRScanner from "@/components/qr/QRScanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle, Package, AlertCircle } from "lucide-react";

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
        // Fetch shipment details
        const { data: shipment } = await supabase
          .from('shipments')
          .select('*')
          .eq('tracking_id', parsed.id)
          .maybeSingle();
        
        if (shipment) {
          setShipmentInfo(shipment);
          toast({ title: "শিপমেন্ট পাওয়া গেছে! ✅", description: `ট্র্যাকিং: ${parsed.id}` });
        } else {
          toast({ title: "শিপমেন্ট পাওয়া যায়নি", description: "এই QR কোডের জন্য কোনো শিপমেন্ট নেই", variant: "destructive" });
        }
      }
    } catch {
      toast({ title: "অবৈধ QR কোড", description: "এই QR কোডটি WACC শিপমেন্টের নয়", variant: "destructive" });
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

      // If delivery scan, update shipment status
      if (scanType === 'delivery') {
        await supabase.from('shipments').update({ status: 'delivered', actual_delivery: new Date().toISOString() }).eq('id', shipmentInfo.id);
      }

      // Add timeline entry
      const scanTypeLabels: Record<string, string> = {
        pickup: "পিকআপ করা হয়েছে", handover: "হস্তান্তর করা হয়েছে",
        delivery: "ডেলিভারি সম্পন্ন", checkpoint: "চেকপয়েন্ট পার করেছে"
      };

      await supabase.from('shipment_timeline').insert({
        shipment_id: shipmentInfo.id,
        status: scanType === 'delivery' ? 'delivered' : shipmentInfo.status,
        description: scanTypeLabels[scanType] + (location ? ` - ${location}` : ''),
        location: location || null,
        is_current: scanType === 'delivery',
      });

      setScanSuccess(true);
      toast({ title: "স্ক্যান সফল! ✅", description: scanTypeLabels[scanType] });
    } catch (e: any) {
      toast({ title: "স্ক্যান ব্যর্থ", description: e.message, variant: "destructive" });
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
        <h2 className="text-2xl font-bold font-display mb-2">স্ক্যান সম্পন্ন!</h2>
        <p className="text-muted-foreground mb-6">ট্র্যাকিং: {scannedData?.id}</p>
        <Button onClick={resetScan} className="bg-cta hover:bg-cta/90 text-cta-foreground">আরেকটি স্ক্যান করুন</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold font-display mb-6">QR স্ক্যান</h1>

      {!shipmentInfo ? (
        <div>
          <QRScanner onScan={handleScan} onError={(err) => toast({ title: "ক্যামেরা সমস্যা", description: err, variant: "destructive" })} />
        </div>
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
              <div><p className="text-muted-foreground">প্রেরক</p><p className="font-medium">{shipmentInfo.sender_name}</p></div>
              <div><p className="text-muted-foreground">প্রাপক</p><p className="font-medium">{shipmentInfo.receiver_name}</p></div>
              <div><p className="text-muted-foreground">ফোন</p><p className="font-medium">{shipmentInfo.receiver_phone}</p></div>
              <div><p className="text-muted-foreground">ওজন</p><p className="font-medium">{shipmentInfo.weight || '-'} kg</p></div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label>স্ক্যান ধরন</Label>
              <Select value={scanType} onValueChange={setScanType}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">পিকআপ</SelectItem>
                  <SelectItem value="handover">হ্যান্ডওভার</SelectItem>
                  <SelectItem value="checkpoint">চেকপয়েন্ট</SelectItem>
                  <SelectItem value="delivery">ডেলিভারি (সম্পন্ন)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>লোকেশন</Label>
              <Input placeholder="যেমন: ঢাকা অফিস" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>নোট (ঐচ্ছিক)</Label>
              <Input placeholder="কিছু মন্তব্য..." value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1.5" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={resetScan}>বাতিল</Button>
              <Button className="flex-1 bg-cta hover:bg-cta/90 text-cta-foreground" onClick={handleSubmitScan} disabled={submitting}>
                {submitting ? "সেভ হচ্ছে..." : "কনফার্ম করুন"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
