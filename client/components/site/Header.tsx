import { Link, NavLink } from "react-router-dom";
import { Phone, Facebook, Youtube, Mail } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-primary/20 ring-1 ring-primary/40 grid place-items-center">
            <span className="text-primary text-lg font-extrabold">ය</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold tracking-tight text-lg">යාපනය සරසවි විහාරය</span>
            <span className="text-xs text-muted-foreground">Sarasavi Viharaya, University of Jaffna</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}>මුල් පිටුව</NavLink>
          <a href="#about" className="text-muted-foreground hover:text-foreground">අප ගැන</a>
          <a href="#updates" className="text-muted-foreground hover:text-foreground">ප්‍රගතිය</a>
          <NavLink to="/donate" className={({ isActive }) => isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}>දායක වන්න</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <a href="tel:0776993908" aria-label="Call" className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            <Phone className="h-4 w-4" /> <span className="hidden sm:inline">077 699 3908</span>
          </a>
          <a href="mailto:thalaranedamsaknada@gmail.com" className="hidden sm:inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground" aria-label="Email">
            <Mail className="h-4 w-4" />
          </a>
          <a href="https://www.facebook.com/JaffnaUniYMBA/" target="_blank" rel="noreferrer" aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent hover:text-accent-foreground">
            <Facebook className="h-4 w-4" />
          </a>
          <a href="https://www.youtube.com/channel/UC9W3xMisx185NMcOW5GQVXw" target="_blank" rel="noreferrer" aria-label="YouTube" className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent hover:text-accent-foreground">
            <Youtube className="h-4 w-4" />
          </a>
          <NavLink to="/donate" className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow hover:opacity-95">දානයක් කරන්න</NavLink>
        </div>
      </div>
    </header>
  );
}
