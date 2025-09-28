export default function Gallery() {
  const items: { src: string; title: string; sub: string }[] = [
    { src: "https://pplx-res.cloudinary.com/image/upload/v1755810504/pplx_project_search_images/8abcb6390e22a21c907f0857d543fd0eb9c46a37.png", title: "සම්ප්‍රදායික ස්තූප", sub: "Traditional Stupas" },
    { src: "https://pplx-res.cloudinary.com/image/upload/v1755065133/pplx_project_search_images/c8ccacf8bc77a6542e49749185a0cf4909a2e07f.png", title: "භාවනා මණ්ඩපය", sub: "Meditation Hall" },
    { src: "https://pplx-res.cloudinary.com/image/upload/v1755022959/pplx_project_search_images/43975022a0744668148fc587f1931c0bda5a10ee.png", title: "බෝධි වෘක්ෂ අනුස්මරණය", sub: "Bodhi Tree Ceremony" },
    { src: "https://pplx-res.cloudinary.com/image/upload/v1757581008/pplx_project_search_images/ddf08057d7b2986127bfc7820db4ab82fc1cfa8f.png", title: "පුරාණ ස්තූප ගෘහනිර්මාණ", sub: "Ancient Stupa Architecture" },
  ];
  return (
    <section id="gallery" className="bg-background">
      <div className="container py-16 md:py-20">
        <header className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">ඡායාරූප</h2>
          <p className="text-sm text-muted-foreground">Gallery</p>
        </header>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <figure key={it.src} className="group relative overflow-hidden rounded-xl border bg-card shadow-sm">
              <img src={it.src} alt={it.title} className="h-60 w-full object-cover transition group-hover:scale-[1.02]" />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-1/2 px-4 pb-4 transition group-hover:translate-y-0">
                <div className="rounded-md bg-black/60 px-3 py-2 text-sm text-white backdrop-blur">
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-xs opacity-90">{it.sub}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
