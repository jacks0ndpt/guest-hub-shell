import { Printer, QrCode, Bell, Camera, Plane, Compass, ArrowRight, ScanLine, Send, LayoutDashboard } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const values = [
  {
    title: "Prezentare modernă RO / EN",
    body: "Website elegant, responsive și pregătit pentru oaspeți români și străini.",
  },
  {
    title: "Conținut ușor de editat",
    body: "Texte, camere, oferte, galerie și facilități pot fi actualizate rapid din admin, fără dezvoltator pentru fiecare schimbare.",
  },
  {
    title: "Admin Hub pentru mesaje, solicitări și conținut",
    body: "Mesajele, cererile oaspeților și modificările de conținut sunt organizate într-un singur loc.",
  },
  {
    title: "QR în cameră pentru cereri rapide",
    body: "Oaspeții scanează codul QR și pot trimite rapid solicitări către recepție.",
  },
  {
    title: "Rezervări directe prin telefon, WhatsApp sau link extern",
    body: "Nu înlocuiește sistemul actual de rezervări; îl completează și susține contactul direct cu proprietatea.",
  },
  {
    title: "Raportare simplă",
    body: "Proprietatea poate vedea activitatea, solicitările și feedbackul într-un format ușor de urmărit.",
  },
];

const steps = [
  { icon: ScanLine, label: "Oaspetele scanează QR" },
  { icon: Send, label: "Trimite o solicitare" },
  { icon: LayoutDashboard, label: "Proprietatea vede totul în admin" },
];

const chips = ["Camere", "Oferte", "Galerie", "Facilități", "Mesaje", "Feedback", "Secțiuni active / inactive"];

const QrGlyph = () => (
  <div className="grid grid-cols-7 gap-[3px] w-[104px] h-[104px]">
    {Array.from({ length: 49 }).map((_, i) => {
      const corner =
        (i % 7 < 3 && i < 21) || (i % 7 > 3 && i < 21 && i % 7 > 3) || (i % 7 < 3 && i > 27);
      const on = corner ? (i * 7) % 3 !== 0 : (i * 13) % 5 < 2;
      return (
        <span
          key={i}
          className="rounded-[2px]"
          style={{ background: on ? "#1f3b2c" : "rgba(31,59,44,0.08)" }}
        />
      );
    })}
  </div>
);

