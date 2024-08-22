export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  billboard: Billboard;
}

export interface Product {
  sizes: string[];
  colors: string[];
  images: Images[] | string[] | any;
  id: string;
  name: string;
  categoryId: string | null;
  categoryName: string | null;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  isFeatured: boolean;
  isArchived: boolean;
  averageRating: number;
  createdAt: string | null;
}

interface Images {
  url: string;
}

export interface CartProduct {
  sizes: string | null;
  colors: string | null;
  images: Images[];
  id: string;
  name: string;
  sellingPrice: number;
  quantity: number;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface Image {
  url: string;
}

export interface Color {
  id: string;
  name: string;
  value: string;
}
