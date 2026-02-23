export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TrackingEvent {
  eventName: string;
  eventId: string;
  data?: Record<string, unknown>;
  userData?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

export interface CAPIPayload {
  eventName: string;
  eventId: string;
  eventTime: number;
  sourceUrl: string;
  userData?: TrackingEvent["userData"];
  customData?: Record<string, unknown>;
  userAgent?: string;
  clientIpAddress?: string;
}
