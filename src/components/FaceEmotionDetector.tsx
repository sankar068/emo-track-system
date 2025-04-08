
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
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    startVideo,
    stopVideo,
    isRecording,
    emotions
  }));

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Show loading toast
        toast.info("Loading emotion detection models...");
        
        // Load models sequentially to prevent race conditions
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        
        setModelsLoaded(true);
        toast.success("Emotion detection models loaded successfully");
        console.log("Face detection models loaded successfully");
      } catch (error) {
        console.error("Error loading face detection models:", error);
        toast.error("Failed to load emotion detection models");
      }
    };
    
    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      if (!modelsLoaded) {
        toast.error("Models are still loading, please wait...");
        return;
      }
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user" 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                setIsRecording(true);
                detectEmotions();
                toast.success("Camera started successfully");
              })
              .catch(err => {
                console.error("Error playing video:", err);
                toast.error("Failed to start video playback");
              });
          }
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera. Please check camera permissions.");
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
      toast.info("Camera stopped");
    }
  };

  const detectEmotions = async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Adjust canvas size to match video dimensions
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const detectFace = async () => {
      if (!isRecording || !videoRef.current || !canvasRef.current) return;
      
      try {
        // Detect face with expressions
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 224 }))
          .withFaceExpressions();
          
        // Clear previous drawings
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
          
        // Resize detections to match display size
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        if (resizedDetections.length > 0) {
          // Get the first face (assuming single user)
          const face = resizedDetections[0];
          const expressions = face.expressions;
          
          // Find dominant emotion
          const dominantEmotion = Object.entries(expressions)
            .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
            
          // Draw bounding box
          const drawOptions = {
            lineWidth: 2,
            boxColor: 'rgba(0, 255, 0, 0.8)',
            label: dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1),
          };
          
          // Draw face detection results
          if (ctx) {
            // Draw rectangle around face
            ctx.strokeStyle = drawOptions.boxColor;
            ctx.lineWidth = drawOptions.lineWidth;
            ctx.strokeRect(
              face.detection.box.x, 
              face.detection.box.y, 
              face.detection.box.width, 
              face.detection.box.height
            );
            
            // Draw emotion label
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(
              face.detection.box.x, 
              face.detection.box.y - 30, 
              face.detection.box.width, 
              30
            );
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(
              drawOptions.label,
              face.detection.box.x + 5,
              face.detection.box.y - 10
            );
            
            // Show suggestion at bottom of canvas
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
            
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
              getSuggestion(dominantEmotion),
              canvas.width / 2,
              canvas.height - 15
            );
            
            setEmotions(dominantEmotion);
          }
        }
      } catch (error) {
        console.error("Error in face detection:", error);
      }
      
      // Continue detection loop
      if (isRecording) {
        requestAnimationFrame(detectFace);
      }
    };

    // Start detection loop
    detectFace();
  };

  const getSuggestion = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'angry':
        return 'Try deep breathing exercises to calm down';
      case 'sad':
        return 'Listen to uplifting music or reach out to a friend';
      case 'fearful':
        return 'Practice mindfulness and focus on the present moment';
      case 'disgusted':
        return 'Shift your attention to something pleasant';
      case 'surprised':
        return 'Take a moment to process what surprised you';
      case 'happy':
        return 'Share your joy with others around you';
      case 'neutral':
        return 'This is a good time for focused work or meditation';
      default:
        return 'Maintain awareness of your emotional state';
    }
  };

  return (
    <>
      {isRecording && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 mt-4 w-[300px] z-10">
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
          
          {emotions && (
            <div className="bg-background/80 backdrop-blur-sm p-2 mt-2 rounded-lg text-center">
              <p className="text-sm font-medium">
                Detected emotion: <span className="font-bold text-primary">{emotions.charAt(0).toUpperCase() + emotions.slice(1)}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
});

FaceEmotionDetector.displayName = 'FaceEmotionDetector';

export default FaceEmotionDetector;
