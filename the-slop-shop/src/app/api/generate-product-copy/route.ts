/**
 * API route to generate product title and description using AI
 */

import { openai } from '@/echo';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, productType, existingTitle, existingDescription, stylePreference, customInstructions } = await request.json();

    if (!prompt || !productType) {
      return NextResponse.json(
        { error: 'prompt and productType are required' },
        { status: 400 }
      );
    }

    // Build dynamic system prompt based on style preference
    let styleGuidelines = '';

    switch (stylePreference) {
      case 'sardonic':
        styleGuidelines = `Your style is sardonic, ironic, self-aware, and dripping with dry humor.
- Channel the energy of: "An AI made this. You're buying it. We're all complicit."
- Be ruthlessly self-aware about the absurdity of AI-generated merch
- Mock the transaction itself - the buyer, the seller, the whole concept
- Deadpan delivery - state the obvious in the most sardonic way possible
- No exclamation points unless ironic. Period.
- Think: Twitter shitpost meets product description meets existential crisis`;
        break;
      case 'witty':
        styleGuidelines = `Your style is clever, witty, and playfully irreverent.
- Use wordplay, puns, and clever observations
- Keep it light and fun but still edgy
- Product descriptions should make people chuckle
- Think: smart humor that's accessible but not dumbed down`;
        break;
      case 'straightforward':
        styleGuidelines = `Your style is clean, direct, and professional with a hint of personality.
- Focus on the product and design
- Clear, compelling descriptions without over-the-top humor
- Still creative but more grounded
- Think: Etsy meets modern design shop`;
        break;
      case 'absurd':
        styleGuidelines = `Your style is weird, surreal, and delightfully nonsensical.
- Embrace the absurdity completely
- Make unexpected connections and bizarre observations
- The stranger the better, but keep it readable
- Think: fever dream meets product catalog`;
        break;
      case 'unhinged':
        styleGuidelines = `Your style is completely unhinged and chaotic.
- Write like you've had 7 energy drinks and no sleep
- Stream of consciousness meets manic enthusiasm
- Excessive enthusiasm about mundane details
- Random tangents are encouraged
- Think: infomercial host having a breakdown meets late-night shopping network`;
        break;
      case 'luxury':
        styleGuidelines = `Your style is absurdly pretentious luxury marketing parody.
- Treat this AI-generated product like it's haute couture
- Use ridiculous luxury brand language
- Over-the-top adjectives and flowery descriptions
- Make it sound like it belongs in a museum
- Think: Gwyneth Paltrow's Goop meets luxury auction catalog`;
        break;
      case 'conspiracy':
        styleGuidelines = `Your style is tongue-in-cheek conspiracy theorist.
- Write as if this product holds secret knowledge
- Make vague references to "those who know"
- Imply the design has hidden meanings
- Stay playful and fun, not actually crazy
- Think: Ancient Aliens narrator meets product description`;
        break;
      case 'shakespearean':
        styleGuidelines = `Your style is overly dramatic Shakespearean prose.
- Use flowery, theatrical language
- Treat the product like it's part of an epic tale
- Add dramatic flair to mundane product features
- Occasional "thee" and "thou" for effect
- Think: Shakespeare writing Amazon product listings`;
        break;
      case 'motivational':
        styleGuidelines = `Your style is over-the-top motivational speaker energy.
- Everything is LIFE-CHANGING and TRANSFORMATIVE
- This product will unlock your potential
- Hustle culture meets inspirational Instagram
- Excessive optimism about a coffee mug
- Think: Tony Robbins meets infomercial`;
        break;
      case 'noir':
        styleGuidelines = `Your style is hard-boiled detective noir.
- Write in short, punchy noir detective style
- The product has a dark past and secrets
- Moody, atmospheric descriptions
- Everything sounds dangerous and mysterious
- Think: Philip Marlowe describing a ceramic mug`;
        break;
      default:
        styleGuidelines = `Your style is sardonic, ironic, self-aware, and dripping with dry humor.`;
    }

    const contextMessage = existingTitle || existingDescription
      ? `The user has existing copy:\nTitle: "${existingTitle || 'none'}"\nDescription: "${existingDescription || 'none'}"\n\nImprove or completely rewrite this copy based on the style guidelines and any custom instructions.`
      : `Generate fresh, original copy from scratch.`;

    const customInstructionsText = customInstructions
      ? `\n\nADDITIONAL USER INSTRUCTIONS (prioritize these): ${customInstructions}`
      : '';

    // Use Echo SDK with OpenAI to generate product copy
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: `You are a brilliant, irreverent copywriter. You write product descriptions for AI-generated art on print-on-demand merchandise.

${styleGuidelines}

General Guidelines:
- Titles MUST be pithy one-liners - short, punchy, and memorable (20-50 characters)
- Think bumper sticker, not product label - witty, quotable, instant impact
- Examples: "Cat Tax Evasion", "Existential Breakfast", "Chaos Fuel", "Regret Container"
- Descriptions should be TIGHT - 1-3 short, punchy sentences
- Product features (11oz, ceramic, dishwasher safe) can be mentioned naturally if relevant

You must respond with valid JSON only, in this exact format:
{
  "title": "Your catchy product title here",
  "description": "Your compelling product description here"
}`,
        },
        {
          role: 'user',
          content: `Generate a product title and description for a ${productType} featuring this design: "${prompt}"

${contextMessage}${customInstructionsText}`,
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
