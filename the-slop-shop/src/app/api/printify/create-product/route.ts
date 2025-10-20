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

    console.log('📦 Creating Printify product with config:', {
      blueprintId,
      printProviderId,
      variants,
      printAreas,
    });

    // Upload image to Printify first
    console.log('📤 Uploading image to Printify...');
    const uploadedImage = await uploadImageToPrintify(imageUrl, fileName);
    console.log('✅ Image uploaded, ID:', uploadedImage.id);

    // Create product with the uploaded image
    const productData = {
      title,
      description,
      blueprint_id: blueprintId,
      print_provider_id: printProviderId,
      variants,
      print_areas: printAreas.map((area: { variant_ids: number[]; placeholders: { position: string; x: number; y: number; scale: number }[] }) => ({
        ...area,
        placeholders: area.placeholders.map((placeholder) => ({
          position: placeholder.position,
          images: [
            {
              id: uploadedImage.id,
              x: placeholder.x,
              y: placeholder.y,
              scale: placeholder.scale,
              angle: 0,
            },
          ],
        })),
      })),
    };

    console.log('🚀 Creating product with data:', JSON.stringify(productData, null, 2));
    const product = await createProduct(productData);
    console.log('✅ Product created, ID:', product.id);

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
