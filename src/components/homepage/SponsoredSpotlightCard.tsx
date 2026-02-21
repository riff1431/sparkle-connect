import { Star, MapPin, DollarSign, Shield, Clock, Eye, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { trackSponsoredClick } from "@/hooks/useSponsoredListings";
import bgSponsored from "@/assets/bg-sponsored.png";

interface SponsoredCleaner {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  startingPrice: number;
  services: string[];
  isVerified: boolean;
}

const SponsoredSpotlightCard = ({ cleaner, listingId }: { cleaner: SponsoredCleaner; listingId: string }) => {
  const handleQuoteClick = () => trackSponsoredClick(listingId, "quote");
  const handleBookClick = () => trackSponsoredClick(listingId, "book");

  return (
    <div className="rounded-2xl border border-border shadow-lg overflow-hidden relative">
      <img src={bgSponsored} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="p-5 relative">
        <div className="flex gap-5">
          {/* Image */}
          <div className="shrink-0">
            <div className="w-24 h-28 rounded-xl overflow-hidden shadow-md border-2 border-white ring-1 ring-border">
              <img src={cleaner.image} alt={cleaner.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1.5">
              <h4 className="font-heading font-bold text-foreground text-lg">{cleaner.name}</h4>
              {cleaner.isVerified && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0 font-semibold">
                  <Shield className="h-3 w-3 mr-0.5" /> Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(cleaner.rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                ))}
              </div>
              <span className="font-bold text-sm">{cleaner.rating}</span>
              <span className="flex items-center gap-1 text-sm text-secondary font-semibold">
                <DollarSign className="h-3.5 w-3.5" /> Starting ${cleaner.startingPrice}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {cleaner.location}
              {cleaner.isVerified && (
                <span className="flex items-center gap-1 ml-3 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> Most responsive
                </span>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="shrink-0 flex flex-col gap-2.5 justify-center">
            <Button
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-6 py-2 rounded-lg shadow-sm text-sm"
              onClick={handleQuoteClick}
            >
              Request Quote
            </Button>
            <Button
              className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold px-6 py-2 rounded-lg shadow-sm text-sm"
              asChild
              onClick={handleBookClick}
            >
              <Link to={`/cleaner/${cleaner.id}`}>Book Now</Link>
            </Button>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Clock className="h-3.5 w-3.5" />
            Starting at <span className="text-foreground font-bold">${cleaner.startingPrice}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <DollarSign className="h-3.5 w-3.5" />
            Consults at <span className="text-foreground font-bold">${cleaner.startingPrice}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Eye className="h-3.5 w-3.5" />
            Visit
          </span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold text-xs px-4 rounded-lg"
            onClick={handleQuoteClick}
          >
            Request Quote <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SponsoredSpotlightCard;
