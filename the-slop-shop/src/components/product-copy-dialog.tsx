'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Skull } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface ProductCopyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (title: string, description: string) => void;
  currentTitle: string;
  currentDescription: string;
  prompt: string;
  productType: string;
}

export function ProductCopyDialog({
  isOpen,
  onClose,
  onApply,
  currentTitle,
  currentDescription,
  prompt,
  productType,
}: ProductCopyDialogProps) {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Sync with parent when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle);
      setDescription(currentDescription);
    }
  }, [isOpen, currentTitle, currentDescription]);

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

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsTyping(true);
    try {
      const response = await fetch('/api/generate-product-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          productType,
          stylePreference: 'slop',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate product copy');
      }

      const data = await response.json();

      await typeText(data.title, setTitle, titleInputRef);
      await typeText(data.description, setDescription, descriptionRef);
    } catch (error) {
      console.error('Error generating copy:', error);
    } finally {
      setIsGenerating(false);
      setIsTyping(false);
    }
  };

  const handleApply = () => {
    onApply(title, description);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden sm:rounded-2xl rounded-t-2xl sm:top-[50%] top-auto sm:bottom-auto bottom-0 sm:translate-y-[-50%] translate-y-0">
        {/* Mobile pull handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-semibold">Product Copy</DialogTitle>
            <p className="text-sm text-muted-foreground truncate">
              {productType}
            </p>
          </DialogHeader>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            variant="outline"
            className={`w-full h-14 text-base font-medium border-2 border-dashed hover:border-solid hover:bg-muted/50 transition-all ${isGenerating ? 'animate-pulse' : ''}`}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Skull className="h-5 w-5 animate-spin" />
                <span>Generating slop...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span>Generate Copy...</span>
              </span>
            )}
          </Button>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <div className="relative">
                <Input
                  ref={titleInputRef}
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Product title"
                  disabled={isTyping}
                  className="h-12 text-base pr-8"
                />
                {isTyping && title && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-foreground animate-blink" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <div className="relative">
                <Textarea
                  ref={descriptionRef}
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description"
                  rows={4}
                  disabled={isTyping}
                  className="text-base resize-none pr-8"
                />
                {isTyping && description && (
                  <div className="absolute right-3 bottom-3 w-0.5 h-5 bg-foreground animate-blink" />
                )}
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <Button
            onClick={handleApply}
            disabled={!title.trim() || isGenerating}
            className="w-full h-12 text-base font-medium"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
