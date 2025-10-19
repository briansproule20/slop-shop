/**
 * API route to upload an image to Printify
 */

import { uploadImageToPrintify } from '@/lib/printify-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, fileName } = await request.json();

    if (!imageUrl || !fileName) {
      return NextResponse.json(
        { error: 'imageUrl and fileName are required' },
        { status: 400 }
      );
    }

    const uploadedImage = await uploadImageToPrintify(imageUrl, fileName);
    return NextResponse.json(uploadedImage);
  } catch (error) {
    console.error('Error uploading image to Printify:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
}
