
import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { mockTickets, categories } from '../data/mockData';

const router = Router();
const ticketController = new TicketController();

// Ticket routes
router.post('/seller/tickets', ticketController.create);

router.get('/tickets', (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  let filteredTickets = [...mockTickets];

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

router.get('/categories', (req, res) => {
  res.json(categories);
});

router.get('/seller/tickets', (req, res) => {
  const sellerTickets = mockTickets.map(ticket => ({
    ...ticket,
    active: Math.random() > 0.5,
    quantity: Math.floor(Math.random() * 10) + 1
  }));
  res.json(sellerTickets);
});

export const ticketRoutes = router;
