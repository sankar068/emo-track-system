
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Settings, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const defaultBackgrounds = [
  { id: 1, url: 'https://source.unsplash.com/1506744038136-46273834b3fb', name: 'Nature' },
  { id: 2, url: 'https://source.unsplash.com/1482881497185-d4a9ddbe4151', name: 'Desert' },
  { id: 3, url: 'https://source.unsplash.com/1439337153520-7082a56a81f4', name: 'Architecture' },
];

const BackgroundSettings = () => {
  const [customBackground, setCustomBackground] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundChange = (backgroundUrl: string) => {
    document.body.style.backgroundImage = `url(${backgroundUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    setCustomBackground(backgroundUrl);
    toast.success('Background updated successfully');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleBackgroundChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={cn(
            "z-50 w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          sideOffset={5}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Background Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {defaultBackgrounds.map((bg) => (
                  <div
                    key={bg.id}
                    className="relative cursor-pointer group"
                    onClick={() => handleBackgroundChange(bg.url)}
                  >
                    <img
                      src={bg.url}
                      alt={bg.name}
                      className="w-full h-24 object-cover rounded-md transition-transform hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                      <p className="text-white text-sm font-medium">{bg.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Custom Background
                </Button>
              </div>
            </CardContent>
          </Card>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default BackgroundSettings;
