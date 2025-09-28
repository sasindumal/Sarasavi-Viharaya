import { useState } from "react";
import { toast } from "sonner";

export default function DonationSection() {
  const [copying, setCopying] = useState(false);
  const account = "048-2-001-1-0097204";

  const copyAll = async () => {
    const text = `Account Number: ${account}\nAccount Name: Buddhist Brotherhood Society, University of Jaffna\nBank: People's Bank\nBranch: Kilinochchi`;
    try {
      setCopying(true);
      await navigator.clipboard.writeText(text);
      toast.success("බැංකු විස්තර පිටපත් විය");
    } catch {
      toast.error("පිටපත් කිරීමට නොහැකි විය");
    } finally {
      setCopying(false);
    }
  };

  return (
    <section id="donation" className="bg-secondary/40">
      <div className="container py-16 md:py-20">
        <header className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">පරිත්‍යාග තොරතුරු</h2>
          <p className="text-sm text-muted-foreground">Donation Information</p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border-2 border-amber-400 bg-card p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-primary">හදිසි අවශ්‍යතාව</h3>
            <p className="text-sm text-muted-foreground">Urgent Need</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-amber-50 p-4 ring-1 ring-amber-200">
                <div className="text-3xl font-extrabold text-primary">රු. ලක්ෂ 15</div>
                <div className="text-sm text-muted-foreground">වහලය සඳහා (Roof Construction)</div>
              </div>
              <div className="rounded-lg bg-amber-50 p-4 ring-1 ring-amber-200">
                <div className="text-3xl font-extrabold text-primary">රු. ලක්ෂ 30</div>
                <div className="text-sm text-muted-foreground">සම්පූර්ණ ව්‍යාපෘතිය (Total Cost)</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">බැංකු විස්තර</h3>
            <p className="text-sm text-muted-foreground">Bank Details</p>
            <dl className="mt-4 space-y-2 text-sm leading-7">
              <Row label="ගිණුම් අංකය:" value={account} />
              <Row label="ගිණුම් නම:" value="Buddhist Brotherhood Society, University of Jaffna" />
              <Row label="බැංකුව:" value="People's Bank" />
              <Row label="ශාඛාව:" value="Kilinochchi" />
            </dl>
            <button onClick={copyAll} disabled={copying} className="mt-4 w-full rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60">
              {copying ? "පිටපත් කරමින්..." : "විස්තර පිටපත් කරන්න"}
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-xl border bg-card p-6">
          <h4 className="font-semibold text-foreground">විනිවිදභාවය</h4>
          <p className="mt-2 text-sm text-muted-foreground">සියලු දානයන් විනිවිදභාවයෙන් උපයෝගී කරගනු ලබන අතර ප්‍රගති වාර්තා නිතර ප්‍රකාශයට පත් කරනු ලැබේ.</p>
          <p className="text-xs text-muted-foreground">All donations are used transparently with regular progress reports.</p>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-secondary/50 px-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}
