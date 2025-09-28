import { Check, Copy, Facebook, Mail, Phone, Youtube } from "lucide-react";
import { useState } from "react";

export default function Donate() {
  const [copied, setCopied] = useState(false);
  const account = "048-2-001-1-0097204";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">දානය කිරීමට විස්තර</h1>
        <p className="mt-3 text-muted-foreground">යාපනය සරසවි විහාරය ගොඩනැගීම සඳහා ඔබගේ දායකත්වයට ස්තූතියි.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="font-semibold">බැංකු විස්තර</h2>
            <dl className="mt-3 space-y-2 text-sm leading-7">
              <div className="flex justify-between gap-4"><dt>ගිණුම් අංකය</dt><dd className="font-medium">{account}</dd></div>
              <div className="flex justify-between gap-4"><dt>ගිණුම් නාමය</dt><dd className="font-medium">Buddhist Brotherhood Society, University of Jaffna</dd></div>
              <div className="flex justify-between gap-4"><dt>බැංකුව</dt><dd className="font-medium">Peoples’ Bank</dd></div>
              <div className="flex justify-between gap-4"><dt>ශාඛාව</dt><dd className="font-medium">Kilinochchi</dd></div>
              <div className="flex justify-between gap-4"><dt>Account Type</dt><dd className="font-medium">Savings</dd></div>
            </dl>
            <button onClick={copy} className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              {copied ? (<><Check className="h-4 w-4"/> පිටපත් කරා</>) : (<><Copy className="h-4 w-4"/> ගිණුම් අංකය පිටපත් කරන්න</>)}
            </button>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="font-semibold">සම්බන්ධ කරගැනීම</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4"/> 077 699 3908 / 071 821 5600</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4"/> thalaranedamsaknada@gmail.com</li>
              <li className="flex items-center gap-2"><a className="inline-flex items-center gap-2 hover:underline" href="https://www.facebook.com/JaffnaUniYMBA/" target="_blank" rel="noreferrer"><Facebook className="h-4 w-4"/> Facebook පිටුව</a></li>
              <li className="flex items-center gap-2"><a className="inline-flex items-center gap-2 hover:underline" href="https://www.youtube.com/channel/UC9W3xMisx185NMcOW5GQVXw" target="_blank" rel="noreferrer"><Youtube className="h-4 w-4"/> YouTube නාලිකාව</a></li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">මුදල් හුවමාරු කිරීමෙන් පසු රිසිට් පත්‍රය ඊමේල් හෝ WhatsApp හරහා අප වෙත යොමු කරන්න.</p>
          </div>
        </div>

        <div className="mt-10 rounded-xl border bg-secondary/40 p-6">
          <h3 className="font-semibold">සටහන</h3>
          <p className="mt-2 text-sm text-muted-foreground">අප විසින් ඉදිකිරීම් ප්‍රගතිය, ලාභාංශ වාර්තා සහ පරිත්‍යාග ලැයිස්තු නිතරටම යාවත්කාලීන කරයි. ඔබගේ දානය
          සම්පූර්ණයෙන්ම ව්‍යාපෘතිය සඳහාම යොදවයි.</p>
        </div>
      </div>
    </div>
  );
}
