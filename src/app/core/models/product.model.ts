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
