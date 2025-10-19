'use client';

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  usePromptInputAttachments,
} from '@/components/ai-elements/prompt-input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fileToDataUrl } from '@/lib/image-utils';
import type {
  EditImageRequest,
  GeneratedImage,
  GenerateImageRequest,
  ImageResponse,
  ModelConfig,
  ModelOption,
} from '@/lib/types';
import { getAllImages, saveImage } from '@/lib/image-db';
import { ImageHistory } from './image-history';
import { ProductSelectorDialog } from './product-selector-dialog';
import type { PrintifyBlueprint } from '@/lib/printify-types';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    __promptInputActions?: {
      addFiles: (files: File[] | FileList) => void;
      clear: () => void;
    };
  }
}

/**
 * Available AI models for image generation
 * These models integrate with the Echo SDK to provide different image generation capabilities
 */
const models: ModelConfig[] = [
  {
    id: 'openai',
    name: 'GPT Image',
    price: '~30¢',
    quality: 'High',
    speed: 'Slow'
  },
  {
    id: 'gemini',
    name: 'Imagen (Nano Banana)',
    price: '~5¢',
    quality: 'Medium',
    speed: 'Fast'
  },
];

/**
 * API functions for image generation and editing
 * These functions communicate with the Echo SDK backend routes
 */

// ===== API FUNCTIONS =====
async function generateImage(
  request: GenerateImageRequest
): Promise<ImageResponse> {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

async function editImage(request: EditImageRequest): Promise<ImageResponse> {
  const response = await fetch('/api/edit-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Main ImageGenerator component
 *
 * This component demonstrates how to integrate Echo SDK with AI image generation:
 * - Uses PromptInput for unified input handling with attachments
 * - Supports both text-to-image generation and image editing
 * - Maintains history of all generated/edited images
 * - Provides seamless model switching between OpenAI and Gemini
 */
export default function ImageGenerator() {
  const router = useRouter();
  const [model, setModel] = useState<ModelOption>('gemini');
  const [imageHistory, setImageHistory] = useState<GeneratedImage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageToPublish, setImageToPublish] = useState<GeneratedImage | null>(null);
  const promptInputRef = useRef<HTMLFormElement>(null);

  // Load images from IndexedDB on mount
  useEffect(() => {
    async function loadImages() {
      try {
        const images = await getAllImages();
        setImageHistory(images);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load images from IndexedDB:', error);
        setIsLoaded(true);
      }
    }

    loadImages();
  }, []);

  // Save images to IndexedDB whenever they change
  useEffect(() => {
    // Don't save until we've loaded initial data to avoid overwriting
    if (!isLoaded) return;

    async function saveImages() {
      try {
        // Save each image that has completed (has imageUrl or error)
        const savePromises = imageHistory
          .filter(img => !img.isLoading)
          .map(img => saveImage(img));

        await Promise.all(savePromises);
      } catch (error) {
        console.error('Failed to save images to IndexedDB:', error);
      }
    }

    saveImages();
  }, [imageHistory, isLoaded]);

  // Handle adding files to the input from external triggers (like from image history)
  const handleAddToInput = useCallback((files: File[]) => {
    const actions = window.__promptInputActions;
    if (actions) {
      actions.addFiles(files);
    }
  }, []);

  const clearForm = useCallback(() => {
    promptInputRef.current?.reset();
    const actions = window.__promptInputActions;
    if (actions) {
      actions.clear();
    }
  }, []);

  const handlePublishClick = useCallback((image: GeneratedImage) => {
    setImageToPublish(image);
  }, []);

  const handleProductSelect = useCallback((image: GeneratedImage, blueprint: PrintifyBlueprint) => {
    // Create a minimal data structure to pass via URL
    try {
      const minimalData = {
        imageId: image.id,
        imageUrl: image.imageUrl,
        prompt: image.prompt,
        blueprintId: blueprint.id,
        blueprintTitle: blueprint.title,
        blueprintBrand: blueprint.brand,
        blueprintModel: blueprint.model,
        blueprintImages: blueprint.images?.[0] ? [blueprint.images[0]] : [],
        blueprintDescription: blueprint.description,
      };

      // Store in sessionStorage as backup
      sessionStorage.setItem('previewData', JSON.stringify(minimalData));

      // Also navigate with a flag
      router.push('/preview?ready=1');
    } catch (error) {
      console.error('Failed to store preview data:', error);
    }
  }, [router]);

  const handleCloseProductSelector = useCallback(() => {
    setImageToPublish(null);
  }, []);

  // Component to bridge PromptInput context with external file operations
  function FileInputManager() {
    const attachments = usePromptInputAttachments();

    // Store reference to attachment actions for external use
    useEffect(() => {
      window.__promptInputActions = {
        addFiles: attachments.add,
        clear: attachments.clear,
      };

      return () => {
        delete window.__promptInputActions;
      };
    }, [attachments]);

    return null;
  }

  /**
   * Handles form submission for both image generation and editing
   * - Text-only: generates new image using selected model
   * - Text + attachments: edits uploaded images using Gemini
   */
  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      const hasText = Boolean(message.text?.trim());
      const hasAttachments = Boolean(message.files?.length);

      // Require either text prompt or attachments
      if (!(hasText || hasAttachments)) {
        return;
      }

      const isEdit = hasAttachments;
      const prompt = message.text?.trim() || '';

      // Generate unique ID for this request
      const imageId = `img_${Date.now()}`;

      // Convert attachment blob URLs to permanent data URLs for persistent display
      const attachmentDataUrls =
        message.files && message.files.length > 0
          ? await Promise.all(
              message.files
                .filter(f => f.mediaType?.startsWith('image/'))
                .map(async f => {
                  try {
                    const response = await fetch(f.url);
                    const blob = await response.blob();
                    return await fileToDataUrl(
                      new File([blob], f.filename || 'image', {
                        type: f.mediaType,
                      })
                    );
                  } catch (error) {
                    console.error(
                      'Failed to convert attachment to data URL:',
                      error
                    );
                    return f.url; // fallback
                  }
                })
            )
          : undefined;

      // Create placeholder entry immediately for optimistic UI
      const placeholderImage: GeneratedImage = {
        id: imageId,
        prompt,
        model: model,
        timestamp: new Date(),
        attachments: attachmentDataUrls,
        isEdit,
        isLoading: true,
      };

      // Add to history immediately for responsive UI
      setImageHistory(prev => [placeholderImage, ...prev]);

      try {
        let imageUrl: ImageResponse['imageUrl'];

        if (isEdit) {
          const imageFiles =
            message.files?.filter(
              file =>
                file.mediaType?.startsWith('image/') || file.type === 'file'
            ) || [];

          if (imageFiles.length === 0) {
            throw new Error('No image files found in attachments');
          }

          try {
            const imageUrls = await Promise.all(
              imageFiles.map(async imageFile => {
                // Convert blob URL to data URL for API
                const response = await fetch(imageFile.url);
                const blob = await response.blob();
                return await fileToDataUrl(
                  new File([blob], 'image', { type: imageFile.mediaType })
                );
              })
            );

            const result = await editImage({
              prompt,
              imageUrls,
              provider: model,
            });
            imageUrl = result.imageUrl;
          } catch (error) {
            console.error('Error processing image files:', error);
            throw error;
          }
        } else {
          const result = await generateImage({ prompt, model });
          imageUrl = result.imageUrl;
        }

        // Update the existing placeholder entry with the result
        setImageHistory(prev =>
          prev.map(img =>
            img.id === imageId ? { ...img, imageUrl, isLoading: false } : img
          )
        );
      } catch (error) {
        console.error(
          `Error ${isEdit ? 'editing' : 'generating'} image:`,
          error
        );

        // Update the placeholder entry with error state
        setImageHistory(prev =>
          prev.map(img =>
            img.id === imageId
              ? {
                  ...img,
                  isLoading: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : 'Failed to generate image',
                }
              : img
          )
        );
      }
    },
    [model]
  );

  return (
    <div className="space-y-6">
      <PromptInput
        ref={promptInputRef}
        onSubmit={handleSubmit}
        className="relative"
        globalDrop
        multiple
        accept="image/*"
      >
        <FileInputManager />
        <PromptInputBody>
          <PromptInputAttachments>
            {attachment => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>
          <PromptInputTextarea placeholder="Describe the image you want to generate, or attach an image and describe how to edit it..." />
        </PromptInputBody>
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <PromptInputModelSelect
              onValueChange={value => {
                setModel(value as ModelOption);
              }}
              value={model}
            >
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue>
                  {models.find(m => m.id === model)?.name}
                </PromptInputModelSelectValue>
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {models.map(model => (
                  <PromptInputModelSelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{model.name}</div>
                      {(model.price || model.quality || model.speed) && (
                        <div className="text-xs text-gray-500 flex gap-2">
                          {model.price && <span>{model.price}</span>}
                          {model.quality && <span>{model.quality}</span>}
                          {model.speed && <span>{model.speed}</span>}
                        </div>
                      )}
                    </div>
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearForm}
              className="h-9 w-9 p-0"
            >
              <X size={16} />
            </Button>
            <PromptInputSubmit />
          </div>
        </PromptInputToolbar>
      </PromptInput>

      <ImageHistory
        imageHistory={imageHistory}
        onAddToInput={handleAddToInput}
        onPublish={handlePublishClick}
      />

      <ProductSelectorDialog
        image={imageToPublish}
        onClose={handleCloseProductSelector}
        onSelectProduct={handleProductSelect}
      />
    </div>
  );
}
