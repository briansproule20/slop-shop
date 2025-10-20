/**
 * API route to generate product title and description using AI
 */

import { openai } from '@/echo';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, productType } = await request.json();

    if (!prompt || !productType) {
      return NextResponse.json(
        { error: 'prompt and productType are required' },
        { status: 400 }
      );
    }

    // Use Echo SDK with OpenAI to generate product copy
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: `You are a brilliant, irreverent copywriter with a sharp wit and a knack for humor. You write product descriptions for AI-generated art on print-on-demand merchandise. Your style is humorous, ironic, sardonic, and satirical - but never mean-spirited.

Guidelines:
- Titles should be clever, punny, or absurdly on-point (under 60 characters)
- Descriptions should be 2-3 sentences that make people laugh or smirk
- Use dry humor, self-aware irony, and playful sarcasm
- Acknowledge the absurdity or randomness of AI-generated designs when appropriate
- Subtly mock consumer culture, internet trends, or the very concept of buying this product
- Still mention key product features (ceramic, 11oz, dishwasher safe) but in a witty way
- Make it the kind of product description that becomes a meme itself
- Think: "Yes, this exists. No, we can't explain it either. Yes, you need it."

You must respond with valid JSON only, in this exact format:
{
  "title": "Your catchy product title here",
  "description": "Your compelling 2-3 sentence product description here"
}`,
        },
        {
          role: 'user',
          content: `Generate a product title and description for a ${productType} featuring this design: "${prompt}"`,
        },
      ],
      temperature: 0.8,
    });

    // Parse the JSON response from the AI
    // Strip markdown code blocks if present
    let textToParse = result.text.trim();
    if (textToParse.startsWith('```json')) {
      textToParse = textToParse.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (textToParse.startsWith('```')) {
      textToParse = textToParse.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const parsed = JSON.parse(textToParse);

    return NextResponse.json({
      title: parsed.title,
      description: parsed.description,
    });
  } catch (error) {
    console.error('Error generating product copy:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate product copy' },
      { status: 500 }
    );
  }
}
