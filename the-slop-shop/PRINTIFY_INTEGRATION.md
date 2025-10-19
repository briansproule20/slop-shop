# Printify Integration Guide

This document explains how the Printify integration works in The Slop Shop.

## Overview

The Slop Shop now allows users to:
1. Generate AI images using GPT Image or Imagen (Nano Banana)
2. Select a product type (t-shirt, hoodie, mug, etc.)
3. Preview the design on the selected product
4. Publish the product directly to your Shopify store via Printify

## Setup

### 1. Printify Account

1. Create a Printify account at https://printify.com
2. Connect your Shopify store to Printify
3. Get your API token from https://printify.com/app/account/api

### 2. Environment Variables

Add these to your `.env.local` file:

```bash
PRINTIFY_API_TOKEN=your_token_here
PRINTIFY_SHOP_ID=your_shop_id_here
```

Find your shop ID in the Printify dashboard URL: `https://printify.com/app/stores/{shop_id}`

## Workflow

### User Flow

1. **Generate Image**: User creates an AI image using the prompt input
2. **Click Publish**: User clicks the shopping bag icon on any generated image
3. **Select Product**: A dialog opens showing available product types
4. **Preview & Customize**: User is taken to a preview page where they can:
   - See their design on the product
   - Edit the product title and description
   - Review product details
5. **Publish**: Click "Publish to Store" to create the product in Printify and sync to Shopify

### Technical Flow

```
User clicks publish
    ↓
ProductSelectorDialog opens
    ↓
Fetches available blueprints from Printify
    ↓
User selects product type
    ↓
Navigate to /preview page
    ↓
User edits title/description
    ↓
Click "Publish to Store"
    ↓
1. Upload image to Printify
2. Create product with uploaded image
3. Publish product to Shopify
    ↓
Success! Product is live on store
```

## Architecture

### API Routes

- **`/api/printify/blueprints`**: Fetches available product catalog
- **`/api/printify/upload-image`**: Uploads image to Printify
- **`/api/printify/create-product`**: Creates product and publishes to Shopify

### Components

- **`ProductSelectorDialog`**: Modal showing product type selection
- **`/preview` page**: Product preview and customization page
- **`ImageHistory`**: Added publish button (shopping bag icon)

### Libraries

- **`/lib/printify-client.ts`**: Printify API client functions
- **`/lib/printify-types.ts`**: TypeScript types for Printify entities

## Product Types

The integration includes these popular products:

- T-shirts
- Hoodies
- Mugs
- Posters
- Canvas prints
- Tank tops
- Phone cases
- Tote bags

## Customization

### Adding More Products

Edit `POPULAR_BLUEPRINT_IDS` in `product-selector-dialog.tsx`:

```typescript
const POPULAR_BLUEPRINT_IDS = [
  3,   // T-shirts
  6,   // Hoodies
  // Add more blueprint IDs here
];
```

Find blueprint IDs in the Printify API docs or by calling the blueprints endpoint.

### Adjusting Pricing

Modify the price in `/api/printify/create-product/route.ts`:

```typescript
variants: [
  {
    id: 1,
    price: 2999, // Price in cents ($29.99)
    is_enabled: true,
  },
],
```

### Print Area Configuration

The current implementation places designs on the front of products. To customize placement, edit the `printAreas` configuration in `/api/printify/create-product/route.ts`.

## Notes

- Images are uploaded to Printify as data URLs
- Products are automatically published to Shopify after creation
- The integration uses Printify's default print provider (ID: 1)
- For production, you should add proper error handling and loading states
- Consider adding variant selection (sizes, colors) before publishing

## Resources

- [Printify API Documentation](https://developers.printify.com/)
- [Printify Blueprint Catalog](https://developers.printify.com/#blueprints)
- [Shopify Integration Guide](https://printify.com/app/stores)
