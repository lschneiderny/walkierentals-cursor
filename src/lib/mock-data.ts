export type ListingCategory = {
  name: string
}

export type RentalListing = {
  id: string
  slug: string
  name: string
  description: string | null
  dailyRate: number
  image: string | null
  categoryId: string
  currentInventory: number
  available: boolean
  specs: Record<string, unknown> | null
  availabilityDate: string | null
  searchTags: string
  category: ListingCategory
}

export type RetailItemListing = {
  id: string
  slug: string
  name: string
  description: string | null
  unitCost: number
  image: string | null
  categoryId: string
  currentInventory: number
  available: boolean
  specs: Record<string, unknown> | null
  searchTags: string
  category: ListingCategory
}

export type PackageItem = {
  name: string
  quantity: number
}

export type PackageListing = {
  id: string
  slug: string
  name: string
  description: string | null
  dailyRate: number
  image: string | null
  categoryId: string
  items: PackageItem[]
  searchTags: string
  category: ListingCategory
}

export const mockRentals: RentalListing[] = [
  {
    id: "rental-1",
    slug: "motorola-xpr-7550e",
    name: "Motorola XPR 7550e",
    description: "Professional digital two-way radio with GPS and Bluetooth connectivity",
    dailyRate: 25.0,
    image: null,
    categoryId: "1",
    currentInventory: 50,
    available: true,
    specs: { frequency: "VHF/UHF", power: "5W", battery: "Li-Ion" },
    availabilityDate: null,
    searchTags: "motorola, professional, bluetooth",
    category: { name: "Professional" }
  },
  {
    id: "rental-2",
    slug: "kenwood-nx-340",
    name: "Kenwood NX-340",
    description: "Compact UHF digital transceiver with excellent audio quality",
    dailyRate: 18.0,
    image: null,
    categoryId: "1",
    currentInventory: 30,
    available: true,
    specs: { frequency: "UHF", power: "5W", battery: "Ni-MH" },
    availabilityDate: "2025-01-15",
    searchTags: "kenwood, uhf, compact",
    category: { name: "Professional" }
  },
  {
    id: "rental-3",
    slug: "hytera-pd785",
    name: "Hytera PD785",
    description: "Advanced digital radio with color display and GPS navigation",
    dailyRate: 22.0,
    image: null,
    categoryId: "1",
    currentInventory: 25,
    available: true,
    specs: { frequency: "VHF/UHF", power: "4W", battery: "Li-Ion" },
    availabilityDate: null,
    searchTags: "hytera, gps, advanced",
    category: { name: "Professional" }
  },
  {
    id: "rental-4",
    slug: "icom-ic-f3400d",
    name: "Icom IC-F3400D",
    description: "IDAS digital transceiver with waterproof and dustproof design",
    dailyRate: 20.0,
    image: null,
    categoryId: "2",
    currentInventory: 15,
    available: true,
    specs: { frequency: "VHF/UHF", power: "5W", battery: "Li-Ion" },
    availabilityDate: "2025-01-20",
    searchTags: "icom, waterproof, rugged",
    category: { name: "Waterproof" }
  },
  {
    id: "rental-5",
    slug: "baofeng-uv-5r",
    name: "Baofeng UV-5R",
    description: "Affordable dual-band handheld transceiver for basic communications",
    dailyRate: 8.0,
    image: null,
    categoryId: "3",
    currentInventory: 100,
    available: true,
    specs: { frequency: "VHF/UHF", power: "5W", battery: "Li-Ion" },
    availabilityDate: null,
    searchTags: "baofeng, budget, dual-band",
    category: { name: "Budget" }
  },
  {
    id: "rental-6",
    slug: "midland-gxt1000vp4",
    name: "Midland GXT1000VP4",
    description: "Long-range GMRS radio with weather alerts and privacy codes",
    dailyRate: 15.0,
    image: null,
    categoryId: "4",
    currentInventory: 40,
    available: true,
    specs: { frequency: "GMRS", power: "5W", battery: "Ni-MH" },
    availabilityDate: null,
    searchTags: "midland, gmrs, long-range",
    category: { name: "Consumer" }
  }
]

