import { Shield, Star, DollarSign, Headphones, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  {
    icon: Shield,
    title: "100% Safe",
    description: "Secure handling with insurance options for your peace of mind",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Star,
    title: "Trusted Service",
    description: "Thousands of satisfied customers across Canada & Bangladesh",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: DollarSign,
    title: "Best Prices",
    description: "Competitive rates with no hidden fees or surprises",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always available in both Canada and Bangladesh",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const features = [
  "Both Way Shipping (Canada ↔ Bangladesh)",
  "Real-Time Package Tracking",
  "Door-to-Door Delivery",
  "Customs Clearance Assistance",
  "Insurance Coverage Available",
  "Dedicated Customer Support",
];

export default function TrustSection() {
  return (
    <section className="section-padding bg-secondary/50 mesh-gradient">
      <div className="container-wacc">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/5 rounded-full px-4 py-1.5 mb-4 border border-primary/10">
            Why Choose Us
          </span>
          <h2 className="section-title">
            Trusted by <span className="text-gradient">Thousands</span>
          </h2>
          <p className="text-xl text-muted-foreground mt-3">
            Safe • Trusted • Affordable
          </p>
        </motion.div>

        {/* Trust cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="text-center p-6 sm:p-8 rounded-2xl bg-card shadow-premium border border-border/50 hover:shadow-premium-lg hover:-translate-y-1 transition-all duration-500">
                  <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl ${item.bgColor} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Features list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-premium border border-border/50">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <span className="font-medium text-sm sm:text-base">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
