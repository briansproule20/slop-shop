'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { PrintifyBlueprint } from '@/lib/printify-types';
import type { GeneratedImage } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import NextImage from 'next/image';

interface ProductSelectorDialogProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onSelectProduct: (image: GeneratedImage, blueprint: PrintifyBlueprint) => void;
}

// Curated list of popular print-on-demand products
// Verified IDs from Printify API
const POPULAR_BLUEPRINT_IDS = [
  // Mugs
  503, // White Ceramic Mug, 11oz
];

// Category definitions for better organization
const PRODUCT_CATEGORIES = {
  drinkware: {
    title: '☕ Mugs',
    ids: [503],
  },
};

export function ProductSelectorDialog({
  image,
  onClose,
  onSelectProduct,
}: ProductSelectorDialogProps) {
  const [blueprints, setBlueprints] = useState<PrintifyBlueprint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!image) return;

    async function fetchBlueprints() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/printify/blueprints');
        if (!response.ok) {
          throw new Error('Failed to fetch product catalog');
        }

        const data: PrintifyBlueprint[] = await response.json();

        // Filter to show only popular products
        const popularBlueprints = data.filter(bp =>
          POPULAR_BLUEPRINT_IDS.includes(bp.id)
        );

        setBlueprints(popularBlueprints);
      } catch (err) {
        console.error('Error fetching blueprints:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchBlueprints();
  }, [image]);

  const handleSelectProduct = useCallback(
    (blueprint: PrintifyBlueprint) => {
      if (!image) return;
      onSelectProduct(image, blueprint);
    },
    [image, onSelectProduct]
  );

  if (!image) return null;

  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Choose Your Product
          </DialogTitle>
          <DialogDescription className="text-base">
            Select a product to showcase your design
          </DialogDescription>
        </DialogHeader>

        {/* Image Preview with Design Info */}
        <div className="flex flex-col items-center gap-3 py-4 px-4 bg-gray-50 rounded-lg">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-300 shadow-md">
            {image.imageUrl && (
              <NextImage
                src={image.imageUrl}
                alt="Your design"
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">Your Design</p>
            <p className="text-xs text-gray-600 italic max-w-md truncate">
              &ldquo;{image.prompt}&rdquo;
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-full aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && blueprints.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products available
          </div>
        )}

        {!loading && !error && blueprints.length > 0 && (
          <div className="space-y-8">
            {Object.entries(PRODUCT_CATEGORIES).map(([key, category]) => {
              const categoryProducts = blueprints.filter(bp =>
                category.ids.includes(bp.id)
              );

              if (categoryProducts.length === 0) return null;

              return (
                <div key={key}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {category.title}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryProducts.map(blueprint => (
                      <button
                        key={blueprint.id}
                        onClick={() => handleSelectProduct(blueprint)}
                        className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {blueprint.images && blueprint.images[0] && (
                          <NextImage
                            src={blueprint.images[0]}
                            alt={blueprint.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                          <p className="text-white text-sm font-semibold truncate">
                            {blueprint.title}
                          </p>
                          {blueprint.brand && (
                            <p className="text-white/80 text-xs truncate">
                              {blueprint.brand}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
