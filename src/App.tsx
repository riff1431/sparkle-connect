import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import GlobalFontProvider from "@/components/GlobalFontProvider";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import Search from "./pages/Search";
import CleanerPublicProfile from "./pages/CleanerProfile";
import Auth from "./pages/Auth";
import ForCleaners from "./pages/ForCleaners";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import UpcomingBookings from "./pages/dashboard/UpcomingBookings";
import BookingHistory from "./pages/dashboard/BookingHistory";
import Addresses from "./pages/dashboard/Addresses";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import Subscription from "./pages/dashboard/Subscription";
import MyJobs from "./pages/dashboard/MyJobs";
import BookingDetail from "./pages/dashboard/BookingDetail";
import CleanerDashboardLayout from "./components/cleaner-dashboard/CleanerDashboardLayout";
import CleanerDashboardOverview from "./pages/cleaner-dashboard/CleanerDashboardOverview";
import CleanerBookingRequests from "./pages/cleaner-dashboard/CleanerBookingRequests";
import CleanerSchedule from "./pages/cleaner-dashboard/CleanerSchedule";
import CleanerProfile from "./pages/cleaner-dashboard/CleanerProfile";
import CleanerEarnings from "./pages/cleaner-dashboard/CleanerEarnings";
import CleanerSettings from "./pages/cleaner-dashboard/CleanerSettings";
import CleanerSubscription from "./pages/cleaner-dashboard/CleanerSubscription";
import AdminDashboardLayout from "./components/admin-dashboard/AdminDashboardLayout";
import AdminDashboardOverview from "./pages/admin-dashboard/AdminDashboardOverview";
import AdminUsers from "./pages/admin-dashboard/AdminUsers";
import AdminCleaners from "./pages/admin-dashboard/AdminCleaners";
import AdminBookings from "./pages/admin-dashboard/AdminBookings";
import AdminPaymentGateway from "./pages/admin-dashboard/AdminPaymentGateway";
import AdminPaymentVerification from "./pages/admin-dashboard/AdminPaymentVerification";
import AdminSettings from "./pages/admin-dashboard/AdminSettings";
import AdminSubscriptionPlans from "./pages/admin-dashboard/AdminSubscriptionPlans";
import AdminSubscriptionVerification from "./pages/admin-dashboard/AdminSubscriptionVerification";
import AdminSponsoredListings from "./pages/admin-dashboard/AdminSponsoredListings";
import AdminCleanerOfTheWeek from "./pages/admin-dashboard/AdminCleanerOfTheWeek";
import AdminThemeManagement from "./pages/admin-dashboard/AdminThemeManagement";
import AdminServiceListings from "./pages/admin-dashboard/AdminServiceListings";
import AdminJobs from "./pages/admin-dashboard/AdminJobs";
import CleanerSponsorship from "./pages/cleaner-dashboard/CleanerSponsorship";
import Reviews from "./pages/Reviews";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import FindServices from "./pages/FindServices";
import ServiceDetail from "./pages/ServiceDetail";
import CleanerServiceListings from "./pages/cleaner-dashboard/CleanerServiceListings";
import CleanerQuoteRequests from "./pages/cleaner-dashboard/CleanerQuoteRequests";
import MyQuotes from "./pages/dashboard/MyQuotes";
import CustomerMessages from "./pages/dashboard/Messages";
import CustomerInvoices from "./pages/dashboard/Invoices";
import CleanerMessages from "./pages/cleaner-dashboard/CleanerMessages";
import CleanerInvoices from "./pages/cleaner-dashboard/CleanerInvoices";
import AdminMessages from "./pages/admin-dashboard/AdminMessages";
import AdminInvoices from "./pages/admin-dashboard/AdminInvoices";
import AdminQuoteRequests from "./pages/admin-dashboard/AdminQuoteRequests";
import AdminNotifications from "./pages/admin-dashboard/AdminNotifications";
import CustomerWallet from "./pages/dashboard/Wallet";
import CleanerWallet from "./pages/cleaner-dashboard/CleanerWallet";
import AdminWallets from "./pages/admin-dashboard/AdminWallets";
import NotFound from "./pages/NotFound";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";
const queryClient = new QueryClient();

const AnimatedApp = () => {
  useMessageNotifications();
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cleaner/:id" element={<CleanerPublicProfile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/for-cleaners" element={<ForCleaners />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/services" element={<FindServices />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        
        {/* Customer Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="upcoming" element={<UpcomingBookings />} />
          <Route path="history" element={<BookingHistory />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="my-jobs" element={<MyJobs />} />
          <Route path="booking/:id" element={<BookingDetail />} />
          <Route path="quotes" element={<MyQuotes />} />
          <Route path="messages" element={<CustomerMessages />} />
          <Route path="invoices" element={<CustomerInvoices />} />
          <Route path="wallet" element={<CustomerWallet />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Cleaner Dashboard Routes */}
        <Route path="/cleaner" element={<CleanerDashboardLayout />}>
          <Route path="dashboard" element={<CleanerDashboardOverview />} />
          <Route path="bookings" element={<CleanerBookingRequests />} />
          <Route path="schedule" element={<CleanerSchedule />} />
          <Route path="subscription" element={<CleanerSubscription />} />
          <Route path="sponsorship" element={<CleanerSponsorship />} />
          <Route path="profile" element={<CleanerProfile />} />
          <Route path="earnings" element={<CleanerEarnings />} />
          <Route path="settings" element={<CleanerSettings />} />
          <Route path="services" element={<CleanerServiceListings />} />
          <Route path="quotes" element={<CleanerQuoteRequests />} />
          <Route path="messages" element={<CleanerMessages />} />
          <Route path="invoices" element={<CleanerInvoices />} />
          <Route path="wallet" element={<CleanerWallet />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route path="dashboard" element={<AdminDashboardOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="cleaners" element={<AdminCleaners />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="subscriptions" element={<AdminSubscriptionPlans />} />
          <Route path="subscription-verification" element={<AdminSubscriptionVerification />} />
          <Route path="sponsored" element={<AdminSponsoredListings />} />
          <Route path="cleaner-of-the-week" element={<AdminCleanerOfTheWeek />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="payment-gateway" element={<AdminPaymentGateway />} />
          <Route path="payment-verification" element={<AdminPaymentVerification />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="theme" element={<AdminThemeManagement />} />
          <Route path="service-listings" element={<AdminServiceListings />} />
          <Route path="quotes" element={<AdminQuoteRequests />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="invoices" element={<AdminInvoices />} />
          <Route path="wallets" element={<AdminWallets />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GlobalFontProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedApp />
        </BrowserRouter>
      </TooltipProvider>
      </GlobalFontProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
