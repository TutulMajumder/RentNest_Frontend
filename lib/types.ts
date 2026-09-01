/* ------------------------------------------------------------------ */
/* Enums (mirror backend Prisma enums)                                 */
/* ------------------------------------------------------------------ */

export type Role = "TENANT" | "LANDLORD" | "ADMIN";

export type ActiveStatus = "ACTIVE" | "BLOCKED";

export type AvailabilityStatus =
  | "AVAILABLE"
  | "PENDING_PAYMENT"
  | "UNAVAILABLE"
  | "RENTED";

export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

/* ------------------------------------------------------------------ */
/* API envelope                                                        */
/* ------------------------------------------------------------------ */

export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage?: number;
  totalPages?: number;
  count?: number;
};

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type Paginated<T> = {
  data: T[];
  meta: ApiMeta;
};

export type FieldError = { field: string; message: string };

/** Return value of a form server action consumed via `useActionState`. */
export type ActionResult<T = unknown> =
  | { success: true; message: string; data?: T }
  | { success: false; message: string; errorDetails?: FieldError[] };

/* ------------------------------------------------------------------ */
/* Domain models (Decimal fields arrive as strings over JSON)          */
/* ------------------------------------------------------------------ */

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  status: ActiveStatus;
  createdAt: string;
  updatedAt: string;
};

export type PublicUser = Omit<CurrentUser, "status"> & { status?: ActiveStatus };

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number | null;
  address: string;
  city: string;
  division: string;
  country: string;
  amenities: string[];
  images: string[];
  availabilityStatus: AvailabilityStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  landlordId: string;
  categoryId: string;
  category?: Category;
  landlord?: PublicUser;
  reviews?: Review[];
  _count?: { rentalRequests: number; reviews: number };
};

export type RentalRequest = {
  id: string;
  status: RentalStatus;
  moveInDate: string;
  moveOutDate: string | null;
  message: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  propertyId: string;
  property?: Property;
  tenant?: PublicUser;
  payment?: Payment | null;
  review?: Review | null;
};

export type Payment = {
  id: string;
  rentalRequestId: string;
  amount: string;
  status: PaymentStatus;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  rentalRequest?: RentalRequest;
};

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  propertyId: string;
  rentalRequestId: string;
  tenant?: PublicUser;
  property?: Property;
};

/* ------------------------------------------------------------------ */
/* Auth / session                                                      */
/* ------------------------------------------------------------------ */

/** Shape returned by `getMe()` / `GET /api/auth/me`. */
export type MeResponse =
  | { success: true; message: string; data: CurrentUser }
  | { success: false; message: string; data?: undefined };

export type NavbarProps = {
  user: MeResponse;
};
