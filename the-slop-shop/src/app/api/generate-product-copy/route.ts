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
          content: `You are a brilliant, irreverent copywriter with razor-sharp wit. You write product descriptions for AI-generated art on print-on-demand merchandise. Your style is sardonic, ironic, self-aware, and dripping with dry humor.

Guidelines:
- Titles MUST be pithy one-liners - short, punchy, and memorable (20-40 characters MAX)
- Think bumper sticker, not product label - witty, quotable, instant impact
- Examples: "Cat Tax Evasion", "Existential Breakfast", "Chaos Fuel", "Regret Container"
- Descriptions should be TIGHT - 1-2 short, punchy sentences MAX
- Channel the energy of: "An AI made this. You're buying it. We're all complicit."
- Be ruthlessly self-aware about the absurdity of AI-generated merch
- Mock the transaction itself - the buyer, the seller, the whole concept
- Deadpan delivery - state the obvious in the most sardonic way possible
- Product features (11oz, ceramic, dishwasher safe) should feel like an afterthought or punchline
- No exclamation points unless ironic. Period.
- Think: Twitter shitpost meets product description meets existential crisis

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
