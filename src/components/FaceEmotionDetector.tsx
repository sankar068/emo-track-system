
import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'sonner';

export interface FaceEmotionDetectorProps {}

export interface FaceEmotionDetectorRef {
  startVideo: () => Promise<void>;
  stopVideo: () => void;
  isRecording: boolean;
  emotions: string;
}

const FaceEmotionDetector = forwardRef<FaceEmotionDetectorRef, FaceEmotionDetectorProps>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [emotions, setEmotions] = useState<string>('');

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    startVideo,
    stopVideo,
    isRecording,
    emotions
  }));

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
        toast.success("Emotion detection models loaded");
      } catch (error) {
        toast.error("Error loading emotion detection models");
      }
    };
    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsRecording(true);
        detectEmotions();
      }
    } catch (error) {
      toast.error("Unable to access camera");
    }
  };

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsRecording(false);
      setEmotions('');
    }
  };

  const detectEmotions = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const detectFace = async () => {
      if (!isRecording) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const detections = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detections) {
          const dominantEmotion = Object.entries(detections.expressions)
            .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            `${dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)}`,
            canvas.width / 2,
            canvas.height - 35
          );
          
          ctx.font = '14px Arial';
          ctx.fillText(
            getSuggestion(dominantEmotion),
            canvas.width / 2,
            canvas.height - 15
          );
          
          setEmotions(dominantEmotion);
        }
      } catch (error) {
        console.error("Face detection error:", error);
      }

      if (isRecording) {
        requestAnimationFrame(detectFace);
      }
    };

    video.addEventListener('play', detectFace);
    return () => {
      video.removeEventListener('play', detectFace);
    };
  };

  const getSuggestion = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'angry':
        return 'Try deep breathing exercises';
      case 'sad':
        return 'Listen to uplifting music';
      case 'fearful':
        return 'Practice mindfulness';
      case 'stressed':
        return 'Take a short break';
      default:
        return 'Maintain your positive state';
    }
  };

  return (
    <>
      {isRecording && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 mt-4 w-[300px]">
          <div className="relative rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full rounded-lg"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
});

FaceEmotionDetector.displayName = 'FaceEmotionDetector';

export default FaceEmotionDetector;
