import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, X } from "lucide-react";

interface ZoomControlProps {
  isOpen?: boolean;
  onClose?: () => void;
  onZoomChange?: (zoom: number) => void;
}

export function ZoomControl({ isOpen = false, onClose, onZoomChange }: ZoomControlProps) {
  const [zoom, setZoom] = useState(100);
  const controlRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 10, 200);
    setZoom(newZoom);
    applyZoom(newZoom);
    onZoomChange?.(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 10, 50);
    setZoom(newZoom);
    applyZoom(newZoom);
    onZoomChange?.(newZoom);
  };

  const handleReset = () => {
    setZoom(100);
    applyZoom(100);
    onZoomChange?.(100);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseInt(e.target.value);
    setZoom(newZoom);
    applyZoom(newZoom);
    onZoomChange?.(newZoom);
  };

  const applyZoom = (zoomLevel: number) => {
    const scale = zoomLevel / 100;
    
    // Apply width zoom to content container
    const zoomableContent = document.getElementById('zoomable-content');
    if (zoomableContent) {
      const adjustedWidth = scale * 100;
      (zoomableContent as HTMLElement).style.width = `${adjustedWidth}%`;
      (zoomableContent as HTMLElement).style.maxWidth = `${adjustedWidth}%`;
      (zoomableContent as HTMLElement).style.transition = "width 0.3s ease";
    }
    
    // Apply width zoom to navigation
    const zoomableNav = document.getElementById('zoomable-nav');
    if (zoomableNav) {
      const adjustedWidth = scale * 100;
      (zoomableNav as HTMLElement).style.width = `${adjustedWidth}%`;
      (zoomableNav as HTMLElement).style.transition = "width 0.3s ease";
    }
    
    // Apply width zoom to footer
    const zoomableFooter = document.getElementById('zoomable-footer');
    if (zoomableFooter) {
      const adjustedWidth = scale * 100;
      (zoomableFooter as HTMLElement).style.width = `${adjustedWidth}%`;
      (zoomableFooter as HTMLElement).style.transition = "width 0.3s ease";
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controlRef.current && !controlRef.current.contains(event.target as Node) && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={controlRef}
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-blue-500/30 dark:border-blue-400/30 rounded-full shadow-lg px-6 py-3"
      style={{ userSelect: 'none' }}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="h-8 w-8 p-0 rounded-full hover:bg-blue-500/10 dark:hover:bg-blue-400/10"
          disabled={zoom <= 50}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        {/* Volume-style slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[45px]">
            {zoom}%
          </span>
          <input
            type="range"
            min="50"
            max="200"
            value={zoom}
            onChange={handleSliderChange}
            className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${((zoom - 50) / 150) * 100}%, rgb(229 231 235) ${((zoom - 50) / 150) * 100}%, rgb(229 231 235) 100%)`
            }}
          />
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="h-8 w-8 p-0 rounded-full hover:bg-blue-500/10 dark:hover:bg-blue-400/10"
          disabled={zoom >= 200}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 px-3 rounded-full hover:bg-blue-500/10 dark:hover:bg-blue-400/10"
          title="Reset to 100%"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 rounded-full hover:bg-red-500/10"
          title="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: rgb(59 130 246);
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: rgb(59 130 246);
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
