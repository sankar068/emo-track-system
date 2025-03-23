
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
  const [audioLoaded, setAudioLoaded] = useState(false);
 
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    toggleSound,
    nextTrack,
    isPlaying,
    currentTrack,
    getCurrentTrackName: () => relaxingSounds[currentTrack].name
  }));

  // Initialize audio on mount
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "auto";
      
      // Set up audio event listeners
      audio.addEventListener('canplaythrough', () => {
        setAudioLoaded(true);
      });
      
      audio.addEventListener('error', (e) => {
        console.error("Audio error:", e);
        setAudioLoaded(false);
        toast.error(`Failed to load audio: ${e.message || 'Unknown error'}`);
      });

      audioRef.current = audio;
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        }
        
        audioRef.current.removeEventListener('canplaythrough', () => {});
        audioRef.current.removeEventListener('error', () => {});
      }
    };
  }, []);

  // Pre-load the initial track
  useEffect(() => {
    if (audioRef.current && !audioLoaded) {
      try {
        const audioSource = relaxingSounds[currentTrack].url;
        audioRef.current.src = audioSource;
        audioRef.current.load();
      } catch (error) {
        console.error("Error pre-loading audio:", error);
      }
    }
  }, [currentTrack, audioLoaded]);

  const toggleSound = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        toast.info(`Paused: ${relaxingSounds[currentTrack].name}`);
      } else {
        // Set the source before playing if it's not already set
        const audioSource = relaxingSounds[currentTrack].url;
        console.log("Playing audio from:", audioSource);

        if (audioRef.current.src !== new URL(audioSource, window.location.href).href) {
          audioRef.current.src = audioSource;
          audioRef.current.load();
        }

        try {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                toast.success(`Playing: ${relaxingSounds[currentTrack].name}`);
              })
              .catch(error => {
                console.error("Audio play error:", error);
                toast.error(`Failed to play ${relaxingSounds[currentTrack].name}: ${error.message}`);
                setIsPlaying(false);
              });
          }
        } catch (error) {
          console.error("Audio play error:", error);
          toast.error(`Failed to play ${relaxingSounds[currentTrack].name}`);
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      toast.error("Error controlling audio playback");
    }
  };

  const nextTrack = async () => {
    if (!audioRef.current) return;

    try {
      const next = (currentTrack + 1) % relaxingSounds.length;
      setCurrentTrack(next);
      
      // If we're playing, switch to the next track immediately
      if (isPlaying) {
        const audioSource = relaxingSounds[next].url;
        console.log("Switching to audio from:", audioSource);

        audioRef.current.src = audioSource;
        audioRef.current.load();

        try {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                toast.success(`Playing: ${relaxingSounds[next].name}`);
              })
              .catch(error => {
                console.error("Audio play error:", error);
                toast.error(`Failed to play ${relaxingSounds[next].name}: ${error.message}`);
                setIsPlaying(false);
              });
          }
        } catch (error) {
          console.error("Audio play error:", error);
          toast.error(`Failed to play ${relaxingSounds[next].name}`);
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      toast.error("Error playing next track");
    }
  };

  return null;
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
