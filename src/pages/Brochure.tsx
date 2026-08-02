import {
  Printer,
  Bell,
  Camera,
  Plane,
  Compass,
  ArrowRight,
  ScanLine,
  Send,
  LayoutDashboard,
  Globe,
  Pencil,
  QrCode,
  CalendarCheck,
  BarChart3,
  Phone,
  Wifi,
  Image as ImageIcon,
  MapPin,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

/*
  Hotel GuestHub — marketing one-pager (hidden public route: /brochure).
  NOTE: When taking screenshots for WhatsApp, hide the print button
  (it is .no-print and is rendered OUTSIDE the brochure sheet) or use
  the browser's print / export-to-PDF mode.
*/

const benefits = [
  {
    icon: Globe,
    title: "Website modern RO / EN",
    body: "Prezentare clară pentru oaspeți români și străini.",
  },
  {
    icon: Pencil,
    title: "Conținut editabil",
    body: "Camere, oferte, galerie, facilități și texte actualizate din admin.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Hub",
    body: "Mesaje, solicitări, feedback și conținut organizate într-un singur loc.",
  },
  {
    icon: QrCode,
    title: "QR în cameră",
    body: "Oaspeții trimit cereri rapide către recepție.",
  },
  {
    icon: CalendarCheck,
    title: "Rezervări directe",
    body: "Telefon, WhatsApp, formular sau link extern, fără să schimbe fluxul actual.",
  },
  {
    icon: BarChart3,
    title: "Raportare simplă",
    body: "Activitate, solicitări și feedback într-un format ușor de urmărit.",
  },
];

const steps = [
  { icon: ScanLine, label: "Oaspetele scanează QR" },
  { icon: Send, label: "Trimite o solicitare" },
  { icon: LayoutDashboard, label: "Proprietatea răspunde din admin" },
];

const chips = [
  "Camere",
  "Oferte",
  "Galerie",
  "Facilități",
  "Mesaje",
  "Feedback",
  "Secțiuni active / inactive",
  "Date de contact",
  "Link rezervare",
];

const requests = [
  "Prosoape suplimentare",
  "Room service",
  "Taxi",
  "Informații locale",
  "Feedback privat",
];

const adminTiles = [
  ["Solicitări noi", "12"],
  ["Mesaje", "7"],
  ["Feedback", "4.8"],
  ["Rapoarte", "—"],
  ["Conținut site", "—"],
];

const QrGlyph = ({ size = 96 }: { size?: number }) => (
  <div className="grid grid-cols-9 gap-[2px]" style={{ width: size, height: size }}>
    {Array.from({ length: 81 }).map((_, i) => {
      const r = Math.floor(i / 9);
      const c = i % 9;
      const finder =
        (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
      const on = finder
        ? !(r === 1 && c === 1) && !(r === 1 && c === 7) && !(r === 7 && c === 1)
        : (i * 17) % 7 < 3;
      return (
        <span
          key={i}
          className="rounded-[1px]"
          style={{ background: on ? "#1f3b2c" : "rgba(31,59,44,0.09)" }}
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
    <div className="brochure-root min-h-screen w-full overflow-x-hidden py-6 px-3 md:py-10">
      <style>{`
        .brochure-root {
          --ivory: #f8f5ee;
          --ivory-deep: #efe9dc;
          --forest: #1f3b2c;
          --forest-soft: #2a4c39;
          --bronze: #a9743f;
          --bronze-soft: #d8a86e;
          --ink: #1b1a17;
          --line: rgba(31,59,44,0.14);
          background: #e7e3da;
          color: var(--ink);
        }
        .brochure-sheet {
          background: var(--ivory);
          box-shadow: 0 30px 80px -40px rgba(27,26,23,0.45);
        }
        .brochure-root .serif { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; letter-spacing: -0.015em; }
        .b-sec { break-inside: avoid; page-break-inside: avoid; }
        .b-card { background: #fffdf8; border: 1px solid var(--line); border-radius: 12px; }
        @media print {
          @page { size: A4 portrait; margin: 8mm; }
          .brochure-root { background: #fff; padding: 0; }
          .no-print { display: none !important; }
          .brochure-sheet { box-shadow: none; max-width: 100%; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* Print control — rendered outside the brochure sheet, hidden in print/screenshots */}
      <div className="no-print fixed bottom-5 right-5 z-50">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm tracking-wide shadow-lg transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--forest)", color: "var(--ivory)" }}
        >
          <Printer className="h-4 w-4" />
          Print / Save PDF
        </button>
      </div>

      <div className="brochure-sheet mx-auto w-full max-w-[1040px] overflow-hidden">
        {/* 1. Header — compact */}
        <header
          className="b-sec px-7 md:px-12 pt-8 pb-6"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] tracking-wide mb-3"
                style={{ background: "rgba(169,116,63,0.12)", color: "var(--bronze)", border: "1px solid rgba(169,116,63,0.3)" }}
              >
                <Bell className="h-3 w-3" />
                Program pilot pentru primele proprietăți partenere
              </span>
              <h1 className="serif text-4xl md:text-6xl leading-[0.95]" style={{ color: "var(--forest)" }}>
                Hotel GuestHub
              </h1>
              <p className="mt-3 text-base md:text-lg" style={{ color: "var(--ink)" }}>
                Website modern + Admin Hub + GuestHub QR
              </p>
              <p className="mt-1 text-sm opacity-70">Pentru moteluri, pensiuni și hoteluri mici</p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2 text-right">
              {["Site elegant RO / EN", "Cereri din cameră prin QR", "Totul într-un singur admin"].map((t) => (
                <span key={t} className="text-[13px] flex items-center gap-2" style={{ color: "var(--forest)" }}>
                  {t}
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--bronze)" }} />
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* 2. Product showcase */}
        <section className="b-sec px-7 md:px-12 py-8 grid md:grid-cols-12 gap-6 items-start">
          {/* Website mockup */}
          <div className="md:col-span-7">
            <div className="rounded-xl overflow-hidden bg-white" style={{ border: "1px solid var(--line)", boxShadow: "0 18px 40px -28px rgba(27,26,23,0.5)" }}>
              <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "var(--ivory-deep)" }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: "#c9c2b4" }} />
                ))}
                <div className="ml-3 h-4 flex-1 rounded-full" style={{ background: "rgba(31,59,44,0.07)" }} />
              </div>
              <div className="px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]" style={{ borderBottom: "1px solid var(--line)", color: "var(--forest)" }}>
                <span className="serif text-sm mr-2 flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full grid place-items-center text-[9px]" style={{ background: "var(--forest)", color: "var(--ivory)" }}>PV</span>
                  Pensiunea Verde
                </span>
                {["Acasă", "Camere", "Oferte", "Galerie", "Contact"].map((n) => (
                  <span key={n} className="opacity-70">{n}</span>
                ))}
                <span className="ml-auto opacity-60">RO / EN</span>
              </div>
              <div className="relative px-6 py-14 md:py-20" style={{ background: "linear-gradient(140deg, #24422f, #16281e)" }}>
                <p className="text-[10px] uppercase tracking-[0.28em] mb-3" style={{ color: "var(--bronze-soft)" }}>
                  Pensiune • Munte • Restaurant
                </p>
                <h2 className="serif text-3xl md:text-[2.6rem] leading-tight" style={{ color: "var(--ivory)" }}>
                  Confort local.<br />Experiențe autentice.
                </h2>
                <span
                  className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs tracking-wide"
                  style={{ background: "var(--bronze)", color: "#fff" }}
                >
                  Rezervă direct <ArrowRight className="h-3 w-3" />
                </span>
              </div>
              <div className="grid grid-cols-4 divide-x" style={{ borderTop: "1px solid var(--line)", borderColor: "var(--line)" }}>
                {[
                  [Bell, "Camere"],
                  [Wifi, "Facilități"],
                  [ImageIcon, "Galerie"],
                  [Phone, "Contact"],
                ].map(([Icon, label]) => {
                  const I = Icon as typeof Bell;
                  return (
                    <div key={label as string} className="flex flex-col items-center justify-center gap-1.5 py-4" style={{ borderColor: "var(--line)" }}>
                      <I className="h-4 w-4" strokeWidth={1.4} style={{ color: "var(--bronze)" }} />
                      <span className="text-[11px]" style={{ color: "var(--forest)" }}>{label as string}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className="mt-4 rounded-lg px-4 py-3 text-[13px] flex items-center gap-3"
              style={{ background: "var(--ivory-deep)", border: "1px solid rgba(169,116,63,0.3)", color: "var(--forest)" }}
            >
              <MapPin className="h-4 w-4 shrink-0" style={{ color: "var(--bronze)" }} />
              Oaspetele cere. Proprietatea vede totul în admin.
            </div>
          </div>

          {/* Right stack */}
          <div className="md:col-span-5 grid gap-4">
            {/* A. QR card */}
            <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
              <div className="rounded-lg bg-white p-2.5 shrink-0">
                <QrGlyph size={92} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em]" style={{ color: "var(--bronze-soft)" }}>GuestHub</p>
                <p className="serif text-2xl mt-1 leading-tight">GuestHub QR</p>
                <p className="text-[12px] mt-2 opacity-85 leading-relaxed">
                  Scanează codul din cameră și trimite rapid o solicitare.
                </p>
              </div>
            </div>

            {/* B. Mobile request screen */}
            <div className="b-card p-4 flex gap-4 items-center">
              <div className="rounded-[18px] p-2 shrink-0 w-[132px]" style={{ background: "#fff", border: "1px solid var(--line)" }}>
                <div className="rounded-[12px] overflow-hidden" style={{ background: "var(--ivory)" }}>
                  <div className="px-3 py-2.5" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
                    <p className="serif text-[13px] leading-tight">Bună ziua!</p>
                    <p className="text-[9px] opacity-80">Camera 12</p>
                  </div>
                  <ul className="p-2 space-y-1.5">
                    {requests.map((s) => (
                      <li
                        key={s}
                        className="flex items-center justify-between gap-1 rounded-md bg-white px-2 py-1.5 text-[8.5px] leading-tight"
                        style={{ border: "1px solid var(--line)" }}
                      >
                        {s}
                        <ArrowRight className="h-2.5 w-2.5 shrink-0" style={{ color: "var(--bronze)" }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <p className="serif text-xl leading-tight" style={{ color: "var(--forest)" }}>Cereri din cameră</p>
                <p className="text-[12px] mt-2 opacity-75 leading-relaxed">
                  Oaspetele alege ce are nevoie, în câteva secunde, fără apel telefonic.
                </p>
              </div>
            </div>

            {/* C. Admin Hub mini dashboard */}
            <div className="b-card p-4">
              <div className="flex items-center justify-between">
                <p className="serif text-xl" style={{ color: "var(--forest)" }}>Admin Hub</p>
                <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--bronze)" }}>Panou</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {adminTiles.map(([k, v]) => (
                  <div key={k} className="rounded-lg px-2.5 py-2" style={{ background: "var(--ivory)", border: "1px solid var(--line)" }}>
                    <p className="text-[9px] uppercase tracking-wider opacity-60 leading-tight">{k}</p>
                    <p className="serif text-lg mt-0.5" style={{ color: "var(--forest)" }}>{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(31,59,44,0.1)" }} />
                <div className="h-1.5 rounded-full w-2/3" style={{ background: "rgba(169,116,63,0.4)" }} />
                <div className="h-1.5 rounded-full w-5/6" style={{ background: "rgba(31,59,44,0.08)" }} />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Conversion callout */}
        <section className="b-sec px-7 md:px-12 pb-8">
          <div className="relative rounded-xl px-7 md:px-9 py-6" style={{ background: "var(--ivory-deep)", border: "1px solid var(--line)" }}>
            <span className="absolute left-0 top-5 bottom-5 w-[4px] rounded-full" style={{ background: "var(--bronze)" }} />
            <h3 className="serif text-2xl md:text-3xl" style={{ color: "var(--forest)" }}>
              Mai mult decât un site frumos.
            </h3>
            <p className="mt-3 max-w-[52rem] text-[14px] leading-relaxed opacity-80">
              Un website modern ajută oaspeții să înțeleagă rapid camerele, facilitățile și avantajele proprietății,
              crescând șansele de contact și rezervare directă.
            </p>
          </div>
        </section>

        {/* 4. Core benefits */}
        <section className="b-sec px-7 md:px-12 pb-8">
          <h3 className="serif text-2xl md:text-3xl" style={{ color: "var(--forest)" }}>Ce primește proprietatea?</h3>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {benefits.map((b) => (
              <div key={b.title} className="b-card p-4">
                <div className="h-9 w-9 rounded-lg grid place-items-center mb-3" style={{ background: "rgba(169,116,63,0.12)", color: "var(--bronze)" }}>
                  <b.icon className="h-5 w-5" strokeWidth={1.4} />
                </div>
                <p className="serif text-lg leading-snug" style={{ color: "var(--forest)" }}>{b.title}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed opacity-75">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. How it works */}
        <section className="b-sec px-7 md:px-12 py-9" style={{ background: "var(--ivory-deep)" }}>
          <h3 className="serif text-2xl md:text-3xl" style={{ color: "var(--forest)" }}>Cum funcționează?</h3>
          <div className="mt-6 grid md:grid-cols-3 gap-5 md:gap-3">
            {steps.map((s, i) => (
              <div key={s.label} className="relative flex md:flex-col items-center md:text-center gap-4">
                <div
                  className="h-14 w-14 shrink-0 rounded-full grid place-items-center bg-white"
                  style={{ border: "1px solid var(--bronze)", color: "var(--forest)" }}
                >
                  <s.icon className="h-5 w-5" strokeWidth={1.3} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] mb-1" style={{ color: "var(--bronze)" }}>
                    Pasul {i + 1}
                  </p>
                  <p className="serif text-lg leading-snug" style={{ color: "var(--forest)" }}>{s.label}</p>
                </div>
                {i < steps.length - 1 && (
                  <span
                    className="hidden md:block absolute top-7 left-[calc(50%+2.25rem)] right-[-50%] h-px"
                    style={{ background: "rgba(169,116,63,0.55)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 6 + 7 */}
        <section className="b-sec px-7 md:px-12 py-9 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <h3 className="serif text-2xl md:text-3xl" style={{ color: "var(--forest)" }}>
              Ce poate administra proprietatea?
            </h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full px-3.5 py-1.5 text-[12.5px]"
                  style={{ background: "#fffdf8", border: "1px solid var(--line)", color: "var(--forest)" }}
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-5 text-[13px] leading-relaxed opacity-75 max-w-[34rem]">
              Conținutul poate fi actualizat rapid, fără dezvoltator pentru fiecare modificare.
            </p>
          </div>

          <aside className="md:col-span-5 rounded-xl p-6" style={{ background: "var(--forest-soft)", color: "var(--ivory)" }}>
            <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--bronze-soft)" }}>Opțional</p>
            <p className="serif text-xl mt-2 leading-snug">foto / video, dronă, panorame 360</p>
            <div className="mt-4 flex gap-4" style={{ color: "var(--bronze-soft)" }}>
              <Camera className="h-5 w-5" strokeWidth={1.3} />
              <Plane className="h-5 w-5" strokeWidth={1.3} />
              <Compass className="h-5 w-5" strokeWidth={1.3} />
            </div>
            <p className="mt-4 text-[13px] opacity-80 leading-relaxed">
              Pentru proprietățile care vor o prezentare vizuală mai puternică.
            </p>
          </aside>
        </section>

        {/* 8. Pilot CTA */}
        <section className="b-sec px-7 md:px-12 py-10" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:justify-between">
            <div>
              <h3 className="serif text-2xl md:text-4xl leading-tight max-w-[32rem]">
                Program pilot pentru primele proprietăți partenere
              </h3>
              <p className="mt-3 opacity-85 text-[15px]">Demo și acces de prezentare disponibile la cerere.</p>
              <p className="mt-1 text-sm" style={{ color: "var(--bronze-soft)" }}>Cost preferențial în perioada de pilot.</p>
            </div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm tracking-wide shrink-0"
              style={{ background: "var(--bronze)", color: "#fff" }}
            >
              Solicită demo-ul <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </section>

        {/* 9. Footer */}
        <footer className="b-sec px-7 md:px-12 py-6 text-[12px] leading-relaxed opacity-70">
          Hotel GuestHub este o soluție de prezentare, administrare și GuestHub QR pentru proprietăți de cazare mici și medii.
        </footer>
      </div>
    </div>
  );
};

export default Brochure;
