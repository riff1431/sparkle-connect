import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Shield, Star, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import bgHero from "@/assets/bg-hero.png";
import heroCleaners from "@/assets/hero-cleaners.png";

const ThreeBackground = lazy(() => import("./ThreeBackground"));

const stats = [
  { value: "2,500+", label: "Verified Cleaners", icon: Shield },
  { value: "50,000+", label: "Happy Customers", icon: Users },
  { value: "4.9", label: "Average Rating", icon: Star },
];

const categories = ["A+", "Airbnb", "Office", "Deep Clean", "Construction", "Full Home"];

const HomepageHero = () => {
  const [location, setLocation] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={bgHero} alt="" className="w-full h-full object-cover" />
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-transparent to-primary/5" />
      </div>

      {/* Three.js particles */}
      <Suspense fallback={null}>
        <ThreeBackground />
      </Suspense>

      <div className="container mx-auto px-4 py-10 sm:py-14 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/20 mb-4 sm:mb-5"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-semibold text-foreground">Canada's #1 Cleaning Marketplace</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-foreground leading-[1.1] mb-3 sm:mb-4"
            >
              Find & Book{" "}
              <span className="text-gradient-primary">Trusted Cleaners</span>
              {" "}Near You
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-5 sm:mb-7 max-w-lg"
            >
              Compare prices, read reviews, and book vetted professionals — all in one place. Free quotes in minutes.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className={`flex items-center glass-strong rounded-xl shadow-md mb-3 w-full max-w-lg transition-all duration-300 ${
                isFocused ? "shadow-lg ring-2 ring-primary/20 sm:scale-[1.01]" : ""
              }`}
            >
              <div className="flex items-center flex-1 px-3 sm:px-4 py-2.5 sm:py-3 gap-2">
                <MapPin className={`h-4 w-4 shrink-0 transition-colors duration-200 ${isFocused ? "text-primary" : "text-muted-foreground"}`} />
                <input
                  type="text"
                  placeholder="Enter your address or postal code"
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground min-w-0"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
              <Button type="submit" variant="secondary" size="sm" className="m-1.5 px-4 sm:px-5 rounded-lg font-semibold transition-transform duration-200 hover:scale-105 active:scale-95 shrink-0">
                <Search className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </motion.form>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8"
            >
              <Button
                onClick={() => navigate("/search")}
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold px-5 sm:px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Browse Cleaners
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/for-cleaners")}
                className="font-semibold px-5 sm:px-6 py-2.5 rounded-lg border-primary/30 text-primary hover:bg-primary/5"
              >
                Join as a Cleaner
              </Button>
            </motion.div>

            {/* Category Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8"
            >
              {categories.map((cat, i) => (
                <motion.button
                  key={`${cat}-${i}`}
                  onClick={() => navigate(`/search?service=${encodeURIComponent(cat)}`)}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    i === 0
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "glass text-foreground hover:bg-primary/5 hover:border-primary/30"
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4 sm:gap-6"
            >
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10">
                    <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground text-xs sm:text-sm leading-tight">{stat.value}</p>
                    <p className="text-muted-foreground text-[10px] sm:text-xs leading-tight">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Hero Image */}
          <motion.div
            className="hidden lg:block relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* Floating badges */}
            <motion.div
              className="absolute -top-2 -left-4 z-10 glass-strong rounded-xl px-3 py-2 shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-secondary" />
                <span className="text-xs font-bold text-foreground">100% Verified</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-2 -right-2 z-10 glass-strong rounded-xl px-3 py-2 shadow-lg"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-xs font-bold text-foreground">4.9/5</span>
              </div>
            </motion.div>

            <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-border/30">
              <img
                src={heroCleaners}
                alt="Professional cleaning team"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomepageHero;
