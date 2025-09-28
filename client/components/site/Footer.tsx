import { Facebook, Mail, Phone, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="container py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">යාපනය සරසවි විහාරය</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            උතුරු மாகாணයේ කිලිනොච්චියේ පිහිටි යාපනය විශ්වවිද්‍යාල පරිශ්‍රයේ පිහිටුවන සරසවි විහාරය පිළිබඳ තොරතුරු සහ දායකත්වය ලබා දීම.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">සම්බන්ධ වන්න</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 077 699 3908 / 071 821 5600</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> thalaranedamsaknada@gmail.com</li>
            <li className="flex items-center gap-2"><a className="inline-flex items-center gap-2 hover:underline" href="https://www.facebook.com/JaffnaUniYMBA/" target="_blank" rel="noreferrer"><Facebook className="h-4 w-4" /> Facebook</a></li>
            <li className="flex items-center gap-2"><a className="inline-flex items-center gap-2 hover:underline" href="https://www.youtube.com/channel/UC9W3xMisx185NMcOW5GQVXw" target="_blank" rel="noreferrer"><Youtube className="h-4 w-4" /> YouTube</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">බැංකු විස්තර</h4>
          <ul className="mt-2 text-sm leading-6">
            <li>ගිණුම් අංකය: <span className="font-medium">048-2-001-1-0097204</span></li>
            <li>ගිණුම් නාමය: Buddhist Brotherhood Society, University of Jaffna</li>
            <li>බැංකුව: Peoples’ Bank</li>
            <li>ශාඛාව: Kilinochchi</li>
            <li>(Savings Account)</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} යාපනය සරසවි විහාරය. සියලුම හිමිකම් ඇවිරිණි.
        </div>
      </div>
    </footer>
  );
}
