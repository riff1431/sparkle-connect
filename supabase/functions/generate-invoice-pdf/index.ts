import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invoiceId, sendEmail } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch invoice with related data
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      return new Response(JSON.stringify({ error: "Invoice not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch customer profile
    const { data: customer } = await supabase
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", invoice.customer_id)
      .single();

    // Fetch cleaner profile if exists
    let cleanerName = "N/A";
    if (invoice.cleaner_id) {
      const { data: cleanerProfile } = await supabase
        .from("cleaner_profiles")
        .select("business_name")
        .eq("user_id", invoice.cleaner_id)
        .single();
      cleanerName = cleanerProfile?.business_name || "N/A";
    }

    // Fetch platform settings
    const { data: settings } = await supabase
      .from("platform_settings")
      .select("platform_name, default_currency, support_email")
      .limit(1)
      .single();

    const platformName = settings?.platform_name || "The Cleaning Network";
    const currency = settings?.default_currency || "CAD";
    const supportEmail = settings?.support_email || "";

    const formatDate = (d: string) => {
      if (!d) return "N/A";
      return new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
    };

    // Build HTML invoice
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 40px; color: #1a1a2e; background: #fff; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #1a73e8; padding-bottom: 20px; }
  .company { font-size: 24px; font-weight: 700; color: #1a73e8; }
  .invoice-title { font-size: 32px; font-weight: 700; color: #1a1a2e; text-align: right; }
  .invoice-number { font-size: 14px; color: #666; text-align: right; margin-top: 4px; }
  .section { margin-bottom: 30px; }
  .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px; font-weight: 600; }
  .grid { display: flex; gap: 40px; }
  .grid > div { flex: 1; }
  .label { font-size: 12px; color: #888; margin-bottom: 2px; }
  .value { font-size: 14px; font-weight: 500; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  th { text-align: left; padding: 12px; background: #f0f4f8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #555; border-bottom: 2px solid #ddd; }
  td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
  .totals { margin-top: 20px; text-align: right; }
  .totals .row { display: flex; justify-content: flex-end; gap: 40px; padding: 6px 0; font-size: 14px; }
  .totals .total { font-size: 18px; font-weight: 700; color: #1a73e8; border-top: 2px solid #1a73e8; padding-top: 10px; margin-top: 6px; }
  .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
  .badge-paid { background: #e8f5e9; color: #2e7d32; }
  .badge-issued { background: #fff3e0; color: #e65100; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company">${platformName}</div>
      ${supportEmail ? `<div style="font-size:12px;color:#888;margin-top:4px;">${supportEmail}</div>` : ""}
    </div>
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-number">${invoice.invoice_number}</div>
      <div style="text-align:right;margin-top:8px;">
        <span class="badge ${invoice.status === "paid" ? "badge-paid" : "badge-issued"}">${invoice.status.toUpperCase()}</span>
      </div>
    </div>
  </div>

  <div class="grid section">
    <div>
      <div class="section-title">Bill To</div>
      <div class="value" style="font-weight:700;">${customer?.full_name || "Customer"}</div>
      ${customer?.email ? `<div class="value">${customer.email}</div>` : ""}
      ${customer?.phone ? `<div class="value">${customer.phone}</div>` : ""}
    </div>
    <div>
      <div class="section-title">Service Provider</div>
      <div class="value" style="font-weight:700;">${cleanerName}</div>
    </div>
    <div>
      <div class="section-title">Invoice Details</div>
      <div class="label">Date Issued</div>
      <div class="value">${formatDate(invoice.created_at)}</div>
      <div class="label">Service Date</div>
      <div class="value">${formatDate(invoice.service_date)}</div>
      ${invoice.due_date ? `<div class="label">Due Date</div><div class="value">${formatDate(invoice.due_date)}</div>` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Services</div>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${invoice.service_type}</td>
          <td style="text-align:right;">$${Number(invoice.amount).toFixed(2)} ${currency}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="totals">
    <div class="row"><span>Subtotal:</span><span>$${Number(invoice.amount).toFixed(2)}</span></div>
    <div class="row"><span>Platform Commission:</span><span>-$${Number(invoice.commission_amount).toFixed(2)}</span></div>
    <div class="row total"><span>Net Payout:</span><span>$${Number(invoice.net_amount).toFixed(2)}</span></div>
  </div>

  ${invoice.notes ? `<div class="section" style="margin-top:30px;"><div class="section-title">Notes</div><p style="font-size:14px;color:#555;">${invoice.notes}</p></div>` : ""}

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>${platformName} &bull; ${formatDate(invoice.created_at)}</p>
  </div>
</body>
</html>`;

    // Send email if requested
    if (sendEmail && customer?.email) {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: `${platformName} <onboarding@resend.dev>`,
            to: [customer.email],
            subject: `Invoice ${invoice.invoice_number} - ${invoice.service_type}`,
            html,
          }),
        });
      }
    }

    return new Response(JSON.stringify({ html, invoice }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
