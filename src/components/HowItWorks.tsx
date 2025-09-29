const steps = [
  {
    number: "01",
    title: "Reserve Your Gear",
    description: "Choose radios, accessories, or pre-built packages. Schedule the delivery window that fits your production timeline.",
    detail: "Real-time availability • Custom programming"
  },
  {
    number: "02",
    title: "We Prep & Ship",
    description: "Every kit is sanitized, charged, and labeled by channel. Flight cases arrive with return labels and checklists.",
    detail: "Nationwide 2-day shipping • Local pickup in major markets"
  },
  {
    number: "03",
    title: "Deploy Instantly",
    description: "Connect teams within minutes. Our on-call radio techs can help with range testing, repeater setup, and troubleshooting.",
    detail: "24/7 support • Optional on-site tech available"
  },
  {
    number: "04",
    title: "Send It Back",
    description: "Drop rentals in the same cases and attach the prepaid label. Need more time? Extend your rental with one click.",
    detail: "Pickup scheduling • Flexible extensions"
  }
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Production-ready rentals, zero friction</h2>
          <p className="mt-4 text-lg text-gray-600">
            From campus events to nationwide tours, we keep your comms kit dialed in so your crew stays in sync.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <div key={step.title} className="relative bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="absolute -top-4 left-6 inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white text-sm font-semibold">
                {step.number}
              </div>
              <div className="mt-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
