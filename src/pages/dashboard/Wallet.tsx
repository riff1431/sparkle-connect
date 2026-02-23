import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, Plus, Clock, CheckCircle, XCircle } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WalletPage = () => {
  const { wallet, transactions, topUpRequests, loading, requestTopUp } = useWallet();
  const { formatCurrency } = usePlatformSettings();
  const [topUpAmount, setTopUpAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) return;
    await requestTopUp(amount, paymentMethod);
    setTopUpAmount("");
    setDialogOpen(false);
  };

  const getTypeIcon = (type: string, amount: number) => {
    if (amount > 0 || ["top_up", "earning", "refund", "admin_credit"].includes(type)) {
      return <ArrowUpCircle className="h-4 w-4 text-primary" />;
    }
    return <ArrowDownCircle className="h-4 w-4 text-destructive" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified": return <Badge className="bg-primary/10 text-primary">Verified</Badge>;
      case "rejected": return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">My Wallet</h1>
          <p className="text-muted-foreground">Manage your wallet balance and transactions.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Top Up</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Top Up Wallet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Amount</label>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                After submitting, complete the payment and an admin will verify your top-up.
              </p>
              <Button onClick={handleTopUp} className="w-full" disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}>
                Submit Top-Up Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-primary/10">
              <WalletIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(wallet?.balance || 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Top-Ups */}
      {topUpRequests.filter(r => r.status === "pending").length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Pending Top-Up Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUpRequests.filter(r => r.status === "pending").map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{formatCurrency(req.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {req.payment_method === "bank_transfer" ? "Bank Transfer" : "Cash"} •{" "}
                      {format(new Date(req.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(txn.type, txn.amount)}
                    <div>
                      <p className="font-medium text-foreground capitalize">{txn.type.replace(/_/g, " ")}</p>
                      <p className="text-xs text-muted-foreground">
                        {txn.description || "—"} • {format(new Date(txn.created_at), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${txn.amount > 0 ? "text-primary" : "text-destructive"}`}>
                      {txn.amount > 0 ? "+" : ""}{formatCurrency(Math.abs(txn.amount))}
                    </p>
                    <p className="text-xs text-muted-foreground">Bal: {formatCurrency(txn.balance_after)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <WalletIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No transactions yet</h3>
              <p className="text-muted-foreground">Your transaction history will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top-Up Request History */}
      {topUpRequests.filter(r => r.status !== "pending").length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top-Up History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUpRequests.filter(r => r.status !== "pending").map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {req.status === "verified" ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{formatCurrency(req.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(req.created_at), "MMM d, yyyy")}
                        {req.rejection_reason && ` • ${req.rejection_reason}`}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalletPage;
