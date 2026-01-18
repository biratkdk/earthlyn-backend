# EARTHLYN Backend - Setup Guide

## Overview
EARTHLYN is a Web 3.0 e-commerce marketplace for eco-friendly products. This guide covers complete backend setup using NestJS, Prisma ORM, and PostgreSQL.

## Prerequisites
- **Node.js**: v18+ (LTS recommended)
- **PostgreSQL**: v13+
- **npm**: v8+
- **Git**: For version control

## 1. Installation & Setup

### Step 1: Clone & Navigate
\\\ash
cd c:\Users\Birat\Desktop\earthlyn-backend
\\\

### Step 2: Install Dependencies
\\\ash
npm install
\\\

### Step 3: Environment Configuration
Create a \.env\ file in the project root:

\\\env
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/earthlyn"

# JWT Configuration
JWT_SECRET="your-secret-key-change-this"
JWT_EXPIRATION="7d"

# Server Port
PORT=3000

# Node Environment
NODE_ENV="development"
\\\

### Step 4: Database Setup
The database is already created and migrated. Verify connection:

\\\ash
npx prisma studio
\\\

This opens Prisma Studio at http://localhost:5555 to browse your database.

## 2. Running the Application

### Development Mode (with auto-reload)
\\\ash
npm run start:dev
\\\

Server will run on: **http://localhost:3000**

### Production Build
\\\ash
npm run build
npm run start:prod
\\\

## 3. Project Structure

\\\
earthlyn-backend/
├── src/
│   ├── admin/              # Admin dashboard operations
│   ├── auth/               # Authentication & JWT
│   ├── buyer/              # Buyer profile management
│   ├── seller/             # Seller operations
│   ├── product/            # Product catalog
│   ├── order/              # Order management
│   ├── messaging/          # Buyer-seller messaging
│   ├── common/             # Shared utilities
│   │   ├── decorators/     # JWT, roles decorators
│   │   ├── filters/        # Global exception handling
│   │   ├── guards/         # JWT, role-based auth guards
│   │   └── interceptors/   # Response transformation
│   ├── database/           # Prisma service
│   ├── config/             # Configuration module
│   └── app.module.ts       # Root module
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Schema migrations
├── dist/                   # Compiled output
├── package.json
├── tsconfig.json
└── .env                    # Environment variables
\\\

## 4. API Endpoints

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /auth/register | User registration |
| POST | /auth/login | User login (returns JWT) |

**Register Request:**
\\\json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123",
  "role": "BUYER"
}
\\\

**Login Request:**
\\\json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\\\

**Response:**
\\\json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "BUYER"
  }
}
\\\

### Buyers
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /buyers | JWT | Create buyer profile |
| GET | /buyers | - | List all buyers |
| GET | /buyers/:id | - | Get buyer details |
| PUT | /buyers/:id | JWT | Update buyer profile |
| DELETE | /buyers/:id | JWT | Delete buyer |

### Sellers
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /sellers | JWT | Create seller profile |
| GET | /sellers | - | List all sellers |
| GET | /sellers/:id | - | Get seller details |
| PUT | /sellers/:id | JWT | Update seller profile |

### Products
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /products | JWT | Create product (Seller only) |
| GET | /products | - | List all products |
| GET | /products/:id | - | Get product details |
| PUT | /products/:id | JWT | Update product |
| DELETE | /products/:id | JWT | Delete product |

### Orders
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /orders | JWT | Create order |
| GET | /orders | JWT | List orders (with filters) |
| GET | /orders/:id | JWT | Get order details |
| PATCH | /orders/:id | JWT | Update order status |
| DELETE | /orders/:id | JWT | Cancel order |
| GET | /orders/buyer/:buyerId | JWT | Get buyer's orders |
| GET | /orders/status/:status | JWT | Filter by status |

### Messaging
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /messages | JWT | Send message |
| GET | /messages/conversations | JWT | Get user conversations |
| GET | /messages/conversation/:otherId | JWT | Get conversation with user |
| POST | /messages/:id/read | JWT | Mark message as read |

### Admin
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /admin/balance | JWT | Manage user balance |
| GET | /admin/stats | JWT | Dashboard statistics |

## 5. Authentication

### JWT Token
All protected endpoints require the JWT token in the Authorization header:

\\\ash
Authorization: Bearer <access_token>
\\\

