import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ticketRoutes } from './routes/ticket.routes';
import usersRouters from './routes/user.routes';
import { authRoutes } from './routes/auth.routes';
import { paymentRoutes } from './routes/payment.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', ticketRoutes);
app.use('/api', usersRouters);
app.use('/api', authRoutes);
app.use('/api/payments', paymentRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});