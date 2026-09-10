import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Eraser, PenTool, Type, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SignaturePadProps {
  signature: string;
  signatureType: 'draw' | 'type';
  onChange: (signature: string, type: 'draw' | 'type') => void;
  fullName?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  signature,
  signatureType,
  onChange,
  fullName = '',
}) => {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [typedName, setTypedName] = useState(signatureType === 'type' ? signature : '');

  // Setup / resize canvas safely without overflowing container
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Calculate exact inner available width inside padding
    const containerStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(containerStyle.paddingRight) || 0;
    const innerWidth = container.clientWidth - paddingLeft - paddingRight;

    const displayWidth = Math.max(180, Math.floor(innerWidth > 0 ? innerWidth : canvas.getBoundingClientRect().width || 280));
    const displayHeight = 140;
    const dpr = window.devicePixelRatio || 1;

    // Preserve existing drawing if canvas already has content
    let existingDataUrl = '';
    if (signature && signatureType === 'draw' && signature.startsWith('data:image')) {
      existingDataUrl = signature;
    } else if (canvas.width > 0 && !canvas.dataset.cleared) {
      try {
        existingDataUrl = canvas.toDataURL('image/png');
      } catch {
        // ignore
      }
    }

    // Set internal canvas resolution
    canvas.width = Math.floor(displayWidth * dpr);
    canvas.height = Math.floor(displayHeight * dpr);

    // CSS size is strictly responsive 100% width to prevent ANY overflow
    canvas.style.width = '100%';
    canvas.style.maxWidth = '100%';
    canvas.style.height = `${displayHeight}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = '#0b2853';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (existingDataUrl) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
        };
        img.src = existingDataUrl;
      }
    }
  }, [signature, signatureType]);

  useEffect(() => {
    if (signatureType === 'draw') {
      // Delay slightly for DOM layout calculation
      const timer = setTimeout(() => {
        setupCanvas();
      }, 50);

      const container = containerRef.current;
      let observer: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined' && container) {
        observer = new ResizeObserver(() => {
          setupCanvas();
        });
        observer.observe(container);
      } else {
        window.addEventListener('resize', setupCanvas);
      }

      return () => {
        clearTimeout(timer);
        if (observer) {
          observer.disconnect();
        } else {
          window.removeEventListener('resize', setupCanvas);
        }
      };
    }
  }, [signatureType, setupCanvas]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = canvas.width / dpr;
    const logicalHeight = canvas.height / dpr;
    const scaleX = rect.width ? logicalWidth / rect.width : 1;
    const scaleY = rect.height ? logicalHeight / rect.height : 1;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    delete canvas.dataset.cleared;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current = true;
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onChange(dataUrl, 'draw');
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.dataset.cleared = 'true';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange('', 'draw');
  };

  const handleTypedChange = (val: string) => {
    setTypedName(val);
    onChange(val, 'type');
  };

  const useApplicantName = () => {
    if (fullName) {
      setTypedName(fullName);
      onChange(fullName, 'type');
    }
  };

  return (
    <div className="space-y-3 w-full max-w-full overflow-hidden">
      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <button
          type="button"
          onClick={() => onChange(signature, 'draw')}
          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center ${
            signatureType === 'draw'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <PenTool size={13} className="shrink-0" />
          <span className="truncate">{isMr ? 'स्वाक्षरी करा' : isHi ? 'हस्ताक्षर करें' : 'Draw Signature'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const initial = typedName || fullName;
            setTypedName(initial);
            onChange(initial, 'type');
          }}
          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center ${
            signatureType === 'type'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Type size={13} className="shrink-0" />
          <span className="truncate">{isMr ? 'नाव टाईप करा' : isHi ? 'नाम टाइप करें' : 'Type Name'}</span>
        </button>
      </div>

      {signatureType === 'draw' ? (
        <div
          ref={containerRef}
          className="w-full max-w-full relative border border-slate-300 rounded-xl p-2.5 sm:p-3 bg-slate-50 overflow-hidden box-border"
        >
          <canvas
            ref={canvasRef}
            className="w-full max-w-full h-[140px] bg-white rounded-lg border border-slate-200 cursor-crosshair block touch-none shadow-xs"
            style={{ touchAction: 'none' }}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
          />
          <div className="flex items-center justify-between gap-2 mt-2 text-[11px] text-slate-500">
            <span className="truncate pr-1 text-slate-600 font-medium font-devanagari text-[11px] sm:text-xs">
              {isMr
                ? '✍️ वर बोट किंवा माउसने स्वाक्षरी करा'
                : isHi
                ? '✍️ ऊपर उंगली अथवा माउस से हस्ताक्षर करें'
                : '✍️ Sign with your finger or mouse above'}
            </span>
            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 font-bold uppercase text-[10px] tracking-wider px-2.5 py-1 rounded-md hover:bg-red-50 shrink-0 border border-red-200/80 cursor-pointer bg-white transition-colors"
            >
              <Eraser size={12} />
              <span>{isMr ? 'साफ करा' : isHi ? 'साफ करें' : 'Clear'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 w-full max-w-full">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={typedName}
              onChange={(e) => handleTypedChange(e.target.value)}
              placeholder={
                isMr
                  ? 'डिजिटल स्वाक्षरीसाठी पूर्ण नाव प्रविष्ट करा'
                  : isHi
                  ? 'डिजिटल हस्ताक्षर हेतु पूरा नाम दर्ज करें'
                  : 'Enter full name for digital signature'
              }
              className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-blue-900 outline-none bg-white text-slate-900"
            />
            {fullName && (
              <button
                type="button"
                onClick={useApplicantName}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 flex items-center justify-center gap-1 shrink-0 cursor-pointer"
              >
                <Check size={13} />
                <span>
                  {isMr
                    ? `"${fullName}" वापरा`
                    : isHi
                    ? `"${fullName}" उपयोग करें`
                    : `Use "${fullName}"`}
                </span>
              </button>
            )}
          </div>
          {typedName && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center overflow-hidden">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">
                {isMr ? 'टाईप केलेली स्वाक्षरी' : isHi ? 'टाइप किया गया हस्ताक्षर' : 'Typed Signature Replica'}
              </span>
              <span className="font-serif italic font-bold text-xl text-blue-900 tracking-wider break-words block">
                {typedName}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
