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
  originalPrice: number;
  description: string;
  category: Category;
  type: string;
  seller: Seller;
  image: string;
  active: boolean
  quantity: number
  sold: boolean
  paymentStatus: any
  status  : any
}