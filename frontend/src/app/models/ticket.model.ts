import { Category } from "./category.interface";

export interface Seller {
  name: string;
  rating: number;
}

export interface Ticket {
  id: number;
  eventName: string;
  eventDate: string;
  location: string;
  venue: string;
  price: number;
  originalPrice: number | null;
  description: string;
  category: number;
  type: string;
  ticketType: string;
  seller: Seller;
  image: string;
  file: string;
  active: boolean
  quantity: number
  sold: boolean
  paymentStatus: any
  status  : any
  videoUrl?: string;
}