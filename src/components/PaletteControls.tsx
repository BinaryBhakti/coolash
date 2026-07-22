
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle, Download, Share2 } from 'lucide-react';
import { ColorFormat } from '@/utils/colorUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaletteControlsProps {
  onGenerate: () => void;
  onExport: () => void;
  activeFormat: ColorFormat;
  setActiveFormat: (format: ColorFormat) => void;
}

const PaletteControls = ({
  onGenerate,
  onExport,
  activeFormat,
  setActiveFormat,
}: PaletteControlsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-950/70 backdrop-blur-md border border-white/10 text-white rounded-full px-3 sm:px-6 py-3 flex items-center gap-2 sm:gap-4 z-10 max-w-[95vw] overflow-x-auto">
      <Button
        variant="ghost"
        size={isMobile ? "icon" : "sm"}
        onClick={onGenerate}
        className="flex items-center gap-2 hover:bg-white/20 whitespace-nowrap"
      >
        <Shuffle className="h-4 w-4" />
        <span className={isMobile ? "sr-only" : ""}>Generate</span>
        {!isMobile && <kbd className="bg-black/30 px-2 py-0.5 text-xs rounded">Space</kbd>}
      </Button>
      
      <div className="h-6 w-px bg-white/20" />
      
      <div className="flex gap-2 text-xs">
        <Button
          variant={activeFormat === ColorFormat.HEX ? "secondary" : "ghost"}
          size="sm"
          className={activeFormat === ColorFormat.HEX ? "bg-white text-black" : "hover:bg-white/20"}
          onClick={() => setActiveFormat(ColorFormat.HEX)}
        >
          HEX
        </Button>
        <Button
          variant={activeFormat === ColorFormat.RGB ? "secondary" : "ghost"}
          size="sm"
          className={activeFormat === ColorFormat.RGB ? "bg-white text-black" : "hover:bg-white/20"}
          onClick={() => setActiveFormat(ColorFormat.RGB)}
        >
          RGB
        </Button>
        <Button
          variant={activeFormat === ColorFormat.HSL ? "secondary" : "ghost"}
          size="sm"
          className={activeFormat === ColorFormat.HSL ? "bg-white text-black" : "hover:bg-white/20"}
          onClick={() => setActiveFormat(ColorFormat.HSL)}
        >
          HSL
        </Button>
      </div>
      
      <div className="h-6 w-px bg-white/20" />
      
      <Button
        variant="ghost"
        size={isMobile ? "icon" : "sm"}
        onClick={onExport}
        className="flex items-center gap-2 hover:bg-white/20 whitespace-nowrap"
      >
        <Download className="h-4 w-4" />
        <span className={isMobile ? "sr-only" : ""}>Export</span>
      </Button>
      
      <Button
        variant="ghost"
        size={isMobile ? "icon" : "sm"}
        className="flex items-center gap-2 hover:bg-white/20 whitespace-nowrap"
      >
        <Share2 className="h-4 w-4" />
        <span className={isMobile ? "sr-only" : ""}>Share</span>
      </Button>
    </div>
  );
};

export default PaletteControls;
