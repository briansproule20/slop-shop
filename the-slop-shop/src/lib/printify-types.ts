/**
 * Printify API types and interfaces
 */

export interface PrintifyBlueprint {
  id: number;
  title: string;
  description: string;
  brand: string;
  model: string;
  images: string[];
}

export interface PrintifyPrintProvider {
  id: number;
  title: string;
  location: {
    address1: string;
    city: string;
    country: string;
  };
}

export interface PrintifyVariant {
  id: number;
  title: string;
  options: {
    color?: string;
    size?: string;
  };
  placeholders: {
    position: string;
    height: number;
    width: number;
  }[];
}

export interface PrintifyImage {
  id: string;
  file_name: string;
  height: number;
  width: number;
  size: number;
  mime_type: string;
  preview_url: string;
  upload_time: string;
}

export interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  tags: string[];
  blueprint_id: number;
  print_provider_id: number;
  variants: {
    id: number;
    price: number;
    is_enabled: boolean;
  }[];
  print_areas: {
    variant_ids: number[];
    placeholders: {
      position: string;
      images: {
        id: string;
        x: number;
        y: number;
        scale: number;
        angle: number;
      }[];
    }[];
  }[];
  images: {
    src: string;
    variant_ids: number[];
    position: string;
    is_default: boolean;
  }[];
}

export interface CreateProductRequest {
  title: string;
  description: string;
  blueprint_id: number;
  print_provider_id: number;
  variants: {
    id: number;
    price: number;
    is_enabled: boolean;
  }[];
  print_areas: {
    variant_ids: number[];
    placeholders: {
      position: string;
      images: {
        id: string;
        x: number;
        y: number;
        scale: number;
        angle: number;
      }[];
    }[];
  }[];
}

export interface ProductPreview {
  imageId: string;
  blueprintId: number;
  printProviderId: number;
  productTitle: string;
  productDescription: string;
  mockupUrl?: string;
}
