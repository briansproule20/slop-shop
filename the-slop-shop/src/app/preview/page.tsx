'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { PrintifyBlueprint } from '@/lib/printify-types';
import type { GeneratedImage } from '@/lib/types';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductPreviewPage() {
  const router = useRouter();

  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [blueprint, setBlueprint] = useState<PrintifyBlueprint | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

        // Set default title and description
        setTitle(
          `Custom ${reconstructedBlueprint.title} - ${reconstructedImage.prompt.slice(0, 50)}`
        );
        setDescription(reconstructedImage.prompt);

        // Clear sessionStorage after loading
        sessionStorage.removeItem('previewData');
      } catch (err) {
        console.error('Error parsing sessionStorage data:', err);
        setError('Invalid product data');
      }
    } else {
      console.error('No data found in sessionStorage');
      setError('No product data found. Please go back and select a product again.');
    }
  }, []);

  const handlePublish = async () => {
    if (!image || !blueprint) return;

    setPublishing(true);
    setError(null);

    try {
      const response = await fetch('/api/printify/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: image.imageUrl,
          fileName: `${image.id}.png`,
          blueprintId: blueprint.id,
          printProviderId: 1, // Default provider - should be selected based on blueprint
          title,
          description,
          variants: [
            {
              id: 1, // Default variant
              price: 2999, // $29.99 in cents
              is_enabled: true,
            },
          ],
          printAreas: [
            {
              variant_ids: [1],
              placeholders: [
                {
                  position: 'front',
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

      setPublished(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      console.error('Error publishing product:', err);
      setError(err instanceof Error ? err.message : 'Failed to publish product');
    } finally {
      setPublishing(false);
    }
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

              {/* Product Mockup with Design Overlay */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-6">
                <div className="relative aspect-square max-w-md mx-auto">
                  {/* Background product image if available */}
                  {blueprint.images && blueprint.images[0] && (
                    <div className="absolute inset-0">
                      <NextImage
                        src={blueprint.images[0]}
                        alt={blueprint.title}
                        fill
                        className="object-contain opacity-90"
                      />
                    </div>
                  )}

                  {/* Design overlay - positioned on the product with proper sizing */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[35%] h-[35%] drop-shadow-2xl">
                      {image.imageUrl && (
                        <NextImage
                          src={image.imageUrl}
                          alt="Your design"
                          fill
                          className="object-contain"
                          priority
                        />
                      )}
                    </div>
                  </div>
                </div>
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
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Product Title
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter product title"
                    className="w-full"
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

                {published && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <p className="text-sm text-green-600">
                      Published to your store!
                    </p>
                  </div>
                )}

                <Button
                  onClick={handlePublish}
                  disabled={publishing || published || !title.trim()}
                  className="w-full"
                  size="lg"
                >
                  {publishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {published
                    ? 'Published!'
                    : publishing
                      ? 'Publishing...'
                      : 'Publish to Store'}
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
    </div>
  );
}
