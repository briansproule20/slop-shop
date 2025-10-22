'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MugMockup } from '@/components/mug-mockup';
import { BeachTowelMockup } from '@/components/beach-towel-mockup';
import { GolfTowelMockup } from '@/components/golf-towel-mockup';
import { PublishingProgressModal } from '@/components/publishing-progress-modal';
import { getProductConfig } from '@/lib/product-configs';
import type { PrintifyBlueprint } from '@/lib/printify-types';
import type { GeneratedImage } from '@/lib/types';
import { ArrowLeft, Loader2, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Map blueprint IDs to product configuration keys
function getBlueprintProductKey(blueprintId: number): string {
  const blueprintMap: Record<number, string> = {
    503: 'ceramicMug',
    352: 'beachTowel',
    1614: 'golfTowel',
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
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [productUrl, setProductUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const hasLoadedData = useRef(false);

  useEffect(() => {
    // Prevent loading data multiple times (React strict mode double-mount)
    if (hasLoadedData.current) {
      console.log('Data already loaded, skipping...');
      return;
    }

    console.log('Preview page mounted, checking for data...');

    // Try to get data from sessionStorage
    const previewData = sessionStorage.getItem('previewData');

    console.log('SessionStorage data:', {
      hasData: !!previewData,
      dataLength: previewData?.length,
    });

    if (previewData) {
      try {
        const data = JSON.parse(previewData);

        console.log('Successfully parsed data:', {
          imageId: data.imageId,
          blueprintId: data.blueprintId,
          blueprintTitle: data.blueprintTitle,
        });

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
        setError(null); // Clear any errors
        hasLoadedData.current = true; // Mark as loaded

        // Generate AI-powered title and description
        generateProductCopy(reconstructedImage.prompt, reconstructedBlueprint.title);

        // Clear sessionStorage after loading
        sessionStorage.removeItem('previewData');
      } catch (err) {
        console.error('Error parsing sessionStorage data:', err);
        setError('Invalid product data');
      }
    } else {
      // Only show error if we haven't already loaded data
      // This prevents showing error on hot reload or strict mode double-mount
      if (!hasLoadedData.current) {
        console.log('No data found in sessionStorage - showing error to user');
        setError('No product data found. Please go back and select a product again.');
      } else {
        console.log('No data in sessionStorage, but data already loaded - skipping error');
      }
    }
  }, []);

  const generateProductCopy = async (prompt: string, productType: string) => {
    setGeneratingCopy(true);
    try {
      const response = await fetch('/api/generate-product-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, productType }),
      });

      if (!response.ok) {
        console.log('AI generation failed, using fallback copy');
        throw new Error('Failed to generate product copy');
      }

      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
    } catch {
      // Fallback to witty manual copy
      const cleanPrompt = prompt.charAt(0).toUpperCase() + prompt.slice(1);
      const isMug = productType.toLowerCase().includes('mug');
      const isBeachTowel = productType.toLowerCase().includes('beach');
      const isGolfTowel = productType.toLowerCase().includes('golf');
      
      if (isMug) {
        setTitle(`${cleanPrompt.slice(0, 50)} Mug`);
        setDescription(`Your morning coffee deserves this. ${cleanPrompt}. 11oz ceramic mug, dishwasher safe, microwave safe. Because why not?`);
      } else if (isBeachTowel) {
        setTitle(`${cleanPrompt.slice(0, 50)} Beach Towel`);
        setDescription(`Make a statement at the beach. ${cleanPrompt}. Premium quality beach towel with vibrant, one-sided print. Perfect for beach days, poolside lounging, or as unique home decor.`);
      } else if (isGolfTowel) {
        setTitle(`${cleanPrompt.slice(0, 50)} Golf Towel`);
        setDescription(`Elevate your golf game. ${cleanPrompt}. Premium microfiber golf towel with gold grommet and ring. Perfect for the course or as a gift for golf enthusiasts.`);
      } else {
        setTitle(`${cleanPrompt.slice(0, 50)} ${productType}`);
        setDescription(`${cleanPrompt}. High-quality custom print on premium ${productType.toLowerCase()}.`);
      }
    } finally {
      setGeneratingCopy(false);
    }
  };

  const handlePublish = async () => {
    if (!image || !blueprint) return;

    setPublishing(true);
    setError(null);

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
                  position: 'front',
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish product');
      }

      const result = await response.json();
      
      // Try to get the Shopify product URL from sales_channel_properties
      const externalUrl = result.product?.sales_channel_properties?.[0]?.external_url;
      
      // Construct URL - prefer specific product page, fallback to storefront home
      const productUrl = externalUrl || 'https://slopshop-app.myshopify.com/';
      
      setProductUrl(productUrl);
      // Show progress modal after successful API call
      setShowProgressModal(true);
    } catch (err) {
      console.error('Error publishing product:', err);
      setError(err instanceof Error ? err.message : 'Failed to publish product');
    } finally {
      setPublishing(false);
    }
  };

  const handleProgressComplete = () => {
    setShowProgressModal(false);
    router.push('/');
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Product Preview
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Product Mockup */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {blueprint.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {blueprint.brand && (
                    <>
                      <span className="font-medium">{blueprint.brand}</span>
                      {blueprint.model && <span>•</span>}
                    </>
                  )}
                  {blueprint.model && <span>{blueprint.model}</span>}
                </div>
              </div>

              {/* Product Mockup with Design */}
              <div className="mb-6">
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
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Type:</span>
                  <span className="font-medium text-gray-900">{blueprint.title}</span>
                </div>
                {blueprint.description && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {blueprint.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product Details Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Product Details
              </h2>

              <div className="space-y-4">
                {generatingCopy && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AI is writing your product copy...</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Product Title
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => generateProductCopy(image!.prompt, blueprint!.title)}
                      disabled={generatingCopy || !image || !blueprint}
                      className="h-7 text-xs"
                    >
                      <Wand2 size={12} className="mr-1" />
                      Regenerate
                    </Button>
                  </div>
                  <Input
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter product title"
                    className="w-full"
                    disabled={generatingCopy}
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full"
                    disabled={generatingCopy}
                  />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Your Design
                  </h3>
                  <p className="text-sm text-gray-600 italic">
                    &ldquo;{image.prompt}&rdquo;
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handlePublish}
                  disabled={publishing || !title.trim()}
                  className="w-full"
                  size="lg"
                >
                  {publishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {publishing ? 'Publishing...' : 'Publish to Store'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  This will create a product in Printify and publish it to your
                  Shopify store
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publishing Progress Modal */}
      <PublishingProgressModal
        isOpen={showProgressModal}
        productTitle={title}
        productUrl={productUrl}
        onComplete={handleProgressComplete}
      />
    </div>
  );
}