export const mockRetailItems: RetailItemListing[] = [
  {
    id: "retail-1",
    slug: "professional-over-ear-headset",
    name: "Professional Over-Ear Headset",
    description: "Noise-canceling headset with boom microphone for clear communication",
    unitCost: 89.99,
    image: null,
    categoryId: "1",
    currentInventory: 25,
    available: true,
    specs: { type: "Over-ear", noiseCanceling: true, microphone: "Boom" },
    searchTags: "headset, professional, audio",
    category: { name: "Headsets" }
  },
  {
    id: "retail-2",
    slug: "surveillance-earpiece-kit",
    name: "Surveillance Earpiece Kit",
    description: "Discreet earpiece with clear acoustic tube for security personnel",
    unitCost: 34.99,
    image: null,
    categoryId: "1",
    currentInventory: 15,
    available: true,
    specs: { type: "Earpiece", style: "Acoustic tube", color: "Black" },
    searchTags: "earpiece, surveillance, discreet",
    category: { name: "Headsets" }
  },
  {
    id: "retail-3",
    slug: "multi-unit-desktop-charger",
    name: "Multi-Unit Desktop Charger",
    description: "6-bay desktop charger compatible with Motorola XPR series",
    unitCost: 299.99,
    image: null,
    categoryId: "2",
    currentInventory: 8,
    available: true,
    specs: { bays: 6, compatibility: "Motorola XPR", voltage: "12V" },
    searchTags: "charger, desktop, multi-unit",
    category: { name: "Chargers" }
  },
  {
    id: "retail-4",
    slug: "high-capacity-battery-pack",
    name: "High-Capacity Battery Pack",
    description: "Extended life Li-Ion battery for prolonged use in demanding environments",
    unitCost: 79.99,
    image: null,
    categoryId: "2",
    currentInventory: 30,
    available: true,
    specs: { capacity: "3000mAh", chemistry: "Li-Ion", voltage: "7.4V" },
    searchTags: "battery, li-ion, high-capacity",
    category: { name: "Batteries" }
  },
  {
    id: "retail-5",
    slug: "waterproof-protective-case",
    name: "Waterproof Protective Case",
    description: "Hard-shell case with foam interior for safe transport of 6 walkie talkies",
    unitCost: 149.99,
    image: null,
    categoryId: "3",
    currentInventory: 12,
    available: true,
    specs: { capacity: 6, material: "ABS plastic", waterproof: "IP67" },
    searchTags: "case, waterproof, transport",
    category: { name: "Cases" }
  },
  {
    id: "retail-6",
    slug: "belt-clip-and-holster-combo",
    name: "Belt Clip and Holster Combo",
    description: "Heavy-duty belt clip with quick-release holster for professional use",
    unitCost: 24.99,
    image: null,
    categoryId: "4",
    currentInventory: 45,
    available: true,
    specs: { material: "Nylon", attachment: "Belt clip", quickRelease: true },
    searchTags: "holster, belt clip, accessory",
    category: { name: "Accessories" }
  },
  {
    id: "retail-7",
    slug: "external-antenna-kit",
    name: "External Antenna Kit",
    description: "High-gain antenna for extended range in outdoor environments",
    unitCost: 59.99,
    image: null,
    categoryId: "4",
    currentInventory: 20,
    available: true,
    specs: { gain: "5dBi", frequency: "VHF/UHF", connector: "SMA" },
    searchTags: "antenna, high-gain, outdoor",
    category: { name: "Antennas" }
  },
  {
    id: "retail-8",
    slug: "programming-cable",
    name: "Programming Cable",
    description: "USB programming cable for walkie talkie configuration and updates",
    unitCost: 29.99,
    image: null,
    categoryId: "4",
    currentInventory: 18,
    available: true,
    specs: { interface: "USB", compatibility: "Multiple brands", length: "6ft" },
    searchTags: "programming, cable, usb",
    category: { name: "Accessories" }
  }
]

export const mockPackages: PackageListing[] = [
  {
    id: "package-1",
    slug: "small-event-package",
    name: "Small Event Package",
    description: "Perfect for small gatherings, family events, or small business operations",
    dailyRate: 75.0,
    image: null,
    categoryId: "1",
    items: [
      { name: "Motorola XPR 7550e", quantity: 4 },
      { name: "Multi-unit Charger", quantity: 1 },
      { name: "Earpieces", quantity: 4 }
    ],
    searchTags: "small event, starter, family",
    category: { name: "Small Events" }
  },
  {
    id: "package-2",
    slug: "medium-event-package",
    name: "Medium Event Package",
    description: "Ideal for corporate events, medium-sized construction sites, or school activities",
    dailyRate: 150.0,
    image: null,
    categoryId: "2",
    items: [
      { name: "Kenwood NX-340", quantity: 8 },
      { name: "Multi-unit Charger", quantity: 2 },
      { name: "Headsets", quantity: 8 },
      { name: "Carrying Cases", quantity: 2 }
    ],
    searchTags: "medium event, corporate, school",
    category: { name: "Medium Events" }
  },
  {
    id: "package-3",
    slug: "large-event-package",
    name: "Large Event Package",
    description: "Complete solution for large events, festivals, or major construction projects",
    dailyRate: 300.0,
    image: null,
    categoryId: "3",
    items: [
      { name: "Hytera PD785", quantity: 16 },
      { name: "Multi-unit Charger", quantity: 4 },
      { name: "Professional Headsets", quantity: 16 },
      { name: "Repeater System", quantity: 1 },
      { name: "Carrying Cases", quantity: 4 }
    ],
    searchTags: "large event, festival, construction",
    category: { name: "Large Events" }
  },
  {
    id: "package-4",
    slug: "construction-pro-package",
    name: "Construction Pro Package",
    description: "Heavy-duty package designed for construction sites and industrial use",
    dailyRate: 200.0,
    image: null,
    categoryId: "4",
    items: [
      { name: "Icom IC-F3400D (Waterproof)", quantity: 10 },
      { name: "Heavy-duty Headsets", quantity: 10 },
      { name: "Multi-unit Charger", quantity: 2 },
      { name: "Protective Cases", quantity: 10 }
    ],
    searchTags: "construction, waterproof, pro",
    category: { name: "Construction" }
  },
  {
    id: "package-5",
    slug: "security-package",
    name: "Security Package",
    description: "Professional security communication solution with discrete accessories",
    dailyRate: 180.0,
    image: null,
    categoryId: "5",
    items: [
      { name: "Motorola XPR 7550e", quantity: 8 },
      { name: "Surveillance Earpieces", quantity: 8 },
      { name: "Multi-unit Charger", quantity: 2 },
      { name: "Belt Clips", quantity: 8 }
    ],
    searchTags: "security, surveillance, professional",
    category: { name: "Security" }
  },
  {
    id: "package-6",
    slug: "wedding-coordinator-package",
    name: "Wedding/Event Coordinator Package",
    description: "Complete coordination package for weddings and special events",
    dailyRate: 120.0,
    image: null,
    categoryId: "6",
    items: [
      { name: "Compact Walkie Talkies", quantity: 6 },
      { name: "Discreet Earpieces", quantity: 6 },
      { name: "Multi-unit Charger", quantity: 1 },
      { name: "Event Planning Guide", quantity: 1 }
    ],
    searchTags: "wedding, coordinator, special event",
    category: { name: "Events" }
  }
]

