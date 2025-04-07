"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categories = exports.mockTickets = void 0;
exports.mockTickets = [
    {
        id: 1,
        sellerId: 101,
        status: 'active',
        createdAt: '2025-03-31T10:00:00Z',
        updatedAt: '2025-03-31T10:00:00Z',
        eventName: 'Show do Gusttavo Lima',
        eventDate: '2025-06-21T20:00:00Z',
        location: 'Petrolina, PE',
        venue: 'Pátio Ana das Carrancas',
        price: 250,
        originalPrice: 300,
        description: 'Show ao vivo do Gusttavo Lima durante o São João de Petrolina.',
        category: 'Música',
        type: 'Show',
        seller: { name: 'João Silva', rating: 4.7 },
        image: 'https://d6jd9079fzsvx.cloudfront.net/banners/banner_site_geraldo_67d0ab14cb295.jpg',
        active: true,
        quantity: 500
    },
    {
        id: 2,
        sellerId: 102,
        status: 'pending',
        createdAt: '2025-03-29T15:30:00Z',
        updatedAt: '2025-03-30T08:00:00Z',
        eventName: 'Final do Campeonato Brasileiro',
        eventDate: '2025-11-25T18:00:00Z',
        location: 'Rio de Janeiro, RJ',
        venue: 'Maracanã',
        price: 400,
        originalPrice: 450,
        description: 'Partida final do Campeonato Brasileiro, o maior evento de futebol do Brasil.',
        category: 'Esportes',
        type: 'Futebol',
        seller: { name: 'Carlos Souza', rating: 4.2 },
        image: 'https://d6jd9079fzsvx.cloudfront.net/banners/banner_site_geraldo_67d0ab14cb295.jpg',
        active: false,
        quantity: 200
    },
    {
        id: 3,
        sellerId: 103,
        status: 'active',
        createdAt: '2025-03-25T12:00:00Z',
        updatedAt: '2025-03-28T09:30:00Z',
        eventName: 'Comic Con Experience',
        eventDate: '2025-12-05T10:00:00Z',
        location: 'São Paulo, SP',
        venue: 'São Paulo Expo',
        price: 180,
        originalPrice: 220,
        description: 'O maior evento geek do Brasil, com painéis, exposições e lojas exclusivas.',
        category: 'Entretenimento',
        type: 'Feira',
        seller: { name: 'Maria Oliveira', rating: 4.9 },
        image: 'https://d6jd9079fzsvx.cloudfront.net/banners/banner_site_geraldo_67d0ab14cb295.jpg',
        active: true,
        quantity: 300
    }
];
exports.categories = ["Shows", "Esportes", "Teatro", "Festivais", "Cinema"];
