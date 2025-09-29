import Link from "next/link"

const featured = [
  {
    id: "motorola-xpr-7550e",
    name: "Motorola XPR 7550e Radio Kit",
    price: 27,
    period: "per day",
    availability: "Ships today",
    tag: "Most requested",
    specs: ["AES encryption", "Waterproof", "Bluetooth"]
  },
  {
    id: "film-crew-bundle",
    name: "Film Crew Package (12 radios)",
    price: 289,
    period: "per 7-day rental",
    availability: "In stock",
    tag: "Production favorite",
    specs: ["Labeled channels", "IFB ready", "On-call tech"]
  },
  {
    id: "security-headsets",
    name: "Covert Security Headset Set",
    price: 9,
    period: "per day",
    availability: "Low stock",
    tag: "Staff picks",
    specs: ["Acoustic tube", "Push-to-talk", "Noise isolating"]
  },
  {
    id: "rapid-charge",
    name: "12-Port Rapid Charging Station",
    price: 18,
    period: "per day",
    availability: "Ships tomorrow",
    tag: "Event essential",
    specs: ["Hot swap bays", "Status LEDs", "Flight-ready"]
  }
]

export default function FeaturedProducts() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Handpicked gear</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Rentals and accessories crews love most
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl">
              Quick-ship kits for productions, campuses, and security teams. Every item is inspected before it leaves our warehouse.
            </p>
          </div>
          <Link href="/rentals" className="self-start inline-flex items-center text-blue-600 font-semibold hover:text-blue-800">
            View full rental catalog →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {featured.map((item) => (
            <div key={item.id} className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">
                {item.tag}
              </div>
              <div className="absolute top-4 right-4 text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {item.availability}
              </div>

              <div className="px-6 pt-16 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">ID #{item.id}</p>
                  </div>
                  <span className="text-3xl">📻</span>
                </div>

                <div className="space-y-3">
                  <ul className="text-sm text-gray-600 space-y-1">
                    {item.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-2">
                        <span className="text-green-500">•</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">${item.price}</span>
                    <span className="text-sm text-gray-500">{item.period}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href={`/rentals`}
                    className="inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 text-white font-semibold py-2.5 px-4 hover:bg-blue-700 transition-colors"
                  >
                    Reserve now
                  </Link>
                  <Link
                    href={`/packages`}
                    className="inline-flex justify-center items-center gap-2 rounded-lg border border-gray-200 text-gray-700 font-semibold py-2.5 px-4 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Add to custom package
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
