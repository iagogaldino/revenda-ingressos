
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mockTickets, categories } from './data/mockData';
import { Ticket } from './types/ticket';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Get tickets with filters
app.get('/api/tickets', (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  let filteredTickets: Ticket[] = [...mockTickets];

  if (category) {
    filteredTickets = filteredTickets.filter(ticket => 
      ticket.category.toLowerCase() === (category as string).toLowerCase()
    );
  }

  if (minPrice) {
    filteredTickets = filteredTickets.filter(ticket => 
      ticket.price >= Number(minPrice)
    );
  }

  if (maxPrice) {
    filteredTickets = filteredTickets.filter(ticket => 
      ticket.price <= Number(maxPrice)
    );
  }

  res.json(filteredTickets);
});

// Get categories
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Dados mockados para teste
const tickets = [
  {
    id: 1,
    eventName: "Show de Rock",
    price: 100,
    category: "Música",
    seller: { name: "João", rating: 4.5 }
  },
  {
    id: 2,
    eventName: "Teatro Musical",
    price: 150,
    category: "Teatro",
    seller: { name: "Maria", rating: 5.0 }
  }
];

const categories = ["Música", "Teatro", "Esporte", "Cinema"];

app.get('/api/tickets', (req, res) => {
  res.json(tickets);
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/tickets/:id', (req, res) => {
  const ticket = tickets.find(t => t.id === parseInt(req.params.id));
  if (ticket) {
    res.json(ticket);
  } else {
    res.status(404).json({ message: "Ticket não encontrado" });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
