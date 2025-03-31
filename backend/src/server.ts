
import express, { Request } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { File } from 'multer';
import { mockTickets, categories } from './data/mockData';
import { Ticket } from './types/ticket';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://0.0.0.0:4200', 'https://0.0.0.0:4200'],
  credentials: true
}));
app.use(express.json());

// Configure multer
const upload = multer({ storage: multer.memoryStorage() });

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

// File conversion endpoint
app.post('/api/convert', upload.single('file'), async (req: Request & { file?: File }, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // For now, return a simple markdown conversion
    const markdownText = req.file.buffer.toString('utf-8');
    res.json({ markdown: markdownText });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Error converting file' });
  }
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
