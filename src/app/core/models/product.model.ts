export interface BaseProduct {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: ProductCategory;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Book extends BaseProduct {
  author: string;
  isbn: string;
  publisher: string;
  pages: number;
  language: string;
  publicationDate: Date;
}

export interface Movie extends BaseProduct {
  director: string;
  duration: number; // en minutos
  rating: string; // PG, PG-13, R, etc.
  releaseYear: number;
  studio: string;
  format: MovieFormat;
}

export interface Vinyl extends BaseProduct {
  artist: string;
  label: string;
  releaseYear: number;
  genre: string;
  tracks: number;
  discCount: number;
}

export interface CompactDisc extends BaseProduct {
  artist: string;
  label: string;
  releaseYear: number;
  genre: string;
  tracks: number;
}

export enum ProductCategory {
  BOOK = 'book',
  MOVIE = 'movie',
  VINYL = 'vinyl',
  COMPACT_DISC = 'compact-disc'
}

export enum MovieFormat {
  DVD = 'dvd',
  BLU_RAY = 'blu-ray',
  UHD_BLU_RAY = 'uhd-blu-ray'
}

export interface InventoryHistory {
  id: string;
  productId: string;
  quantity: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  reason?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones (opcionales)
  category?: Category;
  specifications?: Record<string, string>;
  features?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  productCount?: number;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
  parent?: Category;
  children?: Category[];
}
