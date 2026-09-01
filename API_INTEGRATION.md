# API Integration

Every backend call goes through **`service/api-client.ts`** (`apiFetch` / `apiFetchList`),
which attaches the `accessToken` cookie as a Bearer header, unwraps the
`{ success, message, data, meta }` envelope, and throws a typed `ApiError`
(caught by the nearest `error.tsx`). Backend base URL: `process.env.BACKEND_API_URL`.

Mutations run as **Server Actions** in `app/(group)/_actions/*`. Two client
data flows (landlord requests) use same-origin **route handlers**
(`app/api/landlord/requests/*`) via `lib/backend-proxy.ts` so TanStack Query can
refetch without CORS or exposing the token.

---

## Auth & session

| Frontend | File | Endpoint |
|---|---|---|
| Login form | `app/(auth)/_actions/authActions.ts` → `LoginForm` | `POST /api/auth/login` |
| Register form (role select) | `app/(auth)/_actions/registerAction.ts` → `RegisterForm` | `POST /api/auth/register` |
| Session (navbar, layouts, guards) | `service/getMe.ts` | `GET /api/auth/me` |
| Silent token rotation | `proxy.ts` → `service/refreshToken.ts` | `POST /api/auth/refresh-token` |
| Logout | `service/logout.ts` (clears cookies) | — |
| Route protection / RBAC | `proxy.ts` (verifies access + refresh JWT, gates `/dashboard/*` by role) | — |
| Profile view + edit | `app/(dashboard)/_actions/profileActions.ts` → `ProfileForm` | `PATCH /api/auth/manage-profiles` |

## Public — properties

| Frontend route | File | Endpoint |
|---|---|---|
| `/` (Latest listings) | `service/properties.ts` `getProperties` | `GET /api/properties` |
| `/properties` (grid + filters + pagination) | `PropertiesPage` + `PropertyFilters` | `GET /api/properties`, `GET /api/categories` |
| `/properties/[id]` (gallery, details, reviews) | `service/properties.ts` `getProperty` | `GET /api/properties/:id` |
| "Request to rent" dialog | `app/(public)/properties/_actions/rentalActions.ts` | `POST /api/rentals` |

## Tenant

| Frontend route | File | Endpoint |
|---|---|---|
| `/dashboard/tenant` (stats + recent) | `getMyRentals`, `getMyPayments` | `GET /api/rentals`, `GET /api/payments` |
| `/dashboard/tenant/requests` | `service/rentals.ts` `getMyRentals` | `GET /api/rentals` |
| `/dashboard/tenant/requests/[id]/pay` | `service/rentals.ts` `getRentalRequest` | `GET /api/rentals/:id` |
| "Pay now" → Stripe Checkout | `app/(dashboard)/_actions/paymentActions.ts` | `POST /api/payments/create` (→ redirect to `checkoutUrl`) |
| `/payment/success` (verify-on-return + retry) | `app/payment/success/_actions/verifyPayment.ts` | `POST /api/payments/verify` |
| `/payment/cancel` | static | — |
| Leave review (COMPLETED rentals) | `app/(dashboard)/_actions/reviewActions.ts` | `POST /api/reviews` |
| `/dashboard/tenant/payments` | `service/payments.ts` `getMyPayments` | `GET /api/payments` |
| Payment confirmation | Stripe webhook → backend | `POST /api/payments/confirm` (server-to-server) |

## Landlord

| Frontend route | File | Endpoint |
|---|---|---|
| `/dashboard/landlord` (stats + recent) | `getLandlordProperties`, `getLandlordRequests` | `GET /api/landlord/properties`, `GET /api/landlord/requests` |
| `/dashboard/landlord/properties` | `service/landlord.ts` `getLandlordProperties` | `GET /api/landlord/properties` |
| `/dashboard/landlord/properties/new` | `propertyActions.createPropertyAction` | `POST /api/landlord/properties`, `GET /api/categories` |
| `/dashboard/landlord/properties/[id]/edit` | `propertyActions.updatePropertyAction` | `GET /api/properties/:id`, `PUT /api/landlord/properties/:id` |
| Availability toggle / delete | `propertyActions.setAvailabilityAction` / `deletePropertyAction` | `PUT` / `DELETE /api/landlord/properties/:id` |
| `/dashboard/landlord/requests` (optimistic approve/reject) | `hooks/use-landlord-requests.ts` + route handlers | `GET` / `PATCH /api/landlord/requests/:id` |
| `/dashboard/landlord/reviews` | `service/reviews.ts` `getLandlordReviews` | `GET /api/landlord/reviews` |

## Admin

| Frontend route | File | Endpoint |
|---|---|---|
| `/dashboard/admin` (platform stats) | `service/admin.ts` (all three) | `GET /api/admin/users`, `/api/admin/properties`, `/api/admin/rentals` |
| `/dashboard/admin/users` (search, filter, ban/unban) | `getAdminUsers` + `adminActions.setUserStatusAction` | `GET` / `PATCH /api/admin/users/:id` |
| `/dashboard/admin/properties` | `service/admin.ts` `getAdminProperties` | `GET /api/admin/properties` |
| `/dashboard/admin/rentals` | `service/admin.ts` `getAdminRentals` | `GET /api/admin/rentals` |
| `/dashboard/admin/categories` (CRUD) | `categoryActions.ts` + `CategoryManager` | `GET` / `POST` / `PATCH` / `DELETE /api/categories/:id` |
