import Link from "next/link"

const heroStats = [
  { value: "25k+", label: "Radios Shipped" },
  { value: "48hr", label: "Turnaround" },
  { value: "4.9★", label: "Customer Rating" }
]

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="container mx-auto px-4 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-1 text-sm uppercase tracking-wider">
              <span className="text-orange-300">Trusted by production crews</span>
              <span className="text-white/60">|</span>
              <span className="text-orange-300">Event planners • Security • Teams</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Reliable walkie talkie rentals
              <span className="text-orange-400">. Delivered when you need them.</span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 max-w-xl">
              Reserve pro-grade two-way radios, headsets, and accessories that arrive fully charged, programmed, and ready to deploy for your next production or event.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/rentals"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-center"
              >
                Browse Rentals
              </Link>
              <Link
                href="/packages"
                className="bg-transparent border border-white/40 hover:bg-white hover:text-blue-900 text-white px-8 py-3 rounded-lg font-semibold text-center transition-colors"
              >
                View Event Packages
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              {heroStats.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-lg py-4">
                  <div className="text-2xl font-bold text-orange-300">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wide text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-400/40 to-blue-400/40 blur-xl" aria-hidden="true" />
            <div className="relative bg-white text-gray-900 rounded-3xl shadow-2xl p-6 md:p-8 border border-white/40">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-blue-500 font-semibold uppercase tracking-widest">Mission Control</p>
                  <h2 className="text-2xl font-bold">Event Gear Checklist</h2>
                </div>
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500 text-2xl">
                  📻
                </span>
              </div>

              <ul className="space-y-4">
                {[{ title: "Motorola XPR 7550e Radios", detail: "12 handheld units" }, { title: "Discreet Surveillance Earpieces", detail: "12 acoustic tubes" }, { title: "Multi-bay Rapid Chargers", detail: "2 six-slot hubs" }, { title: "Event Day Support", detail: "Live technical concierge" }].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="mt-1 text-green-500">✔</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-900">Need a custom package?</p>
                <p className="text-sm text-blue-700">Chat with an event specialist to tailor gear for your production, campus, or venue.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
