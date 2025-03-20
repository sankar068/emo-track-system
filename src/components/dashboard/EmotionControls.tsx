
import { Button } from "@/components/ui/button";
import { Camera, StopCircle, Music2, PauseCircle, PlayCircle } from "lucide-react";

interface EmotionControlsProps {
  isRecording: boolean;
  isPlaying: boolean;
  currentTrackName: string;
  startEmotionDetection: () => Promise<void>;
  stopEmotionDetection: () => void;
  toggleSound: () => Promise<void>;
  nextTrack: () => Promise<void>;
}

const EmotionControls = ({
  isRecording,
  isPlaying,
  currentTrackName,
  startEmotionDetection,
  stopEmotionDetection,
  toggleSound,
  nextTrack
}: EmotionControlsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {!isRecording ? (
        <Button
          onClick={startEmotionDetection}
          className="bg-primary hover:bg-primary/90"
        >
          <Camera className="mr-2 h-4 w-4" />
          Start Emotion Detection
        </Button>
      ) : (
        <Button
          onClick={stopEmotionDetection}
          variant="destructive"
        >
          <StopCircle className="mr-2 h-4 w-4" />
          Stop Detection
        </Button>
      )}

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
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={nextTrack}
        >
          <Music2 className="mr-2 h-4 w-4" />
          Next Track
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentTrackName}
        </span>
      </div>
    </div>
  );
};

export default EmotionControls;
