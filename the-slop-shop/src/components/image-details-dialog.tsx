'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  getModelDisplayName,
  handleImageCopy,
  handleImageDownload,
  handleImageToFile,
  isImageActionable,
} from '@/lib/image-actions';
import type { GeneratedImage, ImageActionHandlers } from '@/lib/types';
import { Copy, Download, Edit, ShoppingBag, Trash2, X } from 'lucide-react';
import NextImage from 'next/image';
import { useCallback, useState } from 'react';

interface ImageDetailsDialogProps extends ImageActionHandlers {
  image: GeneratedImage | null;
  onClose: () => void;
  onPublish?: (image: GeneratedImage) => void;
  onDelete?: (image: GeneratedImage) => void;
}

export function ImageDetailsDialog({
  image,
  onClose,
  onAddToInput,
  onPublish,
  onDelete,
}: ImageDetailsDialogProps) {
  const [isPublishing, setIsPublishing] = useState(false);

  const handleAddToInput = useCallback(() => {
    if (!image || !isImageActionable(image)) return;

    const file = handleImageToFile(image.imageUrl!, image.id);
    onAddToInput([file]);
    onClose();
  }, [image, onAddToInput, onClose]);

  const handleDownload = useCallback(() => {
    if (!image || !isImageActionable(image)) return;

    handleImageDownload(image.imageUrl!, image.id);
  }, [image]);

  const handleCopy = useCallback(async () => {
    if (!image || !isImageActionable(image)) return;
    await handleImageCopy(image.imageUrl!);
  }, [image]);

  const handlePublishToShopify = useCallback(() => {
    if (!image || !isImageActionable(image)) return;

    setIsPublishing(true);
    // Small delay for animation
    setTimeout(() => {
      onClose();
      onPublish?.(image);
      setIsPublishing(false);
    }, 150);
  }, [image, onClose, onPublish]);

  const handleDelete = useCallback(() => {
    if (!image) return;

    onDelete?.(image);
    onClose();
  }, [image, onDelete, onClose]);

  if (!image) return null;

  const actionable = isImageActionable(image);

  return (
    <Dialog open={!!image} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full p-0 gap-0 bg-background sm:rounded-2xl rounded-t-2xl sm:top-[50%] top-auto sm:bottom-auto bottom-0 sm:translate-y-[-50%] translate-y-0 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>Image Details</DialogTitle>
        </VisuallyHidden>
        {/* Mobile pull handle */}
        <div className="sm:hidden sticky top-0 z-10 bg-background flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
        </div>

        {/* Close button - desktop */}
        <button
          onClick={onClose}
          className="hidden sm:flex fixed right-4 top-4 z-20 h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div>
          {/* Image */}
          <div className="relative w-full aspect-square bg-muted">
            {image.error ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3 p-6">
                <div className="text-destructive text-lg">Generation failed</div>
                <div className="text-sm text-muted-foreground text-center">
                  {image.error}
                </div>
              </div>
            ) : image.imageUrl ? (
              <NextImage
                src={image.imageUrl}
                alt={image.prompt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 md:p-6 space-y-4">
            {/* Primary Action - Publish */}
            <Button
              onClick={handlePublishToShopify}
              disabled={!actionable || isPublishing}
              size="lg"
              className={`w-full h-14 md:h-16 text-base md:text-lg font-semibold transition-all duration-200 ${
                isPublishing ? 'scale-95' : 'hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <ShoppingBag className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              {isPublishing ? 'Opening...' : 'Publish to Store'}
            </Button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleCopy}
                disabled={!actionable}
                variant="outline"
                className="h-11 md:h-12 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Copy size={16} />
                <span>Copy</span>
              </Button>
              <Button
                onClick={handleDownload}
                disabled={!actionable}
                variant="outline"
                className="h-11 md:h-12 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Download size={16} />
                <span>Download</span>
              </Button>
              <Button
                onClick={handleAddToInput}
                disabled={!actionable}
                variant="outline"
                className="h-11 md:h-12 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Edit size={16} />
                <span>Edit</span>
              </Button>
            </div>

            {/* Delete - Less prominent */}
            <Button
              onClick={handleDelete}
              variant="ghost"
              className="w-full h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>

            {/* Image Info */}
            <div className="pt-4 border-t space-y-3">
              <p className="text-sm md:text-base font-medium">
                &quot;{image.prompt}&quot;
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded-md">
                  {getModelDisplayName(image.model)}
                </span>
                <span className="px-2 py-1 bg-muted rounded-md">
                  {image.isEdit ? 'Edited' : 'Generated'}
                </span>
                <span className="px-2 py-1 bg-muted rounded-md">
                  {image.timestamp.toLocaleDateString()}
                </span>
              </div>

              {/* Source Images */}
              {image.attachments && image.attachments.length > 0 && (
                <div className="pt-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Source Images
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {image.attachments.map((dataUrl, index) => (
                      <div
                        key={index}
                        className="relative w-12 h-12 rounded-lg border overflow-hidden bg-muted"
                      >
                        <NextImage
                          src={dataUrl}
                          alt={`Source image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
