import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface QRGeneratorProps {
  trackingId: string;
  senderName: string;
  receiverName: string;
  receiverPhone: string;
  route: string;
  weight?: number | null;
  packages?: number | null;
}

export default function QRGenerator({ 
  trackingId, senderName, receiverName, receiverPhone, route, weight, packages 
}: QRGeneratorProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const qrData = JSON.stringify({
    id: trackingId,
    type: 'shipment',
  });

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Shipment Label - ${trackingId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .label { border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 4px 0 0; font-size: 12px; color: #666; }
            .tracking { text-align: center; font-size: 20px; font-weight: bold; margin: 10px 0; letter-spacing: 2px; }
            .qr { text-align: center; margin: 15px 0; }
            .info { font-size: 13px; }
            .info .row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed #ddd; }
            .info .label-text { color: #666; }
            .route { text-align: center; font-size: 18px; margin: 10px 0; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="header">
              <h1>WACC</h1>
              <p>Worldwide Air Cargo & Courier</p>
            </div>
            <div class="tracking">${trackingId}</div>
            <div class="route">${route === 'bd-to-ca' ? '🇧🇩 Bangladesh → Canada 🇨🇦' : '🇨🇦 Canada → Bangladesh 🇧🇩'}</div>
            <div class="qr">${content.querySelector('svg')?.outerHTML || ''}</div>
            <div class="info">
              <div class="row"><span class="label-text">Sender:</span><span>${senderName}</span></div>
              <div class="row"><span class="label-text">Receiver:</span><span>${receiverName}</span></div>
              <div class="row"><span class="label-text">Phone:</span><span>${receiverPhone}</span></div>
              <div class="row"><span class="label-text">Weight:</span><span>${weight || '-'} kg</span></div>
              <div class="row"><span class="label-text">Packages:</span><span>${packages || 1}</span></div>
            </div>
          </div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-3">
      <div ref={printRef} className="bg-card border border-border rounded-xl p-4 text-center">
        <QRCodeSVG value={qrData} size={120} level="M" />
        <p className="text-xs text-muted-foreground mt-2">{trackingId}</p>
      </div>
      <Button variant="outline" size="sm" className="w-full" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-2" />
        প্রিন্ট লেবেল
      </Button>
    </div>
  );
}