### Token Expiration
- Default: 7 days
- Set via JWT_EXPIRATION in .env

### Refresh Token Strategy
Currently implemented: Single token valid for 7 days. For production, implement refresh token rotation.

## 6. User Roles & Permissions

| Role | Capabilities |
|------|--------------|
| **ADMIN** | Manage users, approve sellers, view stats |
| **SELLER** | Create products, manage inventory, view sales |
| **BUYER** | Browse products, create orders, message sellers |
| **CUSTOMER_SERVICE** | Support tickets, dispute resolution |

Role-based access is enforced via @Roles() decorator and RolesGuard.

## 7. Database Schema Overview

### Core Models
- **User**: Authentication & profiles (email, passwordHash, role, balance, ecoPoints)
- **Seller**: Seller profiles with KYC status, tier, verification
- **Buyer**: Buyer profiles with purchase history
- **Product**: Eco-friendly products with approval workflow
- **Order**: Purchase orders with status tracking
- **Transaction**: Financial transactions (credits/debits)
- **Message**: Bidirectional user messaging
- **EcoImpact**: Environmental impact tracking

### Key Enums
- UserRole: ADMIN, SELLER, BUYER, CUSTOMER_SERVICE
- SellerTier: SEED, SPROUT, BLOOM, EARTH_GUARDIAN
- OrderStatus: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
- DeliveryStatus: PROCESSING, SHIPPED, DELIVERED, RETURNED
- StockStatus: IN_STOCK, LOW_STOCK, OUT_OF_STOCK

## 8. Testing Endpoints

### Using cURL

**Register a User:**
\\\ash
curl -X POST http://localhost:3000/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "buyer@example.com",
    "name": "Jane Buyer",
    "password": "securePassword123",
    "role": "BUYER"
  }'
\\\

**Login:**
\\\ash
curl -X POST http://localhost:3000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "buyer@example.com",
    "password": "securePassword123"
  }'
\\\

**Create Buyer Profile (authenticated):**
\\\ash
curl -X POST http://localhost:3000/buyers \\
  -H "Authorization: Bearer <your_jwt_token>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": "user-id-from-token"
  }'
\\\

### Using Postman
1. Import the API endpoints
2. Set variable: \{{baseUrl}} = http://localhost:3000\
3. After login, extract token and set: \{{token}} = <access_token>\
4. Use \{{token}}\ in Authorization header for protected routes

## 9. Common Issues & Solutions

### Issue: PostgreSQL Connection Failed
**Solution:**
\\\ash
# Verify PostgreSQL is running
psql -U postgres -h localhost -d earthlyn

# Check .env DATABASE_URL format
\\\

### Issue: Prisma Client Not Generated
**Solution:**
\\\ash
npx prisma generate
\\\

### Issue: Build Errors
**Solution:**
\\\ash
# Clear cache and rebuild
rm -r dist node_modules/.prisma
npm run build
\\\

### Issue: JWT Decode Errors
**Solution:**
- Verify JWT_SECRET is set in .env
- Check Authorization header format: "Bearer token"
- Ensure token hasn't expired (7 days default)

## 10. Development Workflow

### 1. Schema Changes
After modifying \prisma/schema.prisma\:
\\\ash
# Create migration
npx prisma migrate dev --name describe_change

# View schema visually
npx prisma studio
\\\

### 2. Database Reset (Development Only)
\\\ash
npx prisma migrate reset
\\\

### 3. Code Quality
\\\ash
# Lint TypeScript
npm run lint

# Format code
npm run format
\\\

## 11. Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Update DATABASE_URL to production database
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS for frontend domain
- [ ] Set up error logging (e.g., Sentry)
- [ ] Enable rate limiting
- [ ] Database backups configured
- [ ] SSL certificates installed
- [ ] Environment variables secured (use secret manager)

## 12. Performance Tips

1. **Database**: Add indexes on frequently queried columns
2. **Caching**: Implement Redis for session/product caching
3. **Pagination**: Use limit/offset for large datasets
4. **Compression**: Enable gzip middleware
5. **Monitoring**: Set up application performance monitoring

## 13. Support & Resources

- **NestJS Docs**: https://docs.nestjs.com
- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL**: https://www.postgresql.org/docs

---

**Last Updated**: January 18, 2026
**Backend Version**: 1.0.0
