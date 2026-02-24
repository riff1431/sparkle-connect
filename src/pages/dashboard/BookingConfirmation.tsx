import { useLocation, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  CheckCircle2,
  MessageSquare,
  CalendarDays,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BookingConfirmationState {
  bookingId: string;
  conversationId: string;
  serviceName: string;
  cleanerName: string;
  scheduledDate: string;
  scheduledTime: string;
  durationHours: number;
  price: number;
}

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as BookingConfirmationState | null;

  if (!state) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center max-w-lg">
          <h1 className="text-2xl font-heading font-bold mb-4">No Booking Found</h1>
          <p className="text-muted-foreground mb-6">
            It looks like you navigated here directly. Please book a service first.
          </p>
          <Button asChild>
            <Link to="/services">Browse Services</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const {
    bookingId,
    conversationId,
    serviceName,
    cleanerName,
    scheduledDate,
    scheduledTime,
    durationHours,
    price,
  } = state;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-xl">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-5">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Your cleaning service has been instantly booked and confirmed.
          </p>
        </div>

        {/* Booking summary card */}
        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Instant Booking
            </div>

            <h2 className="text-xl font-heading font-semibold">{serviceName}</h2>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(scheduledDate), "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{scheduledTime} · {durationHours} hours</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Cleaner: {cleanerName}</span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">${price}</span>
            </div>
          </CardContent>
        </Card>

        {/* Primary CTA — Chat with Cleaner */}
        <Button
          size="lg"
          className="w-full h-14 text-base gap-2 mb-4"
          onClick={() => navigate(`/dashboard/messages?conversation=${conversationId}`)}
        >
          <MessageSquare className="h-5 w-5" />
          Chat with Cleaner
        </Button>

        {/* Secondary actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-11"
            asChild
          >
            <Link to={`/dashboard/booking/${bookingId}`}>
              View Booking
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-11"
            asChild
          >
            <Link to="/dashboard/upcoming">
              My Appointments
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;