const Brochure = () => {
  usePageMeta(
    "Hotel GuestHub — Website, Admin Hub și GuestHub QR",
    "Prezentare Hotel GuestHub: website modern, Admin Hub și solicitări prin QR pentru moteluri, pensiuni și hoteluri mici."
  );

  return (
    <div className="brochure-root min-h-screen w-full overflow-x-hidden py-8 px-4 md:py-14">
      <style>{`
        .brochure-root {
          --ivory: #f7f3ea;
          --ivory-deep: #efe8db;
          --forest: #1f3b2c;
          --forest-soft: #2a4c39;
          --bronze: #a9743f;
          --ink: #1b1a17;
          background: #e9e5dd;
          color: var(--ink);
        }
        .brochure-sheet {
          background: var(--ivory);
          box-shadow: 0 30px 80px -40px rgba(27,26,23,0.45);
        }
        .brochure-root .serif { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; letter-spacing: -0.015em; }
        .brochure-root .grain::before {
          content: "";
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(27,26,23,0.05) 1px, transparent 1px);
          background-size: 4px 4px;
        }
        .b-sec { break-inside: avoid; page-break-inside: avoid; }
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          .brochure-root { background: #fff; padding: 0; }
          .no-print { display: none !important; }
          .brochure-sheet { box-shadow: none; max-width: 100%; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <button
        onClick={() => window.print()}
        className="no-print fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm tracking-wide shadow-lg transition-transform hover:-translate-y-0.5"
        style={{ background: "var(--forest)", color: "var(--ivory)" }}
      >
        <Printer className="h-4 w-4" />
        Print / Save PDF
      </button>

      <div className="brochure-sheet mx-auto w-full max-w-[1000px] overflow-hidden">
        {/* 1. Header */}
        <header className="b-sec relative grain px-8 md:px-16 pt-14 pb-12" style={{ background: "var(--ivory)" }}>
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-[36rem]">
              <span
                className="inline-block text-[11px] uppercase tracking-[0.28em] mb-6"
                style={{ color: "var(--bronze)" }}
              >
                Digital • Simplu • Elegant
              </span>
              <h1 className="serif text-5xl md:text-7xl leading-[0.95]" style={{ color: "var(--forest)" }}>
                Hotel GuestHub
              </h1>
              <p className="mt-5 text-lg md:text-xl" style={{ color: "var(--ink)" }}>
                Website modern + Admin Hub + GuestHub QR
              </p>
              <p className="mt-2 text-sm opacity-70">Pentru moteluri, pensiuni și hoteluri mici</p>
            </div>
            <div className="hidden md:block">
              <div
                className="h-24 w-24 rounded-full grid place-items-center"
                style={{ border: "1px solid var(--bronze)", color: "var(--bronze)" }}
              >
                <Bell className="h-8 w-8" strokeWidth={1.2} />
              </div>
            </div>
          </div>
          <div className="mt-10 h-px w-full" style={{ background: "linear-gradient(90deg, var(--bronze), transparent)" }} />
        </header>

        {/* 2. Product showcase */}
        <section className="b-sec px-8 md:px-16 pb-14" style={{ background: "var(--ivory)" }}>
          <div className="grid md:grid-cols-12 gap-6 items-start">
            {/* Website mockup */}
            <div className="md:col-span-7 rounded-xl overflow-hidden bg-white" style={{ border: "1px solid rgba(31,59,44,0.14)", boxShadow: "0 18px 40px -28px rgba(27,26,23,0.5)" }}>
              <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "var(--ivory-deep)" }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#c9c2b4" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#c9c2b4" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#c9c2b4" }} />
                <div className="ml-3 h-4 flex-1 rounded-full" style={{ background: "rgba(31,59,44,0.07)" }} />
              </div>
              <div className="px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]" style={{ borderBottom: "1px solid rgba(31,59,44,0.1)", color: "var(--forest)" }}>
                <span className="serif text-sm mr-2">Pensiunea Verde</span>
                {["Acasă", "Camere", "Oferte", "Facilități", "Galerie", "Contact"].map((n) => (
                  <span key={n} className="opacity-70">{n}</span>
                ))}
                <span className="ml-auto opacity-60">RO / EN</span>
              </div>
              <div className="relative px-6 py-12 md:py-16" style={{ background: "linear-gradient(140deg, #24422f, #16281e)" }}>
                <h2 className="serif text-3xl md:text-4xl leading-tight" style={{ color: "var(--ivory)" }}>
                  Confort local.<br />Experiențe autentice.
                </h2>
                <span
                  className="mt-6 inline-block rounded-full px-5 py-2 text-xs tracking-wide"
                  style={{ background: "var(--bronze)", color: "#fff" }}
                >
                  Rezervă direct
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 p-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 rounded-md" style={{ background: "rgba(31,59,44,0.07)" }} />
                ))}
              </div>
            </div>

            {/* Mobile GuestHub */}
            <div className="md:col-span-5 grid gap-6">
              <div className="rounded-[22px] bg-white p-3 mx-auto w-full max-w-[260px]" style={{ border: "1px solid rgba(31,59,44,0.16)", boxShadow: "0 18px 40px -28px rgba(27,26,23,0.5)" }}>
                <div className="rounded-[16px] overflow-hidden" style={{ background: "var(--ivory)" }}>
                  <div className="px-4 py-4" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
                    <p className="serif text-lg leading-tight">Bună ziua!</p>
                    <p className="text-[11px] opacity-80 mt-1">Cum vă putem ajuta astăzi?</p>
                  </div>
                  <ul className="p-3 space-y-2">
                    {["Solicită curățenie", "Prosoape suplimentare", "Probleme în cameră", "Recepție / Informații", "Alte solicitări"].map((s) => (
                      <li
                        key={s}
                        className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-[11px]"
                        style={{ border: "1px solid rgba(31,59,44,0.1)" }}
                      >
                        {s}
                        <ArrowRight className="h-3 w-3" style={{ color: "var(--bronze)" }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* QR card */}
              <div className="rounded-xl p-5 flex items-center gap-5" style={{ background: "var(--ivory-deep)", border: "1px solid rgba(169,116,63,0.35)" }}>
                <QrGlyph />
                <div>
                  <p className="serif text-2xl" style={{ color: "var(--forest)" }}>GuestHub</p>
                  <p className="text-xs mt-1 opacity-75">Scanează și trimite o solicitare.</p>
                  <QrCode className="mt-3 h-4 w-4" style={{ color: "var(--bronze)" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Admin Hub */}
          <div className="mt-6 grid md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-9 rounded-xl bg-white p-5 md:p-6" style={{ border: "1px solid rgba(31,59,44,0.14)", boxShadow: "0 18px 40px -28px rgba(27,26,23,0.45)" }}>
              <div className="flex items-center justify-between">
                <p className="serif text-xl" style={{ color: "var(--forest)" }}>Admin Hub</p>
                <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--bronze)" }}>Panou</span>
              </div>
              <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  ["Solicitări noi", "12"],
                  ["În așteptare", "5"],
                  ["Rezolvate azi", "18"],
                  ["Feedback", "4.8 / 5"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg px-3 py-3" style={{ background: "var(--ivory)", border: "1px solid rgba(31,59,44,0.09)" }}>
                    <p className="text-[10px] uppercase tracking-wider opacity-60">{k}</p>
                    <p className="serif text-2xl mt-1" style={{ color: "var(--forest)" }}>{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                {["Solicitări recente", "Status solicitări", "Mesaje", "Rapoarte"].map((s) => (
                  <div key={s} className="rounded-lg p-3" style={{ border: "1px solid rgba(31,59,44,0.09)" }}>
                    <p className="text-[11px]" style={{ color: "var(--forest)" }}>{s}</p>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(31,59,44,0.1)" }} />
                      <div className="h-1.5 rounded-full w-2/3" style={{ background: "rgba(169,116,63,0.35)" }} />
                      <div className="h-1.5 rounded-full w-5/6" style={{ background: "rgba(31,59,44,0.08)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 space-y-4 pt-2">
              <p className="serif text-lg leading-snug" style={{ color: "var(--bronze)" }}>
                „QR în cameră pentru cereri rapide”
              </p>
              <div className="h-px w-16" style={{ background: "var(--bronze)" }} />
              <p className="serif text-lg leading-snug" style={{ color: "var(--forest)" }}>
                „Totul organizat într-un singur loc”
              </p>
            </div>
          </div>
        </section>

        {/* 3. Conversion callout */}
        <section className="b-sec px-8 md:px-16 pb-14" style={{ background: "var(--ivory)" }}>
          <div className="relative rounded-xl px-7 md:px-10 py-8" style={{ background: "#fffdf8", border: "1px solid rgba(31,59,44,0.12)" }}>
            <span className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full" style={{ background: "var(--bronze)" }} />
            <h3 className="serif text-3xl md:text-4xl" style={{ color: "var(--forest)" }}>
              Mai mult decât un site frumos.
            </h3>
            <p className="mt-4 max-w-[46rem] text-[15px] leading-relaxed opacity-80">
              Un website modern ajută oaspeții să înțeleagă rapid camerele, facilitățile și avantajele proprietății,
              crescând șansele de contact și rezervare directă.
            </p>
          </div>
        </section>

        {/* 4. Core value */}
        <section className="b-sec px-8 md:px-16 pb-14" style={{ background: "var(--ivory)" }}>
          <h3 className="serif text-3xl md:text-4xl max-w-[30rem] leading-tight" style={{ color: "var(--forest)" }}>
            Tot ce ai nevoie, conectat pentru experiențe mai bune.
          </h3>
          <div className="mt-8 grid md:grid-cols-2 gap-x-10 gap-y-7">
            {values.map((v, i) => (
              <div key={v.title} className="flex gap-4" style={{ borderTop: "1px solid rgba(31,59,44,0.12)", paddingTop: "1.25rem" }}>
                <span className="serif text-lg shrink-0" style={{ color: "var(--bronze)" }}>
                  0{i + 1}
                </span>
                <div>
                  <p className="serif text-xl leading-snug" style={{ color: "var(--forest)" }}>{v.title}</p>
                  <p className="mt-2 text-sm leading-relaxed opacity-75">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. How it works */}
        <section className="b-sec px-8 md:px-16 py-14" style={{ background: "var(--ivory-deep)" }}>
          <h3 className="serif text-3xl md:text-4xl" style={{ color: "var(--forest)" }}>Cum funcționează?</h3>
          <div className="mt-10 grid md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((s, i) => (
              <div key={s.label} className="relative flex md:flex-col items-center md:text-center gap-4">
                <div
                  className="h-16 w-16 shrink-0 rounded-full grid place-items-center bg-white"
                  style={{ border: "1px solid var(--bronze)", color: "var(--forest)" }}
                >
                  <s.icon className="h-6 w-6" strokeWidth={1.3} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] mb-1" style={{ color: "var(--bronze)" }}>
                    Pasul {i + 1}
                  </p>
                  <p className="serif text-lg leading-snug" style={{ color: "var(--forest)" }}>{s.label}</p>
                </div>
                {i < steps.length - 1 && (
                  <span
                    className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[-50%] h-px"
                    style={{ background: "rgba(169,116,63,0.5)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 6 + 7 */}
        <section className="b-sec px-8 md:px-16 py-14 grid md:grid-cols-12 gap-10" style={{ background: "var(--ivory)" }}>
          <div className="md:col-span-7">
            <h3 className="serif text-3xl md:text-4xl" style={{ color: "var(--forest)" }}>
              Ce poate administra proprietatea?
            </h3>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full px-4 py-2 text-[13px]"
                  style={{ background: "#fffdf8", border: "1px solid rgba(31,59,44,0.15)", color: "var(--forest)" }}
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed opacity-75 max-w-[34rem]">
              Proprietarul poate actualiza conținutul și poate urmări solicitările fără să depindă de un dezvoltator
              pentru fiecare modificare.
            </p>
          </div>

          <aside className="md:col-span-5 rounded-xl p-7" style={{ background: "var(--forest-soft)", color: "var(--ivory)" }}>
            <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "#d8a86e" }}>Opțional</p>
            <p className="serif text-2xl mt-3 leading-snug">foto / video, dronă, panorame 360</p>
            <div className="mt-5 flex gap-4" style={{ color: "#d8a86e" }}>
              <Camera className="h-5 w-5" strokeWidth={1.3} />
              <Plane className="h-5 w-5" strokeWidth={1.3} />
              <Compass className="h-5 w-5" strokeWidth={1.3} />
            </div>
            <p className="mt-5 text-sm opacity-80 leading-relaxed">
              Pentru proprietățile care vor o prezentare vizuală mai puternică.
            </p>
          </aside>
        </section>

        {/* 8. Pilot CTA */}
        <section className="b-sec relative px-8 md:px-16 py-16" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="h-16 w-16 shrink-0 rounded-full grid place-items-center" style={{ border: "1px solid #d8a86e", color: "#d8a86e" }}>
              <Bell className="h-7 w-7" strokeWidth={1.2} />
            </div>
            <div>
              <h3 className="serif text-3xl md:text-4xl leading-tight max-w-[30rem]">
                Program pilot pentru primele proprietăți partenere
              </h3>
              <p className="mt-4 opacity-85">Demo și acces de prezentare disponibile la cerere.</p>
              <p className="mt-1 text-sm" style={{ color: "#d8a86e" }}>Cost preferențial în perioada de pilot.</p>
            </div>
          </div>
        </section>

        {/* 9. Footer */}
        <footer className="b-sec px-8 md:px-16 py-7 text-[12px] leading-relaxed opacity-70" style={{ background: "var(--ivory)" }}>
          Hotel GuestHub este o soluție de prezentare, administrare și GuestHub QR pentru proprietăți de cazare mici și medii.
        </footer>
      </div>
    </div>
  );
};

export default Brochure;
