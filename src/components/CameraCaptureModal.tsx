import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  RotateCcw,
  Check,
  X,
  AlertCircle,
  FlipHorizontal,
  Upload,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { UploadDocFile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: {
    mr: string;
    hi: string;
    en: string;
  };
  docKey: string;
  onCapture: (file: UploadDocFile) => void;
  onFallbackUpload: () => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  docKey,
  onCapture,
  onFallbackUpload,
}) => {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Stop camera tracks cleanly
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch { }
      });
      streamRef.current = null;
    }
  }, []);

  // Check available video devices
  const checkCameras = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      }
    } catch {
      setHasMultipleCameras(false);
    }
  }, []);

  // Start video stream
  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    stopStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsLoading(false);
      setErrorMessage(
        isMr
          ? 'तुमचा ब्राउझर थेट कॅमेरा सपोर्ट करत नाही. कृपया फाईल निवडा पर्याय वापरा.'
          : isHi
          ? 'आपका ब्राउज़र सीधे कैमरे का समर्थन नहीं करता है। कृपया फाइल चुनें विकल्प का उपयोग करें।'
          : 'Your browser does not support live camera access. Please use the Choose File option.'
      );
      return;
    }

    try {
      // 1. Try with preferred facingMode and high resolution
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
      } catch {
        // Fallback to basic video constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setIsLoading(false);
      await checkCameras();
    } catch (err: any) {
      console.error('Camera access error:', err);
      setIsLoading(false);
      let msg = isMr
        ? 'कॅमेरा सुरू करता आला नाही. कृपया कॅमेरा परवानगी तपासा किंवा फाईल अपलोड करा.'
        : isHi
        ? 'कैमरा शुरू नहीं किया जा सका। कृपया कैमरा अनुमति जांचें या फाइल अपलोड करें।'
        : 'Could not access camera. Please check camera permissions or upload a file.';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = isMr
          ? 'कॅमेरा परवानगी नाकारली गेली आहे. कृपया ब्राउझर सेटिंग्जमध्ये कॅमेरा परवानगी द्या.'
          : isHi
          ? 'कैमरा अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में कैमरा की अनुमति दें।'
          : 'Camera permission denied. Please allow camera access in browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = isMr
          ? 'कोणताही कॅमेरा सापडला नाही. कृपया वेबकॅम जोडा किंवा फाईल निवडा.'
          : isHi
          ? 'कोई कैमरा नहीं मिला। कृपया वेबकैम कनेक्ट करें या फाइल चुनें।'
          : 'No camera found. Please connect a webcam or choose an existing file.';
      }

      setErrorMessage(msg);
    }
  }, [facingMode, isMr, isHi, stopStream, checkCameras]);

  // Lifecycle when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startCamera();
    } else {
      stopStream();
      setCapturedImage(null);
    }

    return () => {
      stopStream();
    };
  }, [isOpen, startCamera, stopStream]);

  // Toggle front/back camera
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture snapshot from video stream
  const handleSnapPhoto = () => {
    if (!videoRef.current) return;

    // Visual shutter flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const video = videoRef.current;
    const naturalW = video.videoWidth || 1280;
    const naturalH = video.videoHeight || 720;

    // Constrain max dimension to 1600px for optimal speed and size
    const maxDimension = 1600;
    let targetW = naturalW;
    let targetH = naturalH;

    if (naturalW > maxDimension || naturalH > maxDimension) {
      if (naturalW > naturalH) {
        targetH = Math.round((naturalH * maxDimension) / naturalW);
        targetW = maxDimension;
      } else {
        targetW = Math.round((naturalW * maxDimension) / naturalH);
        targetH = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // If using user (front) camera, mirror horizontally for natural feel
    if (facingMode === 'user') {
      ctx.translate(targetW, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, targetW, targetH);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedImage(dataUrl);

    // Stop camera stream while reviewing snapshot
    stopStream();
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Confirm photo usage
  const handleConfirmPhoto = () => {
    if (!capturedImage) return;

    const estimatedBytes = Math.round((capturedImage.length * 3) / 4);
    const timestamp = Date.now();
    const cleanDocName = docKey.replace(/Doc$/, '');
    const filename = `${cleanDocName}_cam_${timestamp}.jpg`;

    const fileObj: UploadDocFile = {
      name: filename,
      mimeType: 'image/jpeg',
      base64: capturedImage,
      size: estimatedBytes,
    };

    onCapture(fileObj);
    onClose();
  };

  if (!isOpen) return null;

  const currentTitle = isMr ? documentTitle.mr : isHi ? documentTitle.hi : documentTitle.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0d182e] border border-blue-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-slate-700/60 bg-[#10203f]/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 shrink-0">
              <Camera size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white truncate font-devanagari">
                {currentTitle}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {isMr
                  ? 'कागदपत्र फ्रेममध्ये ठेवून स्पष्ट फोटो काढा'
                  : isHi
                  ? 'दस्तावेज़ को फ्रेम में रखकर स्पष्ट फोटो लें'
                  : 'Align document inside frame and capture a clear photo'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Viewfinder / Image Display Area */}
        <div className="relative flex-1 bg-black min-h-[300px] sm:min-h-[380px] max-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Shutter flash animation overlay */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-30 pointer-events-none opacity-80 transition-opacity duration-150" />
          )}

          {/* Loading state */}
          {isLoading && !errorMessage && !capturedImage && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/80 text-white">
              <Loader2 size={36} className="animate-spin text-blue-400" />
              <p className="text-xs sm:text-sm font-medium text-slate-300">
                {isMr ? 'कॅमेरा सुरू होत आहे...' : isHi ? 'कैमरा शुरू हो रहा है...' : 'Starting camera...'}
              </p>
            </div>
          )}

          {/* Error / Fallback state */}
          {errorMessage && !capturedImage && (
            <div className="p-6 text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
                <AlertCircle size={28} />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">
                  {isMr ? 'कॅमेरा त्रुटी' : isHi ? 'कैमरा त्रुटि' : 'Camera Access Issue'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-devanagari">
                  {errorMessage}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>{isMr ? 'पुन्हा प्रयत्न करा' : isHi ? 'पुनः प्रयास करें' : 'Try Again'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onFallbackUpload();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload size={14} />
                  <span>{isMr ? 'गॅलरी / फाईलमधून निवडा' : isHi ? 'गैलरी / फाइल से चुनें' : 'Choose File From Device'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Live Video Viewfinder */}
          {!capturedImage && !errorMessage && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-contain ${
                  facingMode === 'user' ? '-scale-x-100' : ''
                }`}
              />

              {/* Viewfinder overlay guide frame */}
              <div className="absolute inset-4 sm:inset-6 pointer-events-none flex flex-col items-center justify-between">
                {/* Top Corner brackets */}
                <div className="w-full flex justify-between">
                  <div className="w-8 h-8 border-t-3 border-l-3 border-blue-400 rounded-tl-lg shadow-sm" />
                  <div className="w-8 h-8 border-t-3 border-r-3 border-blue-400 rounded-tr-lg shadow-sm" />
                </div>

                {/* Center helper badge */}
                <div className="bg-black/60 backdrop-blur-xs border border-white/20 text-white/90 px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-lg">
                  <Sparkles size={11} className="text-amber-400" />
                  <span>
                    {isMr
                      ? 'कागदपत्र सरळ आणि स्पष्ट ठेवा'
                      : isHi
                      ? 'दस्तावेज़ सीधा और साफ रखें'
                      : 'Keep document straight and clear'}
                  </span>
                </div>

                {/* Bottom Corner brackets */}
                <div className="w-full flex justify-between">
                  <div className="w-8 h-8 border-b-3 border-l-3 border-blue-400 rounded-bl-lg shadow-sm" />
                  <div className="w-8 h-8 border-b-3 border-r-3 border-blue-400 rounded-br-lg shadow-sm" />
                </div>
              </div>
            </>
          )}

          {/* Captured Image Review */}
          {capturedImage && (
            <div className="w-full h-full flex items-center justify-center p-2 relative">
              <img
                src={capturedImage}
                alt="Captured document"
                className="max-h-[55vh] w-auto max-w-full object-contain rounded-xl shadow-lg border border-emerald-500/40"
              />
              <div className="absolute top-4 right-4 bg-emerald-500/90 text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                <Check size={12} />
                <span>{isMr ? 'फोटो तयार' : isHi ? 'फोटो तैयार' : 'Ready'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="p-3.5 sm:p-4 bg-[#10203f]/95 border-t border-slate-700/60 flex items-center justify-between gap-3">
          {capturedImage ? (
            /* Review mode controls */
            <div className="w-full flex items-center gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>{isMr ? 'पुन्हा काढा' : isHi ? 'दोबारा लें' : 'Retake'}</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
              >
                <Check size={16} />
                <span>{isMr ? 'हा फोटो वापरा' : isHi ? 'यह फोटो उपयोग करें' : 'Use This Photo'}</span>
              </button>
            </div>
          ) : !errorMessage ? (
            /* Live Capture controls */
            <div className="w-full flex items-center justify-between gap-4">
              {/* Left: Switch camera if multiple cameras */}
              <div className="w-20 flex justify-start">
                {hasMultipleCameras ? (
                  <button
                    type="button"
                    onClick={handleToggleFacingMode}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                    title={isMr ? 'कॅमेरा बदला' : isHi ? 'कैमरा बदलें' : 'Switch Camera'}
                  >
                    <FlipHorizontal size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onFallbackUpload();
                    }}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 text-xs cursor-pointer"
                    title={isMr ? 'फाईल निवडा' : isHi ? 'फाइल चुनें' : 'Choose file'}
                  >
                    <Upload size={14} />
                  </button>
                )}
              </div>

              {/* Center: Big Shutter Button */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleSnapPhoto}
                  disabled={isLoading}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 border-white/80 bg-blue-600 hover:bg-blue-500 active:scale-90 text-white flex items-center justify-center shadow-xl shadow-blue-500/40 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  title={isMr ? 'फोटो काढा' : isHi ? 'फोटो लें' : 'Take Photo'}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 group-hover:bg-white/30 transition flex items-center justify-center">
                    <Camera size={26} className="text-white" />
                  </div>
                </button>
                <span className="text-[10px] text-slate-400 mt-1 font-medium font-devanagari">
                  {isMr ? 'फोटो काढा' : isHi ? 'फोटो लें' : 'Click to Capture'}
                </span>
              </div>

              {/* Right: Close / Cancel */}
              <div className="w-20 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition cursor-pointer"
                >
                  {isMr ? 'रद्द करा' : isHi ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                {isMr ? 'बंद करा' : isHi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
