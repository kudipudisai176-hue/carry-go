import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, RefreshCw, Check, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface LiveCameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (image: string) => void;
}

export default function LiveCameraModal({ isOpen, onClose, onCapture }: LiveCameraModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const startCamera = async () => {
        try {
            setError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera access error:", err);
            setError("Could not access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
            setCapturedImage(null);
        }
        return () => stopCamera();
    }, [isOpen]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                setCapturedImage(dataUrl);
            }
        }
    };

    const handleConfirm = () => {
        if (capturedImage) {
            onCapture(capturedImage);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-10 rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-bold text-slate-900">Live Photo Capture</h2>
                        <p className="text-sm text-slate-500">Position your face clearly within the frame</p>
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900 shadow-inner">
                        {!capturedImage ? (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="h-full w-full object-cover grayscale-0"
                                />
                                {error && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-center p-4">
                                        <AlertCircle className="mb-2 h-10 w-10 text-red-500" />
                                        <p className="text-sm font-medium text-white">{error}</p>
                                        <Button onClick={startCamera} variant="secondary" className="mt-4">
                                            Try Again
                                        </Button>
                                    </div>
                                )}
                                <div className="absolute inset-0 pointer-events-none border-[3px] border-dashed border-white/20 m-8 rounded-[40px]" />
                            </>
                        ) : (
                            <img src={capturedImage} className="h-full w-full object-cover" />
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="mt-8 flex justify-center gap-4">
                        {!capturedImage ? (
                            <Button
                                onClick={handleCapture}
                                disabled={!!error || !stream}
                                className="h-16 w-16 rounded-full bg-purple-600 shadow-lg shadow-purple-600/30 transition-transform active:scale-90"
                            >
                                <Camera className="h-8 w-8 text-white" />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={() => setCapturedImage(null)}
                                    variant="outline"
                                    className="flex-1 rounded-2xl border-2 py-6 font-bold"
                                >
                                    <RefreshCw className="mr-2 h-5 w-5" /> Retake
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    className="flex-1 rounded-2xl bg-purple-600 py-6 font-bold shadow-lg shadow-purple-600/20"
                                >
                                    <Check className="mr-2 h-5 w-5" /> Confirm Photo
                                </Button>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
