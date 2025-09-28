import { ArrowRight, Building2, DollarSign, HeartHandshake, Landmark } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-transparent to-transparent" />
        <div className="container py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">කිලිනොච්චි • යාපනය විශ්වවිද්‍යාලය</div>
              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                යාපනය ���රසවි විහාරය
              </h1>
              <p className="mt-4 text-muted-foreground md:text-lg max-w-prose">
                උතුරු පළාතේ යාපනය විශ්වවිද්‍යාල පරිශ්‍රයේ පිහිටි “සරසවි විහාරය” (Sarasavi Viharaya) ගොඩනගා ගැනීම සඳහා
                බෞද්ධ සහ සුහදයින්ගේ දායකත්වයෙන් ඉදිරිගෙන යන හූනූ දේශීය ව්‍යාපෘතියකි. මෙහි අරමුණ වන්නේ සිසුන්ට සහ පරිශ්‍රයට
                ආගමික හා ආධ්‍යාත්මික මධ්‍යස්ථානයක් සැපයීමයි.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link to="/donate" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-primary-foreground font-semibold shadow">
                  දානයක් කරන්න <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#about" className="inline-flex items-center gap-2 rounded-md border px-5 py-3 font-medium hover:bg-secondary">තොරතුරු බලන්න</a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 ring-1 ring-border" />
              <div className="absolute -bottom-6 -right-6 hidden md:block h-28 w-28 rounded-xl bg-primary/20 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-t bg-card/50">
        <div className="container py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon={<Building2 className="h-5 w-5" />} title="ඉදිමිනෙමින්" body="අල්මස් මන්දිරය, බෝධි ප්‍රාදේශය, ඝන්ටා ධ්වජය ඇතුළු ව්‍යාපෘති" />
          <Feature icon={<Landmark className="h-5 w-5" />} title="අධ්‍යාත්මික මධ්‍යස්ථානය" body="විශ්වවිද්‍යාල සමාජයට නිශ්ශබ්ද ආගමික පරිසරයක්" />
          <Feature icon={<DollarSign className="h-5 w-5" />} title="වෙනස්කමට ඔබත්" body="මුදල්/දෙපාර්ථක/වස්තු දායකත්වය පිළිගනිමු" />
          <Feature icon={<HeartHandshake className="h-5 w-5" />} title="පරිත්‍යාගය පිළිබඳ විස්තර" body="ගිණුම් විස්තර හා සම්බන්ධතා මඟින් පහසුවෙන් දායක වන්න" />
        </div>
      </section>

      {/* About */}
      <section id="about" className="container py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">විහාරය පිළිබඳව</h2>
            <p className="mt-4 text-muted-foreground">
              1974 සිට යාපනය විශ්වවිද්‍යාලය සමඟ සබඳ යාපනය බෞද්ධ සමාජයේ උත්සාහයෙන් ආරම්භ වූ මෙය 2014 සිට නව මට්ටමකින්
              ඉදිරියට ගෙන යන්න කටයුතු කරන ලදී. අති විශිෂ්ට පූජනීය භික්ෂු සංඝරාජ්‍යයන්ගේ අනුග්‍රහය සහ විශ්වවිද්‍යාලයීය
              ගුරු-සිසු සමාජයේ සහයෝගය සමඟින් අද සහභාගිත්වය අවශ්‍ය අති වැදගත් ව්‍යාපෘතියකි.
            </p>
            <p className="mt-3 text-muted-foreground">
              මෙම ව්‍යාපෘතිය තුළ අල්මස් ගෘහය, දාන ශාලාව, ධර්ම මණ්ඩපය, බෝධි ප්‍රදේශය, ස්ථූපාරාමය සහ භාවනා භූමිය වැනි
              කටයුතු අන්තර්ගත වේ. ඔබගේ දානය මෙය ඉක්මනින් සැබෑ කිරීමට උපකාරී වේ.
            </p>
          </div>
          <div className="md:col-span-3">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="font-semibold">මුලික අරමුණු</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
                <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary"/> දානය සඳහා නිසි ආධාරක මධ්‍යස්ථානයක්</li>
                <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary"/> විශ්වවිද්‍යාලයට ආගමික සේවය</li>
                <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary"/> බෞද්ධ සංස්කෘතිය ආරක්ෂා කිරීම</li>
                <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary"/> සිසුන්ට බලාගාර හා භාවනාව සඳහා ඉඩ</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Stat label="ඉදිකිරීම් ප්‍රගතිය" value="දිනෙන් දින වැඩිවේ" />
                <Stat label="ප්‍රධාන විෂයයන්" value="ස්ථූප, බෝධි, දාන ශාලාව" />
                <Stat label="පරිත්‍යාගකයින්" value="දේශීය හා විදේශීය" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation quick info */}
      <section id="updates" className="border-t bg-secondary/40">
        <div className="container py-14">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold">දායකත්වය / Bank Details</h3>
              <ul className="mt-4 space-y-2 text-sm leading-7">
                <li>Account Number: <span className="font-semibold">048-2-001-1-0097204</span></li>
                <li>Account Name: Buddhist Brotherhood Society, University of Jaffna</li>
                <li>Bank: Peoples’ Bank — Branch: Kilinochchi</li>
                <li>Telephone: 077 699 3908 / 071 821 5600</li>
                <li>Email: thalaranedamsaknada@gmail.com</li>
              </ul>
              <div className="mt-5 flex gap-3">
                <Link to="/donate" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-primary-foreground font-semibold shadow">
                  දානය කළ විදිම බලන්න <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h4 className="font-semibold">දැනට සිදුකරන වැඩ</h4>
              <ol className="mt-3 list-decimal ml-5 space-y-2 text-sm">
                <li>ඉදි���ිරීම් පදනම් සහ බිත්තීන්</li>
                <li>දාන ශාලාව සහ සවරණ කටයුතු</li>
                <li>වතුර/සිවිල් හා වර්ණ කිරීම් සැලසුම්</li>
              </ol>
              <p className="mt-3 text-xs text-muted-foreground">විනිෝග වාර්තා සහ ලියාපදිංචි ප්‍රලේඛන ඉල්ලීම් මත ලබා දෙනු ලැබේ.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[12rem] rounded-lg border bg-background px-4 py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}
