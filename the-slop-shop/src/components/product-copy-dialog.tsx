'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface ProductCopyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (title: string, description: string) => void;
  currentTitle: string;
  currentDescription: string;
  prompt: string;
  productType: string;
}

type StylePreference = 'sardonic' | 'witty' | 'straightforward' | 'absurd' | 'unhinged' | 'luxury' | 'conspiracy' | 'shakespearean' | 'motivational' | 'noir';

const STYLE_OPTIONS: { value: StylePreference; label: string; description: string }[] = [
  {
    value: 'sardonic',
    label: 'Sardonic',
    description: 'Ironic, self-aware, dripping with dry humor',
  },
  {
    value: 'witty',
    label: 'Witty',
    description: 'Clever wordplay and playful humor',
  },
  {
    value: 'straightforward',
    label: 'Straightforward',
    description: 'Clean, professional, hint of personality',
  },
  {
    value: 'absurd',
    label: 'Absurd',
    description: 'Weird, surreal, delightfully nonsensical',
  },
  {
    value: 'unhinged',
    label: 'Unhinged',
    description: '7 energy drinks, no sleep, pure chaos',
  },
  {
    value: 'luxury',
    label: 'Luxury Parody',
    description: 'Pretentious haute couture marketing speak',
  },
  {
    value: 'conspiracy',
    label: 'Conspiracy',
    description: 'Hidden meanings, secret knowledge',
  },
  {
    value: 'shakespearean',
    label: 'Shakespearean',
    description: 'Overly dramatic theatrical prose',
  },
  {
    value: 'motivational',
    label: 'Motivational',
    description: 'Life-changing transformative hustle energy',
  },
  {
    value: 'noir',
    label: 'Detective Noir',
    description: 'Hard-boiled, moody, mysterious',
  },
];

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
  const [stylePreference, setStylePreference] = useState<StylePreference>('sardonic');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-product-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          productType,
          existingTitle: title,
          existingDescription: description,
          stylePreference,
          customInstructions: customInstructions.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate product copy');
      }

      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
    } catch (error) {
      console.error('Error generating copy:', error);
      // Keep existing values on error
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    onApply(title, description);
    onClose();
  };

  const handleReset = () => {
    setTitle(currentTitle);
    setDescription(currentDescription);
    setCustomInstructions('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] sm:max-h-[90vh] max-h-[85vh] overflow-y-auto sm:rounded-lg rounded-t-2xl sm:top-[50%] top-auto sm:bottom-auto bottom-0 sm:translate-y-[-50%] translate-y-0"
        onInteractOutside={(e) => {
          // Prevent closing on mobile when clicking overlay during scroll
          if (typeof window !== 'undefined' && window.innerWidth < 640) {
            e.preventDefault();
          }
        }}
      >
        {/* Mobile pull handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 -mt-6">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Customize Product Copy</DialogTitle>
          <DialogDescription className="text-sm">
            <span className="italic">&ldquo;{prompt}&rdquo;</span> · {productType}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Style Preference */}
          <div className="space-y-2">
            <Label htmlFor="style" className="text-sm">Writing Style</Label>
            <Select
              value={stylePreference}
              onValueChange={(value) => setStylePreference(value as StylePreference)}
            >
              <SelectTrigger id="style" className="min-h-[4rem] h-auto py-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                {STYLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="py-3">
                    <div className="flex flex-col items-start text-left gap-0.5">
                      <span className="font-medium text-sm">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-sm">Custom Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Give the AI specific directions..."
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or edit manually
              </span>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product title"
                disabled={isGenerating}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description"
                rows={3}
                disabled={isGenerating}
                className="resize-none text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={handleApply}
              disabled={!title.trim() || isGenerating}
              className="flex-1"
            >
              Apply Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
