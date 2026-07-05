# AGENTS.md

# Aara Clothing - Internal Inventory & Order Management System

## Project Overview

This project is an internal Inventory & Order Management System built specifically for **Aara Clothing**.

This is **NOT** an e-commerce platform.

There is **no customer-facing interface**.

The application is only used by store employees to manage inventory and customer orders.

The primary goal is to replace spreadsheets/manual tracking with a simple, fast and maintainable web application.

---

# Business Information

Store Name:
- Aara Clothing

Business Type:
- Clothing Store

Usage:
- Internal staff only

Average Orders:
- 10–20 orders/day

Current Product Count:
- Approximately 40 products

Expected Growth:
- Small. Large-scale growth is not currently expected.

Hosting:
- Online

---

# Project Goals

The system should make it easy to:

- Manage products
- Manage inventory
- Manage customers
- Create orders manually
- Edit orders
- Track order status
- Search products and customers quickly

The application should prioritize simplicity and reliability over unnecessary features.

---

# Out of Scope

The following are intentionally NOT included in the initial version.

- Customer accounts
- Online shopping
- Online payments
- Supplier management
- Purchase orders
- Reports
- Analytics
- Notifications
- Audit logs
- Returns
- Automatic inventory restoration
- Offline support

These may be added later.

---

# Users

All employees currently have the same permissions.

There are **no roles** in Version 1.

Every authenticated employee can:

- Manage products
- Manage inventory
- Create customers
- Edit customers
- Create orders
- Edit orders
- Update order status

The authentication system should still be designed so roles can be introduced later without major refactoring.

---

# Authentication

Login Method

- Username
- Password

No email login.

No password reset flow for now.

---

# Products

The exact product fields will evolve during development.

Initially include only the essential information.

Suggested fields:

- Name
- Description
- Category
- Active Status

Additional fields may be added during development.

Do not over-engineer the schema.

---

# Product Variants

Inventory is tracked per variant.

Current variants:

- Color
- Size

Each variant has:

- Stock
- Images

Variants DO NOT have different prices.

Variants DO have:

- Different stock
- Different images

Future variant types should be easy to add.

---

# Categories

Nested categories are supported.

Example

Men
    Shirts
        Oversized

Do not assume only one level.

---

# Images

Products support multiple images.

Variants also support separate images.

Storage implementation can be decided later.

The codebase should abstract image storage behind a service.

---

# Inventory

Inventory is tracked per variant.

Employees can:

- Increase stock
- Decrease stock
- Edit stock manually

Inventory history is **not required** in Version 1.

Reasons for inventory adjustments are **not required**.

Future inventory history should be easy to introduce.

---

# Customers

Customers should contain:

- Name
- Phone Number
- Address
- Purchase History

The application should allow viewing all previous orders placed by a customer.

Additional customer information can be introduced later.

---

# Orders

Employees manually create orders.

Typical workflow:

Customer

↓

Select products

↓

Select variants

↓

Choose quantity

↓

Save

Orders can be edited after creation.

Editing should update inventory correctly.

---

# Order Status

Supported statuses:

Pending

↓

Processing

↓

Delivered

OR

Cancelled

Statuses must follow the workflow.

Skipping statuses is not allowed.

If an invalid transition occurs, the system should revert to **Pending**.

---

# Dashboard

Dashboard should display:

- Today's Orders
- Pending Orders
- Current Inventory
- Low Stock Products
- Out of Stock Products

Keep the dashboard lightweight.

---

# Search

Search should support:

Products

- Name

Customers

- Name
- Phone Number

Orders

- Order ID

Inventory

- SKU (if implemented later)

The search implementation should be reusable across modules.

---

# Reports

Version 1 includes **no reporting module**.

The architecture should make adding reports later straightforward.

---

# Notifications

No notification system.

---

# Audit Logs

No audit logging.

Future support should be possible without restructuring the project.

---

# Database Design Principles

Normalize relational data.

Avoid duplicate information.

Relationships should be explicit.

Expected entities include:

- Users
- Categories
- Products
- ProductVariants
- Customers
- Orders
- OrderItems

Additional entities should only be introduced when there is a clear business need.

---

# Architecture

Prefer a feature-based architecture.

Example:

src/

    app/

    features/

        auth/

        dashboard/

        products/

        categories/

        inventory/

        customers/

        orders/

    components/

    lib/

    services/

    hooks/

    types/

    utils/

    prisma/

Each feature should encapsulate:

- UI
- API calls
- Validation
- Business logic
- Components

Avoid placing unrelated code together.

---

# Development Philosophy

The application should prioritize:

- Simplicity
- Maintainability
- Readability
- Consistency

Avoid premature optimization.

Avoid building features that have not been requested.

When requirements are unclear, prefer asking rather than assuming.

---

# Coding Standards

- Use TypeScript.
- Favor server components where appropriate.
- Keep components focused and small.
- Avoid duplicated logic.
- Prefer composition over inheritance.
- Keep functions pure when possible.
- Use descriptive naming.
- Write reusable utilities.
- Separate business logic from UI.

---

# Agent Guidelines

When working on this project:

- Never invent business rules.
- Never implement features that haven't been requested.
- Ask for clarification instead of making assumptions.
- Keep commits focused.
- Avoid unnecessary dependencies.
- Minimize complexity.
- Write production-ready code.
- Keep the UI clean and responsive.
- Maintain consistent naming and folder structure.

If a requirement is marked as "to be decided later," leave extension points rather than hardcoding assumptions.

---

# Future Features (Not Yet Implemented)

Potential future additions include:

- Role-based access control
- Inventory history
- Supplier management
- Purchase orders
- Reports and analytics
- Notifications
- Barcode scanning
- Returns and exchanges
- Receipt printing
- Audit logs
- Multi-store support
- Advanced search filters

These features should not influence the Version 1 implementation beyond keeping the architecture extensible.

---

# Core Principle

Build a clean, dependable internal system for Aara Clothing that solves today's operational needs without adding unnecessary complexity. Whenever requirements are ambiguous or incomplete, stop and ask for clarification instead of making assumptions.