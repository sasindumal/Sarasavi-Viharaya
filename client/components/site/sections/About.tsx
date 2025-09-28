export default function About() {
  return (
    <section id="about" className="bg-secondary/30">
      <div className="container py-16 md:py-20">
        <header className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">විහාරය ගැන</h2>
          <p className="text-sm text-muted-foreground">About the Temple</p>
        </header>

        <div className="mt-10 grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3 space-y-4 text-muted-foreground">
            <div>
              <h3 className="text-lg font-semibold text-foreground">යාපනය සරසවිය</h3>
              <p>
                1974 දී පිහිටුවන ලද යාපනය සරසවියේ කිලිනොච්චි මූලස්ථානය 2014 වර්ෂයේ ආරම්භ කරන ලදී. A9 මාර්ගයේ 245
                කිලෝමීටර් කණුවේ පිහිටි මෙම මූලස්ථානයේ 2500 ක�� පමණ සිසුන් අධ්‍යාපනය ලබති.
              </p>
              <p className="text-xs italic">The University of Jaffna opened its Kilinochchi campus in 2014, serving ~2500 students.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">විහාරයේ අවශ්‍යතාව</h3>
              <p>
                බෞද්ධ සිසුන් 1400 කට වැඩි ප්‍රමාණයක් සිටින නමුත් ස්ථිර විහාරයක් නොමැත. සිසුන්ට දැනට කිලෝමීටර 10–23 ක්
                ගමන් කරමින් අවට විහාරවලට යාමට සිදුවේ. විශේෂයෙන් කාන්තා සිසුන්ට මෙය ආරක්ෂිත අපහසුතාවයකි.
              </p>
              <p className="text-xs italic">Students currently travel 10–23km to worship; a local temple is urgently needed.</p>
            </div>
          </div>
          <div className="md:col-span-2">
            <img
              src="https://pplx-res.cloudinary.com/image/upload/v1755065133/pplx_project_search_images/c8ccacf8bc77a6542e49749185a0cf4909a2e07f.png"
              alt="Buddhist meditation hall"
              className="h-full w-full rounded-xl object-cover shadow ring-1 ring-border"
            />
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-center text-xl font-semibold text-primary">දැනට ඉදිකර ඇති පහසුකම්</h3>
          <p className="text-center text-sm text-muted-foreground">Current Facilities</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Facility icon="🏛️" title="ජයශ්‍රී මහා බෝධි ප්‍රකාරය" desc="30ft Jaffna Sarasavi Stupa" />
            <Facility icon="🙏" title="ආනන්ද බෝධි ප්‍රතිමාව" desc="Ananda Bodhi Statue" />
            <Facility icon="🧘" title="භාවනා මණ්ඩප" desc="Meditation Halls" />
            <Facility icon="📚" title="ධර්ම මණ්ඩපය" desc="5000 sq ft Dhamma Hall" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Facility({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 text-center shadow-sm transition hover:shadow-md">
      <div className="text-4xl">{icon}</div>
      <div className="mt-3 font-semibold text-foreground">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
    </div>
  );
}
