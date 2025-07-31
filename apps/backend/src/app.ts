import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { productRoutes } from './features/products/product.routes';
import { chatRoutes } from './features/chat/chat.routes';
import { faqRoutes } from './features/faq/faq.routes'
import { brandRoutes } from './features/brand/brands.route';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// Veritabanı Bağlantısı
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

if (!MONGODB_CONNECTION_STRING) {
  console.error("MONGO_URI ortam değişkeni .env dosyasında tanımlı değil.");
  process.exit(1);
}

mongoose.connect(MONGODB_CONNECTION_STRING)
  .then(() => console.log("MongoDB bağlantısı başarılı. ✅"))
  .catch((err) => console.error("MongoDB bağlantı hatası: ", err));

// Ana Rota
app.get('/api', (req, res) => {
  res.send('API çalışıyor! 🚀');
});

// Rotaları Uygulamaya Ekle
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/products/:id/faq', faqRoutes);
app.use('api/brands/:id/', brandRoutes)

export default app;