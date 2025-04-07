
import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { TicketController } from '../controllers/ticket.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const ticketController = new TicketController();

const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido. Apenas JPG, PNG e PDF são permitidos.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
}).fields([{ name: 'image' }, { name: 'file' }]);

const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadMiddleware(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.post('/seller/tickets', authenticateToken, handleUpload, (req: Request, res: Response, next: NextFunction) => 
  ticketController.create(req, res, next)
);

router.put('/seller/tickets/:id', authenticateToken, handleUpload, (req: Request, res: Response, next: NextFunction) => 
  ticketController.update(req, res, next)
);

router.delete('/tickets/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => 
  ticketController.deleteTicket(req, res, next)
);

router.get('/tickets', (req: Request, res: Response, next: NextFunction) => 
  ticketController.getAllTickets(req, res, next)
);

router.get('/tickets/:id', (req: Request, res: Response, next: NextFunction) => 
  ticketController.getTicketById(req, res, next)
);

router.get('/tickets/download/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => 
  ticketController.downloadTicket(req, res, next)
);

router.get('/seller/tickets', authenticateToken, (req: Request, res: Response, next: NextFunction) => 
  ticketController.getTicketsBySeller(req, res, next)
);

router.get('/tickets/seller/:sellerId', (req: Request, res: Response, next: NextFunction) => 
  ticketController.getTicketsBySellerId(req, res, next)
);

export const ticketRoutes = router;
