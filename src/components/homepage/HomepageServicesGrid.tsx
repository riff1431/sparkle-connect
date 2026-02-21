import { Link } from "react-router-dom";
import { Star, Clock, MapPin, ChevronRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";

const useHomepageServices = () => {
  return useQuery({
    queryKey: ["homepage-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_listings")
        .select("*, cleaner_profiles(business_name, profile_image, is_verified, service_areas)")
        .eq("is_active", true)
        .order("views_count", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });
};

const ServiceCard = ({ service }: { service: any }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <Link
      to={`/services/${service.id}`}
      className="group block rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={service.image_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop"}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-[10px] px-2 py-0 font-semibold">
            {service.category}
          </Badge>
          {service.cleaner_profiles?.is_verified && (
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
              Verified
            </Badge>
          )}
        </div>
        <h4 className="font-heading font-bold text-foreground text-sm line-clamp-1 mb-1 group-hover:text-primary transition-colors">
          {service.title}
        </h4>
        <p className="text-muted-foreground text-xs line-clamp-2 mb-3">{service.description}</p>

        <div className="flex items-center gap-2 mb-3">
          {service.cleaner_profiles?.profile_image && (
            <img
              src={service.cleaner_profiles.profile_image}
              alt=""
              className="w-5 h-5 rounded-full object-cover"
            />
          )}
          <span className="text-xs text-muted-foreground font-medium truncate">
            {service.cleaner_profiles?.business_name || "Service Provider"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {service.duration_hours && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {service.duration_hours}h
              </span>
            )}
            {service.cleaner_profiles?.service_areas?.[0] && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {service.cleaner_profiles.service_areas[0]}
              </span>
            )}
          </div>
          <span className="font-bold text-foreground text-sm">
            ${service.price}
            <span className="text-xs font-normal text-muted-foreground">/{service.price_type}</span>
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

const HomepageServicesGrid = () => {
  const { data: services, isLoading } = useHomepageServices();
  const revealRef = useScrollReveal<HTMLDivElement>({ y: 40 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-7 w-44" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) return null;

  return (
    <div ref={revealRef} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-heading font-bold text-foreground text-xl">Popular Services</h3>
        </div>
        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400 }}>
          <Link
            to="/services"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default HomepageServicesGrid;
