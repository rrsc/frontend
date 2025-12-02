import { Product, ProductCategory } from "./product.model";

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number; // Precio al momento de agregar al carrito
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones (populadas desde el backend)
  product?: Product;
}

export interface CheckoutRequest {
  shippingAddress?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer'
}
