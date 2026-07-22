import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Info, Palette, Layers, ArrowRightLeft, Pipette, Image, Contrast, Download, Compass, LayoutTemplate, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Coolash';
      case '/palette':
        return 'Palette Generator';
      case '/gradient':
        return 'Gradient Generator';
      case '/color-picker':
        return 'Color Picker';
      case '/image-picker':
        return 'Image Color Picker';
      case '/contrast':
        return 'Contrast Checker';
      default:
        return 'Coolash';
    }
  };

  const getPageIcon = () => {
    switch (location.pathname) {
      case '/palette':
        return <Palette className="h-6 w-6 text-white group-hover:text-primary transition-colors" />;
      case '/gradient':
        return <Layers className="h-6 w-6 text-white group-hover:text-primary transition-colors" />;
      case '/color-picker':
        return <Pipette className="h-6 w-6 text-white group-hover:text-primary transition-colors" />;
      case '/image-picker':
        return <Image className="h-6 w-6 text-white group-hover:text-primary transition-colors" />;
      case '/contrast':
        return <Contrast className="h-6 w-6 text-white group-hover:text-primary transition-colors" />;
      default:
        return <Palette className="h-6 w-6 text-white group-hover:text-primary transition-colors" />;
    }
  };

  const getSaveButtonText = () => {
    switch (location.pathname) {
      case '/palette':
        return 'Save Palette';
      case '/gradient':
        return 'Save Gradient';
      case '/color-picker':
        return 'Save Color';
      case '/image-picker':
        return 'Save Palette';
      case '/contrast':
        return 'Export Report';
      default:
        return 'Save';
    }
  };

  const shouldShowSaveButton = () => {
    return ['/palette', '/gradient', '/color-picker', '/image-picker', '/contrast'].includes(location.pathname);
  };

  const getSaveIcon = () => {
    switch (location.pathname) {
      case '/palette':
      case '/gradient':
        return <Heart className="h-4 w-4" />;
      case '/color-picker':
      case '/image-picker':
      case '/contrast':
        return <Download className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getCurrentPageHelpContent = () => {
    switch (location.pathname) {
      case '/palette':
        return (
          <>
            <h3 className="font-semibold pt-2">Palette Generator</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
              <li>Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Spacebar</kbd> or click <span className="font-semibold">Generate</span> to create a new palette.</li>
              <li>Click the <span className="font-semibold">Lock</span> icon on a swatch to keep it during generation.</li>
              <li>Switch color formats (HEX, RGB, HSL) using the selector.</li>
              <li>Click the <span className="font-semibold">Copy</span> icon on a swatch to copy its code.</li>
              <li>Click <span className="font-semibold">Export</span> to save or share the palette.</li>
            </ol>
          </>
        );
      case '/gradient':
        return (
          <>
            <h3 className="font-semibold pt-2">Gradient Generator</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
              <li>Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Spacebar</kbd> or click <span className="font-semibold">Generate Gradient</span> to create a new gradient.</li>
              <li>Click <span className="font-semibold">Export CSS</span> to view and copy the CSS code for the gradient.</li>
            </ol>
          </>
        );
      case '/color-picker':
        return (
          <>
            <h3 className="font-semibold pt-2">Color Picker</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
              <li>Select and explore colors with precision using the color picker interface.</li>
              <li>Switch between color formats (HEX, RGB, HSL) as needed.</li>
              <li>Click <span className="font-semibold">Save Color</span> to export the selected color.</li>
            </ol>
          </>
        );
      case '/image-picker':
        return (
          <>
            <h3 className="font-semibold pt-2">Image Color Picker</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
              <li>Upload an image to extract colors from.</li>
              <li>Click on the image to select specific colors or use automatic extraction.</li>
              <li>Click <span className="font-semibold">Save Palette</span> to export the extracted colors.</li>
            </ol>
          </>
        );
      case '/contrast':
        return (
          <>
            <h3 className="font-semibold pt-2">Contrast Checker</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
              <li>Select foreground and background colors to check contrast ratio.</li>
              <li>View accessibility ratings based on WCAG standards.</li>
              <li>Click <span className="font-semibold">Export Report</span> to save the contrast analysis.</li>
            </ol>
          </>
        );
      default:
        return (
          <>
            <p className="text-muted-foreground">
              Use the <span className="font-semibold">Tools</span> dropdown in the header to switch between different color tools.
            </p>
            <hr className="border-white/20" />
            <h3 className="font-semibold pt-2">Available Tools</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
              <li><span className="font-semibold">Palette Generator</span>: Create harmonious color palettes.</li>
              <li><span className="font-semibold">Gradient Generator</span>: Design stunning gradients.</li>
              <li><span className="font-semibold">Color Picker</span>: Select and explore colors with precision.</li>
              <li><span className="font-semibold">Image Color Picker</span>: Extract color palettes from uploaded images.</li>
              <li><span className="font-semibold">Contrast Checker</span>: Verify accessibility compliance for text/background combinations.</li>
            </ul>
          </>
        );
    }
  };
  
  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-950/70 backdrop-blur-md text-white px-4 py-3 flex justify-between items-center z-50 border-b border-white/10">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Palette className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
          <h1 className="font-semibold text-lg tracking-tight group-hover:text-white/80 transition-colors">Coolash</h1>
        </Link>
        
        {location.pathname !== '/' && (
          <>
            <ArrowRightLeft className="h-5 w-5 text-white/50" />
            <div className="flex items-center gap-2 group">
              {getPageIcon()}
              <div>
                <h1 className="font-bold text-xl transition-colors">{getPageTitle()}</h1>
                <p className="text-xs text-white/70">
                  {location.pathname === '/palette' && 'Create harmonious palettes'}
                  {location.pathname === '/gradient' && 'Design stunning gradients'}
                  {location.pathname === '/color-picker' && 'Select perfect colors'}
                  {location.pathname === '/image-picker' && 'Extract from images'}
                  {location.pathname === '/contrast' && 'Check accessibility'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <span className="hidden sm:inline">Tools</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/palette" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Palette Generator</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/gradient" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>Gradient Generator</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/color-picker" className="flex items-center gap-2">
                <Pipette className="h-4 w-4" />
                <span>Color Picker</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/image-picker" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span>Image Color Picker</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/contrast" className="flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                <span>Contrast Checker</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/visualizer" className="flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4" />
                <span>Palette Visualizer</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/explore" className="flex items-center gap-2">
                <Compass className="h-4 w-4" />
                <span>Explore</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/assistant" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Color Assistant</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">How to use</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">How to Use</DialogTitle>
              <DialogDescription>
                Tools and features available in Coolash
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-4 text-sm">
              <p className="text-muted-foreground">
                Use the <span className="font-semibold">Tools</span> dropdown in the header to switch between different color tools.
              </p>
              <hr className="border-white/20" />
              {getCurrentPageHelpContent()}
            </div>
          </DialogContent>
        </Dialog>
        
        {shouldShowSaveButton() && (
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            {getSaveIcon()}
            <span className="hidden sm:inline">{getSaveButtonText()}</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
