'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MugMockup } from '@/components/mug-mockup';
import { BeachTowelMockup } from '@/components/beach-towel-mockup';
import { GolfTowelMockup } from '@/components/golf-towel-mockup';
import { JournalMockup } from '@/components/journal-mockup';
import { ToteBagMockup } from '@/components/tote-bag-mockup';
import { GreetingCardMockup } from '@/components/greeting-card-mockup';
import { PetBandanaMockup } from '@/components/pet-bandana-mockup';
import { PetFoodMatMockup } from '@/components/pet-food-mat-mockup';
import { PosterMockup } from '@/components/poster-mockup';
import { HoodieMockup } from '@/components/hoodie-mockup';
import { getProductConfig } from '@/lib/product-configs';
import type { PrintifyBlueprint } from '@/lib/printify-types';
import type { GeneratedImage } from '@/lib/types';
import { ArrowLeft, Loader2, Sparkles, Skull, CheckCircle2, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Map blueprint IDs to product configuration keys
function getBlueprintProductKey(blueprintId: number): string {
  const blueprintMap: Record<number, string> = {
    503: 'ceramicMug',
    352: 'beachTowel',
    1614: 'golfTowel',
    76: 'journal',
    1313: 'toteBag',
    1094: 'greetingCard',
    282: 'poster',
    562: 'petBandana',
    855: 'petFoodMat',
    77: 'hoodie',
  };
  const key = blueprintMap[blueprintId];
  if (!key) {
    throw new Error(`Unknown blueprint ID: ${blueprintId}`);
  }
  return key;
}

export default function ProductPreviewPage() {
  const router = useRouter();

  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [blueprint, setBlueprint] = useState<PrintifyBlueprint | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [productUrl, setProductUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const [isTypingTitle, setIsTypingTitle] = useState(false);
  const [isTypingDescription, setIsTypingDescription] = useState(false);
  const hasLoadedData = useRef(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Prevent loading data multiple times (React strict mode double-mount)
    if (hasLoadedData.current) {
      return;
    }

    // Try to get data from sessionStorage
    const previewData = sessionStorage.getItem('previewData');

    if (previewData) {
      try {
        const data = JSON.parse(previewData);

        // Reconstruct image and blueprint objects
        const reconstructedImage: GeneratedImage = {
          id: data.imageId,
          imageUrl: data.imageUrl,
          prompt: data.prompt,
          timestamp: new Date(),
          isEdit: false,
        };

        const reconstructedBlueprint: PrintifyBlueprint = {
          id: data.blueprintId,
          title: data.blueprintTitle,
          brand: data.blueprintBrand,
          model: data.blueprintModel,
          images: data.blueprintImages,
          description: data.blueprintDescription,
        };

        setImage(reconstructedImage);
        setBlueprint(reconstructedBlueprint);
        setError(null);
        hasLoadedData.current = true;

        // Clear sessionStorage after loading
        sessionStorage.removeItem('previewData');
      } catch (err) {
        console.error('Error parsing sessionStorage data:', err);
        setError('Invalid product data');
      }
    } else {
      if (!hasLoadedData.current) {
        setError('No product data found. Please go back and select a product again.');
      }
    }
  }, []);

  const typeText = async (
    text: string,
    setter: (value: string) => void,
    inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  ) => {
    setter('');
    for (let i = 0; i <= text.length; i++) {
      setter(text.slice(0, i));
      if (inputRef.current) {
        inputRef.current.focus();
        const length = text.slice(0, i).length;
        inputRef.current.setSelectionRange(length, length);
      }
      await new Promise((r) => setTimeout(r, 18 + Math.random() * 25));
    }
  };

  const generateSlopCopy = async () => {
    if (!image || !blueprint) return;

    setGeneratingCopy(true);
    try {
      const response = await fetch('/api/generate-product-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: image.prompt,
          productType: blueprint.title,
          stylePreference: 'slop',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate product copy');
      }

      const data = await response.json();

      // Type out title first
      setIsTypingTitle(true);
      await typeText(data.title, setTitle, titleInputRef);
      setIsTypingTitle(false);

      // Then description
      setIsTypingDescription(true);
      await typeText(data.description, setDescription, descriptionRef);
      setIsTypingDescription(false);
    } catch (err) {
      console.error('Error generating copy:', err);
      // Fallback
      const cleanPrompt = image.prompt.charAt(0).toUpperCase() + image.prompt.slice(1);
      setTitle(`${cleanPrompt.slice(0, 50)}`);
      setDescription(`AI made this. You're buying it. ${cleanPrompt}.`);
      setIsTypingTitle(false);
      setIsTypingDescription(false);
    } finally {
      setGeneratingCopy(false);
    }
  };

  const handlePublish = async () => {
    if (!image || !blueprint) return;

    setPublishing(true);
    setPublishProgress(0);
    setError(null);

    // Start progress animation
    const progressInterval = setInterval(() => {
      setPublishProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      // Get product configuration based on blueprint ID
      const productKey = getBlueprintProductKey(blueprint.id);
      const config = getProductConfig(productKey);

      const response = await fetch('/api/printify/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: image.imageUrl,
          fileName: `${image.id}.png`,
          blueprintId: config.blueprint_id,
          printProviderId: config.print_provider_id,
          title,
          description,
          tags: config.tags,
          productType: config.product_type,
          variants: config.variants.map(variantId => ({
            id: variantId,
            price: config.price,
            is_enabled: true,
          })),
          printAreas: [
            {
              variant_ids: config.variants,
              placeholders: [
                {
                  position: config.position,
                  x: config.x,
                  y: config.y,
                  scale: config.scale,
                  angle: config.angle,
                },
              ],
            },
          ],
          publishToShopify: true,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish product');
      }

      const result = await response.json();

      // Try to get the Shopify product URL from sales_channel_properties
      const externalUrl = result.product?.sales_channel_properties?.[0]?.external_url;

      // Construct URL - prefer specific product page, fallback to storefront home
      const url = externalUrl || 'https://slopshop-app.myshopify.com/';

      setPublishProgress(100);
      setProductUrl(url);
      setIsPublished(true);
    } catch (err) {
      clearInterval(progressInterval);
      console.error('Error publishing product:', err);
      setError(err instanceof Error ? err.message : 'Failed to publish product');
      setPublishProgress(0);
    } finally {
      setPublishing(false);
    }
  };

  const handleViewProduct = () => {
    window.open(productUrl, '_blank');
  };

  if (error && !image) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push('/')}>Go Back</Button>
      </div>
    );
  }

  if (!image || !blueprint) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-full max-w-4xl h-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header - Fixed */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')}
            className="h-9 w-9"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold truncate">{blueprint.title}</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block max-w-5xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pb-8 md:px-6">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Product Mockup */}
          <div className="space-y-4">
            {/* Mockup Card */}
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
              {/* Mockup */}
              <div className="p-4 md:p-6">
                {blueprint.id === 503 && (
                  <MugMockup
                    imageUrl={image.imageUrl!}
                    imageAlt="Your design on mug"
                  />
                )}
                {blueprint.id === 352 && (
                  <BeachTowelMockup
                    imageUrl={image.imageUrl!}
                    imageAlt="Your design on beach towel"
                  />
                )}
                {blueprint.id === 1614 && (
                  <GolfTowelMockup
                    imageUrl={image.imageUrl!}
                    imageAlt="Your design on golf towel"
                  />
                )}
                {blueprint.id === 76 && (
                  <JournalMockup
                    imageUrl={image.imageUrl!}
                    imageAlt="Your design on journal"
                  />
                )}
                {blueprint.id === 1313 && (
                  <ToteBagMockup
                    imageUrl={image.imageUrl!}
                    imageAlt="Your design on tote bag"
                  />
                )}
                {blueprint.id === 1094 && (
                  <GreetingCardMockup
                    imageUrl={image.imageUrl!}
                    imageAlt="Your design on greeting card"
                  />
                )}
                {blueprint.id === 562 && (
                  <PetBandanaMockup
                    imageUrl={image.imageUrl!}
                    imageAlt="Your design on pet bandana"
                  />
                )}
                {blueprint.id === 855 && (
                  <PetFoodMatMockup
                    imageUrl={image.imageUrl!}
                    imageAlt="Your design on pet food mat"
                  />
                )}
                {blueprint.id === 282 && (
                  <PosterMockup
                    imageUrl={image.imageUrl!}
                    imageAlt="Your design on poster"
                  />
                )}
                {blueprint.id === 77 && (
                  <HoodieMockup
                    imageUrl={image.imageUrl!}
                    imageAlt="Your design on hoodie"
                  />
                )}
              </div>

              {/* Product Title - Desktop only */}
              <div className="hidden md:block px-6 pb-6">
                <h2 className="text-xl font-semibold">{blueprint.title}</h2>
                {(blueprint.brand || blueprint.model) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {[blueprint.brand, blueprint.model].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>

              {/* Preview disclaimer */}
              <div className="px-6 pb-6 pt-2 border-t">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Published version may vary slightly from preview.{' '}
                  <a
                    href="https://slopshop-app.myshopify.com/collections/all"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    View final products
                  </a>
                </p>
              </div>
            </div>

            {/* Design Prompt - Mobile shows below mockup */}
            <div className="md:hidden bg-muted/50 rounded-xl p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Your Design</p>
              <p className="text-sm italic">&ldquo;{image.prompt}&rdquo;</p>
            </div>
          </div>

          {/* Product Details Form */}
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border shadow-sm p-5 md:p-6">
              {/* Generate Copy Button */}
              <Button
                onClick={generateSlopCopy}
                disabled={generatingCopy || isPublished || publishing}
                variant="outline"
                className={`w-full h-12 md:h-14 text-sm md:text-base font-medium border-2 border-dashed hover:border-solid hover:bg-muted/50 transition-all ${generatingCopy ? 'animate-pulse' : ''} ${isPublished ? 'opacity-50' : ''}`}
              >
                {generatingCopy ? (
                  <span className="flex items-center gap-2">
                    <Skull className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                    <span>Generating slop...</span>
                  </span>
                ) : isPublished ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
                    <span>Copy Locked</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
                    <span>Generate Copy...</span>
                  </span>
                )}
              </Button>

              <div className="space-y-4 mt-5">
                {/* Title Field */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <div className="relative">
                    <Input
                      ref={titleInputRef}
                      id="title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Product title"
                      className="h-11 md:h-12 text-base"
                      disabled={isTypingTitle || isTypingDescription || isPublished}
                    />
                    {isTypingTitle && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-foreground animate-blink" />
                    )}
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <div className="relative">
                    <Textarea
                      ref={descriptionRef}
                      id="description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Product description"
                      rows={4}
                      className="text-base resize-none"
                      disabled={isTypingTitle || isTypingDescription || isPublished}
                    />
                    {isTypingDescription && (
                      <div className="absolute right-3 bottom-3 w-0.5 h-5 bg-foreground animate-blink" />
                    )}
                  </div>
                </div>

                {/* Design Prompt - Desktop */}
                <div className="hidden md:block pt-4 border-t">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Your Design</p>
                  <p className="text-sm italic">&ldquo;{image.prompt}&rdquo;</p>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </div>

            {/* Publish Button - Separate card on mobile for thumb reach */}
            <div className="bg-card rounded-2xl border shadow-sm p-5 md:p-6 space-y-4">
              {!isPublished ? (
                <>
                  <div className="relative">
                    <Button
                      onClick={handlePublish}
                      disabled={publishing || !title.trim()}
                      className="w-full h-12 md:h-14 text-base font-medium relative overflow-hidden"
                    >
                      {/* Progress bar background */}
                      {publishing && (
                        <div
                          className="absolute inset-0 bg-primary/20 transition-all duration-300"
                          style={{ width: `${publishProgress}%` }}
                        />
                      )}
                      <span className="relative flex items-center justify-center">
                        {publishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {publishing ? `Publishing... ${Math.round(publishProgress)}%` : 'Publish to Store'}
                      </span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Creates product in Printify and publishes to Shopify
                  </p>
                </>
              ) : (
                <>
                  {/* Success state */}
                  <div className="flex items-center justify-center gap-2 text-green-600 py-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Published successfully</span>
                  </div>
                  <Button
                    onClick={handleViewProduct}
                    className="w-full h-12 md:h-14 text-base font-medium"
                  >
                    View Product in Store
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                    className="w-full h-10"
                  >
                    Create Another Product
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    It may take 1-2 minutes for the product to fully sync
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
