import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Indoor Drivers',
    desc: 'Reliable, rugged LED drivers built for commercial and residential indoor lighting.',
  },
  {
    name: 'Outdoor Drivers',
    desc: 'Weatherproof drivers engineered for street lighting, transportation and sports installations.',
  },
  {
    name: 'Smart Drivers',
    desc: 'Dimmable, smart-control ready drivers for modern connected lighting systems.',
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-pp-navy-3 bg-gradient-to-b from-pp-navy-2 to-pp-navy">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-pp-gold">
            24+ Years of Illumination
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            As Sun Sets, <span className="text-pp-gold">We Illuminate</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Power Palazzo manufactures rugged, economical LED drivers and components for transportation,
            hospitality, education, sports, residential and commercial sectors.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/chat"
              className="rounded-md bg-pp-gold px-6 py-3 font-semibold text-pp-navy transition-colors hover:bg-pp-gold-2"
            >
              Ask Our Assistant
            </Link>
            <Link
              to="/staff/login"
              className="rounded-md border border-pp-navy-4 px-6 py-3 font-semibold text-slate-100 transition-colors hover:border-pp-gold hover:text-pp-gold"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-10 text-center text-2xl font-bold text-white">Our Product Range</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="rounded-xl border border-pp-navy-3 bg-pp-navy-2 p-6 transition-colors hover:border-pp-gold"
            >
              <h3 className="mb-2 text-lg font-semibold text-pp-gold">{cat.name}</h3>
              <p className="text-sm text-slate-300">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-pp-navy-3 bg-pp-navy-2">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white">Have a question about our products?</h2>
          <p className="mt-3 text-slate-300">Chat with our assistant for product info, specs and quotes.</p>
          <Link
            to="/chat"
            className="mt-6 inline-block rounded-md bg-pp-gold px-6 py-3 font-semibold text-pp-navy transition-colors hover:bg-pp-gold-2"
          >
            Start Chatting
          </Link>
        </div>
      </section>
    </div>
  );
}
