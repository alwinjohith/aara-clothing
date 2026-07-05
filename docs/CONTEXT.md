# Project Context: Clothing Store Inventory & Order Management System

## Overview

This project is a web-based Inventory and Order Management System for a single clothing store.

It is NOT an e-commerce website.
There is NO customer-facing interface.
The application will only be used internally by store employees.

The goal is to allow employees to manage products, inventory, customers, and orders efficiently.

---

# Business Requirements

The system should allow staff to:

- Login securely.
- Manage clothing products.
- Manage product variants (size, color, etc..).
- Track inventory per variant.
- Create customer orders manually.
- Update order status.
- View previous orders.
- Manage customers.
- Generate sales statistics.
- Support multiple employee roles.

No online payments.

No customer accounts.

No delivery tracking.

No notifications.

---

# Target Users

Owner
- Full access
- Manage employees
- Manage products
- Manage inventory
- Manage orders
- View reports

Manager
- Products
- Inventory
- Orders
- Customers

Staff
- Create orders
- Update order status
- View inventory

---

# Suggested Tech Stack

Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query

Backend
- Next.js API Routes
- Prisma ORM

Database
- PostgreSQL

Authentication
- Auth.js (Credentials)

Storage
- Cloudinary (product images)

Deployment
- Vercel
- Neon PostgreSQL

---

# Functional Modules

## Authentication

- Login
- Logout
- Protected routes
- Role-based authorization

---

## Dashboard

Display:

- Today's sales
- Orders today
- Low stock products
- Total products
- Total customers

---

## Product Management

Each product contains:

- Name
- Description
- Category
- Brand (optional)
- Images
- Active / Inactive

Operations

- Create
- Read
- Update
- Delete

---

## Product Variants

Each product may have multiple variants.

Example

Oversized T-Shirt

Variants

Black
- S
- M
- L

White
- S
- M
- XL

Each variant stores

- SKU
- Color
- Size
- Selling price
- Cost price (optional)
- Stock quantity

Inventory is tracked per variant.

---

## Categories

Examples

- T-Shirts
- Shirts
- Jeans
- Hoodies

CRUD operations.

---

## Inventory

Features

- Current stock
- Increase stock
- Reduce stock
- Stock history
- Low stock warning

Inventory updates automatically after orders.

---

## Customer Management

Fields

- Name
- Phone
- Notes (optional)

View

- Order history
- Total purchases

---

## Order Management

Employees manually create orders.

Order contains

Customer

Multiple items

Quantity

Price

Discount

Total

Status

Statuses

Pending

Confirmed

Packed

Completed

Cancelled

Cancelled orders should restore inventory.

---

## Reports

Sales

Daily

Weekly

Monthly

Top selling products

Low stock items

Recent orders

Revenue

---

# Suggested Database Schema

## User

id

name

email

password

role

createdAt

updatedAt

---

## Category

id

name

createdAt

---

## Product

id

name

description

categoryId

isActive

createdAt

updatedAt

---

## ProductVariant

id

productId

size

color

sku

price

stock

imageUrl

createdAt

updatedAt

---

## Customer

id

name

phone

notes

createdAt

---

## Order

id

customerId

status

subtotal

discount

total

createdBy

createdAt

updatedAt

---

## OrderItem

id

orderId

variantId

quantity

price

subtotal

---

# API Endpoints

Authentication

POST /api/auth/login

POST /api/auth/logout

---

Products

GET /api/products

POST /api/products

GET /api/products/:id

PATCH /api/products/:id

DELETE /api/products/:id

---

Variants

GET /api/variants

POST /api/variants

PATCH /api/variants/:id

DELETE /api/variants/:id

---

Categories

GET /api/categories

POST /api/categories

PATCH /api/categories/:id

DELETE /api/categories/:id

---

Customers

GET /api/customers

POST /api/customers

PATCH /api/customers/:id

---

Orders

GET /api/orders

POST /api/orders

GET /api/orders/:id

PATCH /api/orders/:id

DELETE /api/orders/:id

PATCH /api/orders/:id/status

---

Reports

GET /api/reports/dashboard

GET /api/reports/sales

GET /api/reports/inventory

---

# Folder Structure

src/

app/

components/

features/

auth/

dashboard/

products/

orders/

customers/

inventory/

reports/

prisma/

lib/

hooks/

types/

utils/

middleware/

---

# Business Rules

- Inventory is tracked per variant.
- Stock decreases when an order is created.
- Stock increases if an order is cancelled.
- Users cannot access unauthorized modules.
- Every order must contain at least one item.
- Product variants must have unique SKUs.
- Products can have multiple images.
- Deleted products should be soft deleted if possible.

---

# Non-Functional Requirements

- Responsive dashboard
- Fast search
- Pagination
- Secure authentication
- Input validation
- Error handling
- Audit logging
- Clean UI
- Mobile-friendly
- Production-ready codebase

---

# Future Enhancements

- Barcode scanner
- Invoice PDF generation
- Receipt printing
- WhatsApp order sharing
- Multi-store support
- Supplier management
- Purchase orders
- Return management
- Analytics dashboard
- Export CSV/Excel

---

# Development Roadmap

Phase 1
- Project setup
- Authentication
- Database schema

Phase 2
- Products
- Categories
- Variants

Phase 3
- Inventory

Phase 4
- Customers

Phase 5
- Orders

Phase 6
- Reports

Phase 7
- Testing
- Deployment
- Documentation

---

# Primary Goal

Build a reliable, maintainable, and scalable internal inventory and order management system for a single clothing store, focusing on ease of use, accurate inventory tracking, and efficient order processing while keeping infrastructure costs as low as possible.