import { PageHeader, StatusBadge, KpiCard, EmptyState } from "@/components/admin/AdminUi";
import { useClient } from "@/context/ClientContext";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientPayments() {
  const { payments } = useClient();
  const totalPaid = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const failed = payments.filter((p) => p.status === "Failed").reduce((s, p) => s + p.amount, 0);

  const exportCsv = () => {
    const rows = [
      ["Invoice", "Date", "Description", "Method", "Amount", "Status"],
      ...payments.map((p) => [p.invoiceNo, p.date, p.description, p.method, p.amount, p.status]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "payments.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader title="Payments" subtitle="Project funding and invoices" actions={
        <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" /> Export</Button>
      } />

      {payments.length === 0 ? (
        <EmptyState title="No payments yet" description="Payment records will appear once your projects go live." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 mb-6">
            <KpiCard label="Total Paid" value={`₦${totalPaid.toLocaleString()}`} accent="secondary" />
            <KpiCard label="Pending" value={`₦${pending.toLocaleString()}`} accent="warning" />
            <KpiCard label="Failed" value={`₦${failed.toLocaleString()}`} accent="primary" />
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">{p.invoiceNo}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.description}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.method}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">₦{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
