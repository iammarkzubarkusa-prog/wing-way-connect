import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, Plane, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function TrackingBar() {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track-shipment?id=${encodeURIComponent(trackingId.trim())}`);
    }
  };

  const sampleIds = [
    { id: "WC-SH-10245", type: "cargo", icon: Package },
    { id: "WC-SH-20891", type: "cargo", icon: Package },
    { id: "WC-FL-30567", type: "flight", icon: Plane },
  ];

  return (
    <section className="py-6 sm:py-8 -mt-6 sm:-mt-8 relative z-10">
      <div className="container-wacc">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-cta/20 to-primary/20 rounded-3xl blur-xl opacity-50" />
          
          <div className="relative bg-card rounded-2xl sm:rounded-3xl shadow-premium border border-border/50 p-5 sm:p-8 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display">
                Track Your Shipment
              </h2>
            </div>
            
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter Tracking ID (e.g. WC-SH-10245)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="pl-12 h-12 sm:h-14 text-base rounded-xl border-border/50 focus:border-primary focus:ring-primary/20 bg-muted/30"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300"
              >
                <span className="hidden sm:inline">Track Now</span>
                <span className="sm:hidden">Track</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </form>

            {/* Sample IDs */}
            <div className="mt-5 sm:mt-6">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Try sample tracking IDs:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {sampleIds.map((sample) => {
                  const Icon = sample.icon;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        setTrackingId(sample.id);
                        navigate(`/track-shipment?id=${sample.id}`);
                      }}
                      className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors touch-target"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="font-mono font-medium">{sample.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
