import { MapPin } from "lucide-react";
import bgMapSidebar from "@/assets/bg-map-sidebar.png";

const MapPreviewCard = () => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* Map Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={bgMapSidebar} alt="Map preview" className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          <h4 className="font-heading font-bold text-foreground">Your Cleancs Nε 9</h4>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Cartt your r anea · Cleaning Guote · State · cearn
        </p>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Coroiglet
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            IMaaspens
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Neove · 0 d.l39
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapPreviewCard;
