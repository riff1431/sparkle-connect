import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp,
  Calendar,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

interface Booking {
  id: string;
  service_type: string;
  scheduled_date: string;
  status: string;
  service_price: number;
}

const CleanerEarnings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("cleaner_id", user.id)
          .eq("status", "completed")
          .order("scheduled_date", { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthBookings = bookings.filter(b => {
    const date = new Date(b.scheduled_date);
    return date >= thisMonthStart && date <= thisMonthEnd;
  });

  const lastMonthBookings = bookings.filter(b => {
    const date = new Date(b.scheduled_date);
    return date >= lastMonthStart && date <= lastMonthEnd;
  });

  const thisMonthEarnings = thisMonthBookings.reduce((sum, b) => sum + Number(b.service_price), 0);
  const lastMonthEarnings = lastMonthBookings.reduce((sum, b) => sum + Number(b.service_price), 0);
  const totalEarnings = bookings.reduce((sum, b) => sum + Number(b.service_price), 0);

  const percentChange = lastMonthEarnings > 0 
    ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings * 100).toFixed(1)
    : thisMonthEarnings > 0 ? "100" : "0";

  const statCards = [
    {
      title: "This Month",
      value: `$${thisMonthEarnings.toFixed(0)}`,
      subtitle: `${thisMonthBookings.length} jobs completed`,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Last Month",
      value: `$${lastMonthEarnings.toFixed(0)}`,
      subtitle: `${lastMonthBookings.length} jobs completed`,
      icon: DollarSign,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Total Earnings",
      value: `$${totalEarnings.toFixed(0)}`,
      subtitle: `${bookings.length} total jobs`,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Growth",
      value: `${Number(percentChange) >= 0 ? "+" : ""}${percentChange}%`,
      subtitle: "vs last month",
      icon: TrendingUp,
      color: Number(percentChange) >= 0 ? "text-green-500" : "text-red-500",
      bgColor: Number(percentChange) >= 0 ? "bg-green-500/10" : "bg-red-500/10",
    },
  ];

  // Group bookings by month for history
  const groupedByMonth = bookings.reduce((acc, booking) => {
    const month = format(new Date(booking.scheduled_date), "MMMM yyyy");
    if (!acc[month]) {
      acc[month] = { bookings: [], total: 0 };
    }
    acc[month].bookings.push(booking);
    acc[month].total += Number(booking.service_price);
    return acc;
  }, {} as Record<string, { bookings: Booking[]; total: number }>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Earnings</h1>
        <p className="text-muted-foreground">Track your income from completed cleaning jobs.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Earnings History */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedByMonth).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedByMonth).map(([month, data]) => (
                <div key={month}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{month}</h3>
                    <span className="text-lg font-bold text-primary">
                      ${data.total.toFixed(0)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {data.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium text-foreground">{booking.service_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(booking.scheduled_date), "MMM d, yyyy")}
                          </p>
                        </div>
                        <span className="font-semibold text-foreground">
                          ${Number(booking.service_price).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No earnings yet</h3>
              <p className="text-muted-foreground">
                Complete jobs to start tracking your earnings here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CleanerEarnings;
