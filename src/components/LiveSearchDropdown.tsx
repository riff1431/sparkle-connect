import { useNavigate } from "react-router-dom";
import { MapPin, Shield, Star, Loader2 } from "lucide-react";

interface LiveSearchResult {
  id: string;
  business_name: string;
  profile_image: string | null;
  services: string[];
  service_areas: string[];
  hourly_rate: number;
  is_verified: boolean;
}

interface LiveSearchDropdownProps {
  results: LiveSearchResult[];
  isLoading: boolean;
  query: string;
  onSelect?: () => void;
  className?: string;
}

const LiveSearchDropdown = ({ results, isLoading, query, onSelect, className = "" }: LiveSearchDropdownProps) => {
  const navigate = useNavigate();

  if (query.length < 2) return null;

  return (
    <div className={`absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden ${className}`}>
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
        </div>
      ) : results.length === 0 ? (
        <div className="py-4 px-4 text-center text-sm text-muted-foreground">
          No cleaners found for "{query}"
        </div>
      ) : (
        <>
          {results.map((result) => (
            <button
              key={result.id}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors text-left border-b border-border/50 last:border-b-0"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect?.();
                navigate(`/cleaner/${result.id}`);
              }}
            >
              <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                {result.profile_image ? (
                  <img src={result.profile_image} alt={result.business_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-semibold">
                    {result.business_name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm text-foreground truncate">{result.business_name}</span>
                  {result.is_verified && (
                    <Shield className="h-3.5 w-3.5 text-secondary shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" />
                    {result.service_areas.slice(0, 2).join(", ") || "Various"}
                  </span>
                  <span>·</span>
                  <span>${result.hourly_rate}/hr</span>
                </div>
              </div>
            </button>
          ))}
          <button
            className="w-full py-2.5 text-center text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect?.();
              navigate(`/search?q=${encodeURIComponent(query)}`);
            }}
          >
            See all results for "{query}"
          </button>
        </>
      )}
    </div>
  );
};

export default LiveSearchDropdown;
