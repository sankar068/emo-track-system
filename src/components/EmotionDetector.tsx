
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

const EmotionDetector = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [emotions, setEmotions] = useState<string>('');

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
      videoRef.current!.srcObject = null;
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

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const dominantEmotion = Object.entries(detections.expressions)
          .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
        
        // Draw emotion text on canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)}`,
          canvas.width / 2,
          canvas.height - 15
        );
        
        setEmotions(dominantEmotion);
      }

      if (isRecording) {
        requestAnimationFrame(detectFace);
      }
    };

    video.addEventListener('play', detectFace);
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      <Card className="w-[300px] bg-background/95 backdrop-blur-sm border-primary">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full rounded-lg"
              style={{ display: isRecording ? 'block' : 'none' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            />
          </div>
          <div className="flex justify-center">
            {!isRecording ? (
              <Button
                onClick={startVideo}
                className="bg-primary hover:bg-primary/90"
              >
                <Camera className="mr-2 h-4 w-4" />
                Start Emotion Detection
              </Button>
            ) : (
              <Button
                onClick={stopVideo}
                variant="destructive"
              >
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Detection
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionDetector;
