/**
 * API route to create and publish a product to Printify/Shopify
 */

import { createProduct, publishProductToShopify, uploadImageToPrintify } from '@/lib/printify-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {
      imageUrl,
      fileName,
      blueprintId,
      printProviderId,
      title,
      description,
      variants,
      printAreas,
      publishToShopify = true,
    } = await request.json();

    // Upload image to Printify first
    const uploadedImage = await uploadImageToPrintify(imageUrl, fileName);

    // Create product with the uploaded image
    const productData = {
      title,
      description,
      blueprint_id: blueprintId,
      print_provider_id: printProviderId,
      variants,
      print_areas: printAreas.map((area: { variant_ids: number[]; placeholders: { position: string }[] }) => ({
        ...area,
        placeholders: area.placeholders.map((placeholder: { position: string }) => ({
          ...placeholder,
          images: [
            {
              id: uploadedImage.id,
              x: 0.5,
              y: 0.5,
              scale: 1,
              angle: 0,
            },
          ],
        })),
      })),
    };

    const product = await createProduct(productData);

    // Publish to Shopify if requested
    if (publishToShopify) {
      await publishProductToShopify(product.id);
    }

    return NextResponse.json({
      success: true,
      product,
      published: publishToShopify,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}
