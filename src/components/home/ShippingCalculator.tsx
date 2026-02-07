import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Package, Plane, Ship, Truck, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import globalShipping3D from "@/assets/global-shipping-3d.png";
import cargoPlane3D from "@/assets/cargo-plane-3d.png";
import calculator3D from "@/assets/calculator-3d.png";

const destinations = [
  { value: "bangladesh", label: "Bangladesh", flag: "🇧🇩", baseRate: 8 },
  { value: "india", label: "India", flag: "🇮🇳", baseRate: 7 },
  { value: "pakistan", label: "Pakistan", flag: "🇵🇰", baseRate: 7.5 },
  { value: "uk", label: "United Kingdom", flag: "🇬🇧", baseRate: 12 },
  { value: "usa", label: "United States", flag: "🇺🇸", baseRate: 10 },
  { value: "uae", label: "UAE", flag: "🇦🇪", baseRate: 9 },
  { value: "saudi", label: "Saudi Arabia", flag: "🇸🇦", baseRate: 9.5 },
  { value: "malaysia", label: "Malaysia", flag: "🇲🇾", baseRate: 8.5 },
];

const serviceTypes = [
  { value: "express", label: "Express Air", icon: Plane, multiplier: 1.5, days: "3-5 days" },
  { value: "standard", label: "Standard Air", icon: Plane, multiplier: 1, days: "7-10 days" },
  { value: "sea", label: "Sea Freight", icon: Ship, multiplier: 0.4, days: "30-45 days" },
  { value: "ground", label: "Ground Cargo", icon: Truck, multiplier: 0.6, days: "15-20 days" },
];

export default function ShippingCalculator() {
  const [weight, setWeight] = useState("");
  const [destination, setDestination] = useState("");
  const [service, setService] = useState("");
  const [result, setResult] = useState<{ cost: number; days: string } | null>(null);

  const calculateCost = () => {
    if (!weight || !destination || !service) return;
    
    const destData = destinations.find(d => d.value === destination);
    const serviceData = serviceTypes.find(s => s.value === service);
    
    if (!destData || !serviceData) return;
    
    const cost = parseFloat(weight) * destData.baseRate * serviceData.multiplier;
    setResult({ cost: Math.round(cost * 100) / 100, days: serviceData.days });
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Floating 3D decorative images */}
      <motion.img
        src={cargoPlane3D}
        alt=""
        className="absolute top-10 right-0 w-32 md:w-48 opacity-20 pointer-events-none"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={calculator3D}
        alt=""
        className="absolute bottom-10 left-0 w-24 md:w-36 opacity-15 pointer-events-none"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-wacc">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - 3D Image & Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative">
              <img
                src={globalShipping3D}
                alt="Global Shipping Network"
                className="w-full max-w-lg mx-auto drop-shadow-2xl"
              />
              {/* Floating badges */}
              <motion.div
                className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold">50+ Countries</span>
                </div>
              </motion.div>
              <motion.div
                className="absolute bottom-8 right-4 bg-cta text-cta-foreground rounded-xl p-3 shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span className="text-sm font-semibold">Door to Door</span>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display mb-4">
                Calculate Your <span className="text-primary">Shipping Cost</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto lg:mx-0">
                Get instant quotes for your shipments worldwide. Transparent pricing with no hidden fees.
              </p>
            </div>
          </motion.div>

          {/* Right side - Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-background/80 backdrop-blur-lg border-border/50 shadow-2xl">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Shipping Calculator</h3>
                    <p className="text-sm text-muted-foreground">Get instant price estimate</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Weight Input */}
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-foreground font-medium">
                      Package Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter weight in kg"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="h-12 rounded-xl bg-muted/50 border-border focus:border-primary"
                    />
                  </div>

                  {/* Destination Select */}
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Destination Country</Label>
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((dest) => (
                          <SelectItem key={dest.value} value={dest.value}>
                            <span className="flex items-center gap-2">
                              <span>{dest.flag}</span>
                              <span>{dest.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Type */}
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Service Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {serviceTypes.map((svc) => (
                        <button
                          key={svc.value}
                          onClick={() => setService(svc.value)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                            service === svc.value
                              ? "border-primary bg-primary/10"
                              : "border-border bg-muted/30 hover:border-primary/50"
                          }`}
                        >
                          <svc.icon className={`h-5 w-5 mb-1 ${
                            service === svc.value ? "text-primary" : "text-muted-foreground"
                          }`} />
                          <p className="text-sm font-medium text-foreground">{svc.label}</p>
                          <p className="text-xs text-muted-foreground">{svc.days}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculate Button */}
                  <Button
                    onClick={calculateCost}
                    disabled={!weight || !destination || !service}
                    className="w-full h-12 rounded-xl bg-cta hover:bg-cta/90 text-cta-foreground text-lg font-semibold shadow-lg shadow-cta/20"
                  >
                    Calculate Cost
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  {/* Result Display */}
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20"
                    >
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Estimated Cost</p>
                        <p className="text-3xl font-bold text-primary">
                          ${result.cost.toFixed(2)} <span className="text-lg font-normal">CAD</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Delivery: <span className="font-medium text-foreground">{result.days}</span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Service Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Package, title: "Parcel Delivery", desc: "Small packages" },
            { icon: Plane, title: "Air Cargo", desc: "Fast shipping" },
            { icon: Ship, title: "Sea Freight", desc: "Bulk cargo" },
            { icon: Truck, title: "Ground Transport", desc: "Regional delivery" },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-4 md:p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
