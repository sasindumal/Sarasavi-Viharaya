export default function Progress() {
  return (
    <section id="progress" className="bg-background">
      <div className="container py-16 md:py-20">
        <header className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">ඉදිකිරීම් ප්‍රගතිය</h2>
          <p className="text-sm text-muted-foreground">Construction Progress</p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card status="completed" title="මූලික ව්‍යුහ පිහිටුවීම" desc="ස්තූපය, බෝධි ප්‍රතිමාව, භාවනා මණ්ඩප සහ ධර්ම මණ්ඩපය සම්පූර්ණ කර ඇත." />

          <div className="rounded-xl border bg-card p-6 shadow-sm border-amber-300">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800 ring-1 ring-amber-200">🚧 ක්‍රියාත්මකයි</div>
            <h3 className="mt-3 font-semibold text-foreground">දානශාලා ඉදිකිරීම</h3>
            <p className="mt-1 text-sm text-muted-foreground">Dana Sala construction is underway. Roof work requires more funding.</p>
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-secondary">
                <div className="h-2 rounded-full bg-primary" style={{ width: "13.3%" }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>රු. ලක්ෂ 4 ලැබී ඇත</span>
                <span>රු. ලක්ෂ 30 අවශ්‍යයි</span>
              </div>
            </div>
          </div>

          <Card status="future" title="අවසාන කාර්යන්" desc="Interior finishing, landscaping and final installations to complete the complex." />
        </div>
      </div>
    </section>
  );
}

function Card({ status, title, desc }: { status: "completed" | "future"; title: string; desc: string }) {
  const badge = status === "completed"
    ? { text: "✅ සම්පූ���්ණයි", classes: "bg-emerald-100 text-emerald-800 ring-emerald-200" }
    : { text: "📋 අනාගතයේ", classes: "bg-slate-100 text-slate-800 ring-slate-200" };
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 ${badge.classes}`}>{badge.text}</div>
      <h3 className="mt-3 font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
