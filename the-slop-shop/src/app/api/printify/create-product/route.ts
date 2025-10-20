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
      tags = [],
      variants,
      printAreas,
      publishToShopify = true,
    } = await request.json();

    console.log('📦 Creating Printify product with config:', {
      blueprintId,
      printProviderId,
      title,
      description,
      tags,
      variants,
      printAreas,
      imageUrl: imageUrl?.substring(0, 100) + '...',
      fileName,
    });

    // Upload image to Printify first
    console.log('📤 Uploading image to Printify...');
    let uploadedImage;
    try {
      uploadedImage = await uploadImageToPrintify(imageUrl, fileName);
      console.log('✅ Image uploaded, ID:', uploadedImage.id);
    } catch (uploadError) {
      console.error('❌ Image upload failed:', uploadError);
      throw uploadError;
    }

    // Create product with the uploaded image
    const productData = {
      title,
      description,
      tags,
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
    console.error('❌ Error creating product:', error);

    // Log the full error details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create product',
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}
