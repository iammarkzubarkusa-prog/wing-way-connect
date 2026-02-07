import { Monitor, Truck, Plane, Home, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Monitor,
    title: "Book Online",
    description: "Request a quote or book online in minutes. Or call us directly.",
    number: "01",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Truck,
    title: "We Pick Up",
    description: "Our team collects your package from your doorstep at your convenience.",
    number: "02",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Plane,
    title: "Safe Transit",
    description: "Your cargo flies safely with real-time tracking at every step.",
    number: "03",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: Home,
    title: "Delivered",
    description: "Door-to-door delivery to recipient with confirmation.",
    number: "04",
    color: "from-purple-500 to-purple-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-padding overflow-hidden">
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
            How It Works
          </span>
          <h2 className="section-title">
            Simple <span className="text-gradient">4-Step</span> Process
          </h2>
          <p className="section-subtitle mx-auto">
            From booking to delivery — hassle-free shipping in just a few steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-border via-primary/30 to-border" />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative"
                >
                  <div className="text-center relative">
                    {/* Icon container */}
                    <div className="relative inline-flex mb-6">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-xl`}>
                        <Icon className="h-9 w-9 sm:h-10 sm:w-10" />
                      </div>
                      {/* Step number badge */}
                      <span className="absolute -top-2 -right-2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card text-foreground text-sm font-bold flex items-center justify-center shadow-premium border border-border/50">
                        {step.number}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px] mx-auto">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow between steps - mobile/tablet */}
                  {index < steps.length - 1 && (
                    <div className="hidden sm:flex lg:hidden absolute -right-4 top-10 text-border">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
