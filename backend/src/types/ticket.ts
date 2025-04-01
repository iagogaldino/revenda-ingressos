export interface Seller {
  name: string;
  rating: number;
}

export interface CreateTicketDTO {
  eventName: string;
  imageUrl?: string;
  description: string;
  category: string;
  location: string;
  venue: string;
  eventDate: string;
  price: number;
  quantity: number;
}

export interface Ticket extends CreateTicketDTO {
  id: number;
  sellerId: number;
  status: 'active' | 'pending';
  createdAt: string;
  updatedAt: string;
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
  active?: boolean;
  quantity: number;
}
