import { PageHeader, EmptyState } from "@/components/admin/AdminUi";
export default function ClientPayments() {
  return (
    <div>
      <PageHeader title="Payments" subtitle="Project funding and invoices" />
      <EmptyState title="No payments yet" description="Payment records will appear once your projects go live." />
    </div>
  );
}
