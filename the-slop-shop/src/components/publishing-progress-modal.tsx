'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react';

interface PublishingProgressModalProps {
  isOpen: boolean;
  productTitle: string;
  productUrl: string;
  onComplete: () => void;
}

export function PublishingProgressModal({
  isOpen,
  productTitle,
  productUrl,
  onComplete,
}: PublishingProgressModalProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsComplete(false);
      return;
    }

    // Simulate progress over 20 seconds
    const duration = 20000; // 20 seconds
    const interval = 100; // Update every 100ms
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      
      if (currentProgress >= 100) {
        setProgress(100);
        setIsComplete(true);
        clearInterval(timer);
        return;
      }
      
      setProgress(currentProgress);
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleViewProduct = () => {
    window.open(productUrl, '_blank');
    onComplete();
  };

  const handleClose = () => {
    if (isComplete) {
      onComplete();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => !isComplete && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {!isComplete ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Publishing Your Product
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Product Published!
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {!isComplete
              ? 'Creating your product and publishing to Shopify...'
              : 'Your product is live on your store!'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Title */}
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Product Name
            </p>
            <p className="text-base font-semibold line-clamp-2">{productTitle}</p>
          </div>

          {/* Progress Bar */}
          {!isComplete && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                This usually takes about 20 seconds...
              </p>
            </div>
          )}

          {/* Success State */}
          {isComplete && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">
                    Product may take a moment to appear
                  </p>
                  <p className="text-xs text-blue-700">
                    It can take 1-2 minutes for your product to fully sync with Shopify.
                    If you don&apos;t see it immediately, refresh the page.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleViewProduct}
                className="w-full"
                size="lg"
              >
                View Product in Store
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>

              <Button
                onClick={onComplete}
                variant="outline"
                className="w-full"
              >
                Create Another Product
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

