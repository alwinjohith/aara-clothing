# AGENTS.md

# Aara Clothing - Internal Business Management System

## Overview

This project is an internal business management system built exclusively for **Aara Clothing**.

It is used only by the store owners and administrators to manage daily operations.

This is **not** an e-commerce platform.

There are **no customer-facing features**.

The objective is to build a stable, fast, and maintainable application that replaces manual order and inventory tracking.

---

# Core Principle

Implement **only** what has been explicitly requested.

Never guess business requirements.

If a requirement is unclear, stop and ask for clarification before writing any code.

Simplicity is always preferred over unnecessary complexity.

Stability is always more important than adding new features.

---

# Version 1 Scope

Version 1 consists of only four modules.

- Dashboard
- Products
- Customers
- Settings

Do not create additional modules unless explicitly requested.

---

# Dashboard

The dashboard exists only to provide a quick overview of the business.

Only display information that has been requested.

Do not invent analytics, charts, KPIs, or statistics.

Keep the dashboard lightweight and fast.

---

# Products

The Products module represents the store's inventory.

Each product should contain only the information necessary to manage inventory.

Products may include:

- Name
- Description
- Category
- Images
- Stock
- Active Status

Do not add product attributes unless requested.

---

# Categories

Categories exist only to organize products.

Categories must not have their own page.

Categories must not appear in the sidebar.

Categories are managed only when creating or editing a product.

---

# Inventory

Inventory belongs to products.

Employees should be able to:

- View stock
- Increase stock
- Decrease stock
- Update stock manually

Do not implement:

- Inventory history
- Adjustment reasons
- Automatic stock forecasting

Unless explicitly requested.

---

# Customers

Customers are the primary business entity.

Every customer may have multiple orders.

Customer management and order management are combined into a single workflow.

There must **not** be a standalone Orders page.

Customer pages should allow users to:

- View customer information
- View all previous orders
- Create new orders
- Edit existing orders
- Update order status

Orders are always accessed through a customer.

---

# Orders

Orders are child records of a customer.

Relationship:

Customer

├── Order

├── Order

└── Order

Business Rules:

- Every order belongs to exactly one customer.
- A customer may have multiple orders.
- An order cannot exist without a customer.
- Creating an order always begins from a customer.
- Viewing an order always happens from a customer.
- Editing an order always happens from a customer.

Do not implement a standalone Orders module.

---

# Order Status

Supported statuses:

- Pending
- Processing
- Delivered
- Cancelled

Allowed workflow:

Pending

↓

Processing

↓

Delivered

or

Pending

↓

Cancelled

or

Processing

↓

Cancelled

Do not invent additional statuses.

---

# Authentication

Authentication consists only of:

- Username
- Password

Do not implement:

- Email authentication
- Password reset
- Social login
- MFA

Unless explicitly requested.

---

# Search

Only implement search where requested.

Current search requirements:

Products

- Name

Customers

- Name
- Phone Number

Orders

- Order ID
- Customer Name

Do not add advanced filtering unless requested.

---

# Images

Products may contain images.

The implementation of image storage should remain abstract.

Do not tightly couple image uploads to any specific provider.

---

# Performance

Performance is a priority.

The application should feel responsive.

Avoid:

- Unnecessary API requests
- Duplicate queries
- Polling
- Frequent refetching
- Unnecessary re-renders

Prefer caching whenever appropriate.

Only refresh data when necessary.

---

# Database Principles

Keep the schema simple.

Normalize relationships.

Avoid duplicate data.

Only introduce new tables when there is a clear business requirement.

Current entities should remain minimal.

---

# Architecture

Follow the existing project structure.

Do not reorganize folders unless requested.

Separate:

- UI
- Business Logic
- Validation
- Database Access

Avoid unnecessary abstractions.

Avoid premature optimization.

---

# UI Guidelines

This application is an internal business tool.

The interface should be:

- Clean
- Fast
- Professional
- Consistent
- Easy to use

Do not redesign the interface unless explicitly requested.

Avoid unnecessary animations or visual effects.

---

# Coding Standards

- Use TypeScript.
- Keep components small and focused.
- Prefer Server Components where appropriate.
- Reuse existing components.
- Avoid duplicated logic.
- Use descriptive names.
- Keep business logic out of UI components.
- Prefer readability over clever code.

---

# Out of Scope

Do not implement:

- E-commerce functionality
- Customer accounts
- Reports
- Analytics
- Notifications
- Supplier management
- Purchase orders
- Inventory history
- Returns
- Audit logs
- Role management
- Barcode scanning
- Multi-store support
- Discounts
- Coupons
- Payment processing
- Shipping integrations
- Any feature that has not been explicitly requested

---

# Agent Rules

Always follow these rules.

- Never guess business requirements.
- Never invent new features.
- Never add pages that were not requested.
- Never create database tables without approval.
- Never redesign workflows.
- Never introduce unnecessary dependencies.
- Never over-engineer solutions.
- Ask questions whenever requirements are ambiguous.
- Prefer removing complexity over adding functionality.
- Keep commits focused.
- Write production-ready code.
- Maintain consistency throughout the project.

If something is not explicitly mentioned in this document or by the user, assume it should **not** be implemented.

---

# Development Philosophy

Version 1 is focused on solving today's operational needs.

The objective is to build a dependable internal system—not a feature-rich platform.

Every decision should prioritize:

- Simplicity
- Stability
- Maintainability
- Performance
- Clear user workflows

If a feature does not directly support the day-to-day operation of Aara Clothing, do not implement it.

When in doubt, ask before writing code.