
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings, Image as ImageIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';

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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
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
      </PopoverContent>
    </Popover>
  );
};

export default BackgroundSettings;
