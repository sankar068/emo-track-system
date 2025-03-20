
import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { toast } from 'sonner';

export interface AudioPlayerProps {
  initialTrack?: number;
}

export interface AudioPlayerRef {
  toggleSound: () => Promise<void>;
  nextTrack: () => Promise<void>;
  isPlaying: boolean;
  currentTrack: number;
  getCurrentTrackName: () => string;
}

const relaxingSounds = [
  { name: "Rain Sounds", url: "/audio/rain.mp3" },
  { name: "Ocean Waves", url: "/audio/ocean.mp3" },
  { name: "Forest Birds", url: "/audio/birds.mp3" },
];

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(({ initialTrack = 0 }, ref) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(initialTrack);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    toggleSound,
    nextTrack,
    isPlaying,
    currentTrack,
    getCurrentTrackName: () => relaxingSounds[currentTrack].name
  }));

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "auto";
      audioRef.current = audio;
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleSound = async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Set the source before playing
        const audioSource = relaxingSounds[currentTrack].url;
        console.log("Playing audio from:", audioSource);
        
        audioRef.current.src = audioSource;
        audioRef.current.oncanplay = async () => {
          try {
            await audioRef.current?.play();
            setIsPlaying(true);
            toast.success(`Playing: ${relaxingSounds[currentTrack].name}`);
          } catch (error) {
            console.error("Audio play error:", error);
            toast.error(`Failed to play ${relaxingSounds[currentTrack].name}`);
          }
        };
        
        audioRef.current.onerror = (e) => {
          console.error("Audio loading error:", e);
          toast.error(`Failed to load ${relaxingSounds[currentTrack].name}`);
          setIsPlaying(false);
        };
      }
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
        // Stop current audio
        audioRef.current.pause();
        
        // Set new source
        const audioSource = relaxingSounds[next].url;
        console.log("Switching to audio from:", audioSource);
        
        audioRef.current.src = audioSource;
        audioRef.current.oncanplay = async () => {
          try {
            await audioRef.current?.play();
            toast.success(`Playing: ${relaxingSounds[next].name}`);
          } catch (error) {
            console.error("Audio play error:", error);
            toast.error(`Failed to play ${relaxingSounds[next].name}`);
            setIsPlaying(false);
          }
        };
        
        audioRef.current.onerror = (e) => {
          console.error("Audio loading error:", e);
          toast.error(`Failed to load ${relaxingSounds[next].name}`);
          setIsPlaying(false);
        };
      } catch (error) {
        console.error("Audio playback error:", error);
        toast.error("Error playing next track");
        setIsPlaying(false);
      }
    }
  };

  return <audio ref={audioRef} onEnded={nextTrack} />;
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
