import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import bgHero from "@/assets/bg-hero.png";
import heroCleaners from "@/assets/hero-cleaners.png";

const ThreeBackground = lazy(() => import("./ThreeBackground"));

const categories = ["A+", "Airbnb", "Office", "Windeer", "Sunstruction", "Airbnb", "Construction", "Full Home", "Office"];

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
      </div>

      {/* Subtle Three.js particles */}
      <Suspense fallback={null}>
        <ThreeBackground />
      </Suspense>

      <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-14 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Left Content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-tight mb-2 sm:mb-3"
            >
              Search & Book Trusted Cleaners
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-5"
            >
              Find reliable cleaning companies near you.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className={`flex items-center glass-strong rounded-xl shadow-md mb-4 w-full max-w-lg transition-all duration-300 ${
                isFocused ? "shadow-lg ring-2 ring-primary/20" : ""
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
              <Button type="submit" variant="secondary" size="sm" className="m-1.5 px-4 sm:px-5 rounded-lg font-semibold shrink-0">
                <Search className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </motion.form>

            {/* Category Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-1.5 sm:gap-2"
            >
              {categories.map((cat, i) => (
                <button
                  key={`${cat}-${i}`}
                  onClick={() => navigate(`/search?service=${encodeURIComponent(cat)}`)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    i === 0
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "glass text-foreground hover:bg-primary/5 hover:border-primary/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right Hero Image */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="rounded-2xl overflow-hidden">
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
