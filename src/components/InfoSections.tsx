import Link from "next/link"

const sections = [
  {
    icon: "🎧",
    title: "Production Concierge",
    description: "Need a channel map or repeater? Radio specialists are on-call to configure kits for film, broadcast, and live events.",
    linkText: "Meet the team",
    linkHref: "/help",
    accent: "bg-blue-100 text-blue-600"
  },
  {
    icon: "📦",
    title: "Same-Day Turnaround",
    description: "Orders placed by 3 PM ship the same day. Local courier pickup available in select cities.",
    linkText: "See logistics",
    linkHref: "/rentals",
    accent: "bg-orange-100 text-orange-500"
  },
  {
    icon: "🛠️",
    title: "Own Your Fleet",
    description: "Ready to purchase? Shop pre-configured bundles, accessories, and service plans in our store.",
    linkText: "Visit the store",
    linkHref: "/store",
    accent: "bg-emerald-100 text-emerald-600"
  }
]

export default function InfoSections() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {sections.map((section) => (
            <div key={section.title} className="group bg-gray-50 border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${section.accent} text-2xl mb-6`}>
                {section.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{section.description}</p>
              <Link href={section.linkHref} className="text-blue-600 font-semibold inline-flex items-center gap-2 hover:text-blue-800">
                {section.linkText}
                <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
