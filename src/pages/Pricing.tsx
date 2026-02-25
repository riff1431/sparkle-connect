import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    features: ["Browse & search cleaners", "Read reviews", "Basic booking", "Email support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/month",
    description: "For regular customers",
    features: ["Everything in Free", "Priority booking", "Booking discounts", "Express support", "Booking history & analytics"],
    cta: "Go Premium",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$29.99",
    period: "/month",
    description: "For businesses & offices",
    features: ["Everything in Premium", "Multiple locations", "Team management", "Dedicated account manager", "Custom invoicing"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground">Choose the plan that's right for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 flex flex-col ${plan.highlighted ? "border-primary bg-primary/5 shadow-lg scale-105" : "bg-card"}`}
              >
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className="w-full"
                  onClick={() => navigate("/auth")}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
