import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth/auth-routes.js'
import adminProductsRouter from './routes/admin/products-routes.js'
import shopProductRouter from './routes/shop/product-routes.js'
import shopCartRouter from './routes/shop/cart-routes.js'
import shopAddressRouter from './routes/shop/address-routes.js'
import shopOrdersRouter from './routes/shop/Order-routes.js'
import * as dotenv from 'dotenv'
dotenv.config();

const app = express();
const port = 10000|| 10000;

const allowedOrigins = [
  'https://vercel.com/creative-coder-zzzzs-projects/the-urban-wave/C8hoG7yxxSAn4hLh1WF4vvv93HXj',
  'https://the-urban-wave.vercel.app',
  'http://localhost:5174'// your current front-end URL
];

// Enable CORS with the allowed origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy error'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization', 'cache-control'],

    credentials: true, // if you need to send cookies or authentication headers
  })
);
// coop cors origin opener policy 
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); // Optional for stricter settings
  next();
});



app.use(cookieParser());
app.use(express.json());  // Call express.json as a function
app.use('/api/auth', authRouter)
app.use('/api/admin/products', adminProductsRouter)
app.use('/api/shop/products', shopProductRouter)
app.use('/api/shop/cart', shopCartRouter)
app.use('/api/shop/address', shopAddressRouter)
app.use('/api/shop/orders', shopOrdersRouter)
mongoose.connect('mongodb+srv://sandesh:sandyshades2003@cluster0.ptb0h.mongodb.net/')
  .then(() => console.log('MongoDB connection successful'))
  .catch((error) => console.log('MongoDB connection error:', error));

app.listen(port, () => {
  console.log(`The app is listening on port ${port}`);
});
