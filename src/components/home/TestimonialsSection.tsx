import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/mockData";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-secondary/50 overflow-hidden">
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
            <Star className="h-4 w-4 fill-cta text-cta" />
            Customer Reviews
          </span>
          <h2 className="section-title">
            What Our <span className="text-gradient">Customers</span> Say
          </h2>
          <p className="section-subtitle mx-auto">
            Trusted by families and businesses across Canada and Bangladesh
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="relative h-full bg-card rounded-2xl border border-border/50 p-6 sm:p-8 shadow-premium hover:shadow-premium-lg hover:-translate-y-1 transition-all duration-500">
                {/* Quote icon */}
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Quote className="h-5 w-5 text-primary" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-cta text-cta" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-foreground mb-6 leading-relaxed text-base sm:text-lg">
                  "{testimonial.text}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-base sm:text-lg">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      {testimonial.location.includes("Canada") ? "🇨🇦" : "🇧🇩"}
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 sm:mt-16"
        >
          <div className="bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-premium border border-border/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
              {[
                { value: "4.9", label: "Customer Rating", suffix: "/5" },
                { value: "50K+", label: "Packages Sent" },
                { value: "99%", label: "On-Time Delivery" },
                { value: "10K+", label: "Happy Customers" },
              ].map((stat, index) => (
                <div key={stat.label}>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-1">
                    {stat.value}
                    {stat.suffix && <span className="text-lg sm:text-xl text-muted-foreground">{stat.suffix}</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
