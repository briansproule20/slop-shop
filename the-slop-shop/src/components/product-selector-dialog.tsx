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
import { Sparkles, Check } from 'lucide-react';

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
  // Beach Towels
  352, // Beach Towel
  // Golf Towels
  1614, // Golf Towel
  // Journals
  76, // Blank Journal
  // Tote Bags
  1313, // Cotton Canvas Tote Bag
  // Greeting Cards
  1094, // Greeting Cards (1, 10, 30, 50pcs)
  // Pet Slop
  562, // Pet Bandana
  855, // Pet Food Mat (12x18)
];

// Category definitions for better organization
const PRODUCT_CATEGORIES = {
  drinkware: {
    title: 'Mugs',
    ids: [503],
  },
  towels: {
    title: 'Towels',
    ids: [352, 1614],
  },
  paperGoods: {
    title: 'Paper Goods',
    ids: [76, 1094],
  },
  bags: {
    title: 'Bags',
    ids: [1313],
  },
  petSlop: {
    title: 'Pet Slop',
    ids: [562, 855],
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
    <Dialog
      open={!!image}
      onOpenChange={(open) => {
        // On mobile, only allow closing via the close button (not overlay click)
        // On desktop, allow overlay click to close
        if (!open && typeof window !== 'undefined' && window.innerWidth >= 640) {
          onClose();
        } else if (!open && typeof window !== 'undefined' && window.innerWidth < 640) {
          // Mobile - only close if explicitly triggered (not overlay click)
          onClose();
        } else if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-6xl max-h-[90vh] sm:max-h-[90vh] max-h-[85vh] overflow-y-auto p-0 gap-0 sm:rounded-lg rounded-t-2xl sm:top-[50%] top-auto sm:bottom-auto bottom-0 sm:translate-y-[-50%] translate-y-0 data-[state=open]:slide-in-from-bottom-full sm:data-[state=open]:slide-in-from-bottom-0"
        onInteractOutside={(e) => {
          // Prevent closing on mobile when clicking overlay during scroll
          if (typeof window !== 'undefined' && window.innerWidth < 640) {
            e.preventDefault();
          }
        }}
      >
        {/* Mobile pull handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        <div className="sticky top-0 z-10 bg-background border-b px-4 sm:px-6 py-3 sm:py-4">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                Choose Your Product
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm sm:text-base">
              Select a product to bring your design to life
            </DialogDescription>
          </DialogHeader>

          {/* Image Preview - Compact horizontal layout */}
          <div className="mt-3 sm:mt-4 flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg border">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-border shadow-sm">
              {image.imageUrl && (
                <NextImage
                  src={image.imageUrl}
                  alt="Your design"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-1">Your Design</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                &ldquo;{image.prompt}&rdquo;
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {/* Product Grid */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full aspect-[4/3] rounded-xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive text-sm mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && blueprints.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
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
                  <div key={key} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold tracking-tight">
                        {category.title}
                      </h3>
                      <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted rounded-full">
                        {categoryProducts.length}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {categoryProducts.map(blueprint => (
                        <button
                          key={blueprint.id}
                          onClick={() => handleSelectProduct(blueprint)}
                          className="group relative bg-card rounded-xl border-2 border-border hover:border-primary active:border-primary active:scale-[0.98] transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:shadow-lg active:shadow-xl touch-manipulation min-h-[44px]"
                          style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                        >
                          {/* Product Image */}
                          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                            {blueprint.images && blueprint.images[0] && (
                              <NextImage
                                src={blueprint.images[0]}
                                alt={blueprint.title}
                                fill
                                className="object-cover group-hover:scale-105 group-active:scale-105 transition-transform duration-300"
                              />
                            )}
                            {/* Hover/Active overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200" />

                            {/* Select indicator */}
                            <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 shadow-lg">
                              <Check className="h-4 w-4" />
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-3 sm:p-4 text-left space-y-1">
                            <h4 className="font-semibold text-sm leading-tight group-hover:text-primary group-active:text-primary transition-colors">
                              {blueprint.title}
                            </h4>
                            {blueprint.brand && (
                              <p className="text-xs text-muted-foreground">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
