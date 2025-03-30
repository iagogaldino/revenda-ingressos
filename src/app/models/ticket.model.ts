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
  category: string;
  type: string;
  seller: Seller;
  image: string;
}