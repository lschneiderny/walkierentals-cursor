# Walkie Talkie Rental Platform

A comprehensive walkie talkie rental platform built with Next.js, TypeScript, Prisma, and NextAuth.js. This platform allows customers to rent walkie talkies for events and businesses, while providing employees with a complete management system.

## Features

### 🛒 Shopping Cart System
- Add rentals and store items to cart with date selection
- Real-time cost calculation based on rental periods
- Persistent cart storage using localStorage
- Quantity management and item removal

### 📅 Date Selection for Rentals
- Interactive date picker for rental periods
- Quick preset options (1, 3, 7, 14, 30 days)
- Automatic cost calculation based on selected dates
- Visual feedback showing rental duration

### 👨‍💼 Employee Management System
- Role-based authentication (Customer, Employee, Admin)
- Comprehensive admin dashboard for managing inventory
- CRUD operations for rentals, packages, and store items
- Category management system

### 📦 Product Management
- **Rentals**: Professional walkie talkies for rent
- **Packages**: Pre-configured bundles for events
- **Store Items**: Accessories and equipment for purchase
- Category-based organization

### 🔐 Authentication & Authorization
- NextAuth.js integration with credentials provider
- Secure password hashing with bcrypt
- Session management with JWT tokens
- Protected admin routes

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Date Handling**: react-datepicker

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Seed the database with default data:
```bash
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Default Employee Account

After seeding the database, you can log in as an employee with:
- **Email**: `admin@walkierentals.com`
- **Password**: `admin123`
- **Role**: Employee (can access admin dashboard)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   │   ├── admin/         # Admin-only API routes
│   │   ├── auth/          # Authentication routes
│   │   ├── categories/    # Category management
│   │   ├── packages/      # Package listings
│   │   ├── rentals/       # Rental listings
│   │   └── store/         # Store item listings
│   ├── auth/              # Authentication pages
│   ├── checkout/          # Checkout process
│   ├── packages/          # Package browsing
│   ├── rentals/           # Rental browsing
│   └── store/             # Store browsing
├── components/            # React components
│   ├── AddToCartModal.tsx # Cart addition modal
│   ├── CartSidebar.tsx    # Shopping cart sidebar
│   ├── DatePicker.tsx     # Date selection component
│   ├── Header.tsx         # Main navigation
│   ├── ListingManagement.tsx # Admin listing management
│   └── ...
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication configuration
│   ├── auth-utils.ts     # Authentication utilities
│   ├── cart-context.tsx  # Shopping cart context
│   └── prisma.ts         # Database client
└── prisma/               # Database schema and migrations
    ├── schema.prisma     # Database schema
    └── seed.ts           # Database seeding script
```

## Database Schema

The platform uses the following main entities:

- **Users**: Customer and employee accounts with role-based access
- **Categories**: Organization for products (Professional, Waterproof, etc.)
- **Rentals**: Walkie talkies available for rent
- **Packages**: Pre-configured rental bundles
- **StoreItems**: Accessories and equipment for purchase
- **Orders**: Customer orders and rentals
- **OrderItems**: Individual items within orders

## API Endpoints

### Public Endpoints
- `GET /api/rentals` - List available rentals
- `GET /api/packages` - List available packages
- `GET /api/store` - List store items
- `GET /api/categories` - List categories

### Admin Endpoints (Employee/Admin only)
- `GET/POST /api/admin/rentals` - Manage rentals
- `GET/PUT/DELETE /api/admin/rentals/[id]` - Individual rental operations
- `GET/POST /api/admin/packages` - Manage packages
- `GET/PUT/DELETE /api/admin/packages/[id]` - Individual package operations
- `GET/POST /api/admin/store` - Manage store items
- `GET/PUT/DELETE /api/admin/store/[id]` - Individual store item operations

## Development

### Adding New Features
1. Create API routes in `src/app/api/`
2. Add React components in `src/components/`
3. Update the database schema in `prisma/schema.prisma`
4. Run migrations with `npx prisma db push`

### Testing
- Use the default employee account to test admin functionality
- Test cart functionality by adding items from rentals, packages, and store pages
- Verify date selection and cost calculation

## Deployment

The app can be deployed to Vercel, Netlify, or any Node.js hosting platform:

1. Build the application:
```bash
npm run build
```

2. Deploy the generated files

**Note**: Make sure to set up the required environment variables for production:
- `DATABASE_URL` - Your production database URL
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - A secure random secret

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
