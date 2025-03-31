
import { Ticket } from '../types/ticket';

export const mockTickets: Ticket[] = [
  {
    id: 1,
    name: "Rock in Rio - Dia 1",
    description: "Show principal: Guns N' Roses",
    price: 599.99,
    category: "Shows",
    date: "2024-09-29",
    location: "Rio de Janeiro",
    quantity: 5
  },
  {
    id: 2,
    name: "Final Libertadores 2024",
    description: "Final do torneio continental",
    price: 899.99,
    category: "Esportes",
    date: "2024-11-30",
    location: "São Paulo",
    quantity: 3
  },
  {
    id: 3,
    name: "Cirque du Soleil",
    description: "Espetáculo Alegría",
    price: 399.99,
    category: "Teatro",
    date: "2024-08-15",
    location: "Curitiba",
    quantity: 8
  }
];

export const categories: string[] = ["Shows", "Esportes", "Teatro", "Festivais", "Cinema"];
