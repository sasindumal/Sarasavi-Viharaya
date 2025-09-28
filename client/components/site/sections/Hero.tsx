import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[80vh] md:min-h-[90vh] grid place-items-center overflow-hidden">
      <img
        src="https://pplx-res.cloudinary.com/image/upload/v1755810504/pplx_project_search_images/8abcb6390e22a21c907f0857d543fd0eb9c46a37.png"
        alt="Traditional Buddhist stupas with sunset sky"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/40 to-amber-300/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.25),transparent_60%)]" />

      <div className="container relative z-10 py-16 md:py-24 text-center text-primary-foreground">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">යාපනය සරසවි විහාරය</h1>
        <p className="mt-2 text-sm opacity-90">Jaffna University Buddhist Temple</p>
        <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg leading-relaxed opacity-95">
          කිලිනොච්චි මූලස්ථානයේ 1400+ බෞද්ධ සිසුන් සඳහා ස්ථිර විහාරයක් ඉදිකිරීමට ඔබගේ දායකත්වය අවශ්‍යයි.
          <span className="block text-sm/relaxed opacity-95">Help us build a permanent Buddhist temple for 1400+ Buddhist students at Kilinochchi campus.</span>
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat number="1400+" label="බෞද්ධ සිසුන් / Buddhist Students" />
          <Stat number="56%" label="සමස්ත සිසුන්ගෙන් / Of Total Students" />
          <Stat number="10–23km" label="ගමන් දුර / Travel Distance" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/donate" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground shadow">
            දානය දෙන්න
          </Link>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-md border px-5 py-3 font-medium bg-background/10 hover:bg-background/20">අපව සම්බන්ධ කරගන්න</a>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-xl border bg-background/10 px-5 py-4 text-left ring-1 ring-white/20 backdrop-blur">
      <div className="text-2xl font-extrabold text-yellow-200 drop-shadow">{number}</div>
      <div className="mt-1 text-xs opacity-95">{label}</div>
    </div>
  );
}
