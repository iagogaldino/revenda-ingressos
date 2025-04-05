import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ticketRoutes } from './routes/ticket.routes';
import usersRouters from './routes/user.routes';
import authRouter from './routes/auth.routes';
import { paymentRoutes } from './routes/payment.routes';
import authRoutes from './routes/auth.routes';
import { saleRoutes } from './routes/sale.routes';
import { categoryRoutes } from './routes/category.routes';
import { youtubeRoutes } from './routes/youtube.routes'; // Added import for YouTube routes

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
app.use('/api', authRouter);
app.use('/api', categoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api', youtubeRoutes); // Registered YouTube routes

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});