import type { Role, RentalStatus, AvailabilityStatus } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Routing / roles                                                     */
/* ------------------------------------------------------------------ */

/** Where each role lands after login / when hitting a protected route. */
export const ROLE_DASHBOARD: Record<Role, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

/** Routes only a logged-out user should see. */
export const AUTH_ROUTES = ["/login", "/register"];

/** Prefixes that require a valid session. */
export const PROTECTED_PREFIXES = ["/dashboard", "/payment"];

export const isValidRole = (role: unknown): role is Role =>
  role === "TENANT" || role === "LANDLORD" || role === "ADMIN";

/** Top-level nav shown to everyone. */
export const PUBLIC_NAV = [
  { label: "Browse", href: "/properties" },
] as const;

/** Per-role dashboard nav (sidebar + mobile sheet). */
export const DASHBOARD_NAV: Record<
  Role,
  { label: string; href: string }[]
> = {
  TENANT: [
    { label: "Overview", href: "/dashboard/tenant" },
    { label: "My Requests", href: "/dashboard/tenant/requests" },
    { label: "Payments", href: "/dashboard/tenant/payments" },
  ],
  LANDLORD: [
    { label: "Overview", href: "/dashboard/landlord" },
    { label: "Properties", href: "/dashboard/landlord/properties" },
    { label: "Requests", href: "/dashboard/landlord/requests" },
    { label: "Reviews", href: "/dashboard/landlord/reviews" },
  ],
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Properties", href: "/dashboard/admin/properties" },
    { label: "Rentals", href: "/dashboard/admin/rentals" },
    { label: "Categories", href: "/dashboard/admin/categories" },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  TENANT: "Tenant",
  LANDLORD: "Landlord",
  ADMIN: "Admin",
};

/* ------------------------------------------------------------------ */
/* Rental request status → badge styling + affordances                 */
/* ------------------------------------------------------------------ */

export const RENTAL_STATUS: Record<
  RentalStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  },
  APPROVED: {
    label: "Approved",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive",
  },
  ACTIVE: {
    label: "Active",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-muted text-muted-foreground",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground",
  },
};

export const AVAILABILITY_STATUS: Record<
  AvailabilityStatus,
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: "Available",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  PENDING_PAYMENT: {
    label: "Pending payment",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  },
  UNAVAILABLE: {
    label: "Unavailable",
    className: "bg-muted text-muted-foreground",
  },
  RENTED: {
    label: "Rented",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400",
  },
};

/* ------------------------------------------------------------------ */
/* Property form option lists                                          */
/* ------------------------------------------------------------------ */

export const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
] as const;

export const AMENITIES = [
  "WiFi",
  "Air Conditioning",
  "Parking",
  "Furnished",
  "Balcony",
  "Elevator",
  "Security",
  "Generator",
  "Gas Line",
  "Rooftop Access",
  "Pet Friendly",
  "Gym",
] as const;

export const PAGE_SIZE = 9;
