
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Button } from '@/components/ui/button';
import { Camera, StopCircle, Music2, PauseCircle, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

const EmotionDetector = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [emotions, setEmotions] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const relaxingSounds = [
    { name: "Rain Sounds", url: "/audio/rain.mp3" },
    { name: "Ocean Waves", url: "/audio/ocean.mp3" },
    { name: "Forest Birds", url: "/audio/birds.mp3" },
  ];

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

  const toggleSound = async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = relaxingSounds[currentTrack].url;
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Audio playback error:", error);
      toast.error("Error playing audio. Please try again.");
    }
  };

  const nextTrack = async () => {
    const next = (currentTrack + 1) % relaxingSounds.length;
    setCurrentTrack(next);
    
    if (isPlaying && audioRef.current) {
      try {
        audioRef.current.src = relaxingSounds[next].url;
        await audioRef.current.play();
      } catch (error) {
        console.error("Audio playback error:", error);
        toast.error("Error playing next track");
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-background/95 backdrop-blur-sm border-b border-primary z-50 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
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

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={toggleSound}
          >
            {isPlaying ? (
              <><PauseCircle className="mr-2 h-4 w-4" /> Pause Music</>
            ) : (
              <><PlayCircle className="mr-2 h-4 w-4" /> Play Music</>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={nextTrack}
          >
            <Music2 className="mr-2 h-4 w-4" />
            Next Track
          </Button>
          <span className="text-sm text-muted-foreground">
            {relaxingSounds[currentTrack].name}
          </span>
        </div>

        <audio ref={audioRef} onEnded={nextTrack} />
      </div>

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
    </div>
  );
};

export default EmotionDetector;
