import { FormEvent, useState } from "react";
import { Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success("පණිවිඩය යවා ඇත");
      (e.currentTarget as HTMLFormElement).reset();
    } catch {
      toast.error("යැවීම අසාර්ථක විය");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-secondary/30">
      <div className="container py-16 md:py-20">
        <header className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">සම්බන්ධ වන්න</h2>
          <p className="text-sm text-muted-foreground">Contact Us</p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">ව්‍යාපෘති සම්බන්ධීකරු</h3>
            <p className="text-sm text-muted-foreground">Project Coordinator</p>
            <div className="mt-4">
              <h4 className="font-semibold text-primary">ඉංජිනේරු සාලිය සම්පත්</h4>
              <p className="text-sm">Eng. Saliya Sampath</p>
              <p className="text-xs text-muted-foreground">ජ්‍යේෂ්ඨ කථිකාචාර්ය, ඉංජිනේරු අධ්‍යයන පීඨය</p>
              <p className="text-xs text-muted-foreground">Senior Lecturer, Faculty of Engineering</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 077 699 3908 / 071 821 5600</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> thalaranedamsaknada@gmail.com</li>
            </ul>
          </div>

          <form onSubmit={onSubmit} className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">අපට පණිවිඩයක් එවන්න</h3>
            <p className="text-sm text-muted-foreground">Send us a message</p>
            <div className="mt-4 grid gap-4">
              <div>
                <label className="text-sm font-medium">නම / Name</label>
                <input required className="mt-1 w-full rounded-md border bg-background px-3 py-2" type="text" name="name" />
              </div>
              <div>
                <label className="text-sm font-medium">විද්‍යුත් තැපෑල / Email</label>
                <input required className="mt-1 w-full rounded-md border bg-background px-3 py-2" type="email" name="email" />
              </div>
              <div>
                <label className="text-sm font-medium">දුරකථන / Phone</label>
                <input className="mt-1 w-full rounded-md border bg-background px-3 py-2" type="tel" name="phone" />
              </div>
              <div>
                <label className="text-sm font-medium">පණිවිඩය / Message</label>
                <textarea required className="mt-1 w-full rounded-md border bg-background px-3 py-2" rows={5} name="message" />
              </div>
              <button disabled={loading} className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60">{loading ? "යැවෙමින්..." : "පණිවිඩය එවන්න"}</button>
            </div>
          </form>
        </div>

        <div className="mt-8 rounded-xl border bg-card p-6 text-center">
          <h4 className="font-semibold text-foreground">සමාජ මාධ්‍ය</h4>
          <p className="text-sm text-muted-foreground">Social Media</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a href="#" className="rounded-md border px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">📘 Thal Arane Damsak Nada</a>
            <a href="#" className="rounded-md border px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">🎥 Thal Arane Damsak Nada</a>
          </div>
        </div>
      </div>
    </section>
  );
}
