
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

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
