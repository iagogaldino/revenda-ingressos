
import { Ticket } from '../types/ticket';

export const mockTickets: Ticket[] = [
  {
    id: 1,
    eventName: 'Rock in Rio 2025',
    eventDate: '2025-09-21',
    location: 'Rio de Janeiro, RJ',
    venue: 'Parque Olímpico',
    price: 400,
    originalPrice: 500,
    description: 'O maior festival de música do mundo com shows de diversas bandas famosas.',
    category: 'Música',
    type: 'Show',
    seller: { name: 'João Silva', rating: 4.5 },
    image: 'https://d6jd9079fzsvx.cloudfront.net/banners/banner_site_geraldo_67d0ab14cb295.jpg'
  },
  {
    id: 2,
    eventName: 'Comic Con Experience',
    eventDate: '2025-12-05',
    location: 'São Paulo, SP',
    venue: 'São Paulo Expo',
    price: 250,
    originalPrice: 300,
    description: 'O maior evento geek do Brasil, com painéis, exposições e lojas exclusivas.',
    category: 'Entretenimento',
    type: 'Feira',
    seller: { name: 'Maria Oliveira', rating: 4.8 },
    image: 'https://d6jd9079fzsvx.cloudfront.net/banners/banner_site_geraldo_67d0ab14cb295.jpg'
  },
  {
    id: 3,
    eventName: 'Final do Campeonato Brasileiro',
    eventDate: '2025-11-25',
    location: 'Rio de Janeiro, RJ',
    venue: 'Maracanã',
    price: 350,
    originalPrice: 400,
    description: 'Grande final do campeonato com os melhores times do Brasil.',
    category: 'Esportes',
    type: 'Futebol',
    seller: { name: 'Carlos Souza', rating: 4.0 },
    image: 'https://d6jd9079fzsvx.cloudfront.net/banners/banner_site_geraldo_67d0ab14cb295.jpg'
  },
  {
    id: 4,
    eventName: 'Stand-up Comedy Night',
    eventDate: '2025-04-15',
    location: 'São Paulo, SP',
    venue: 'Teatro Municipal',
    price: 100,
    originalPrice: 150,
    description: 'Show de stand-up com os melhores comediantes da atualidade.',
    category: 'Comédia',
    type: 'Teatro',
    seller: { name: 'Ana Martins', rating: 3.9 },
    image: 'https://d6jd9079fzsvx.cloudfront.net/banners/banner_site_geraldo_67d0ab14cb295.jpg'
  },
  {
    id: 5,
    eventName: 'Festival de Gastronomia',
    eventDate: '2025-08-10',
    location: 'Belo Horizonte, MG',
    venue: 'Praça da Liberdade',
    price: 120,
    originalPrice: 180,
    description: 'Festival com pratos típicos de várias regiões do Brasil.',
    category: 'Gastronomia',
    type: 'Festival',
    seller: { name: 'Pedro Lima', rating: 4.7 },
    image: 'https://d6jd9079fzsvx.cloudfront.net/banners/banner_site_geraldo_67d0ab14cb295.jpg'
  }
];



export const categories: string[] = ["Shows", "Esportes", "Teatro", "Festivais", "Cinema"];
