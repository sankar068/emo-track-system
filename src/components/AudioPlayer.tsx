
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
 @@ -39,46 +40,84 @@ const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(({ initialTrack
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
       if (audioRef.current && isPlaying) {
         audioRef.current.pause();
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
         // Set the source before playing
         // Set the source before playing if it's not already set
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
         if (audioRef.current.src !== new URL(audioSource, window.location.href).href) {
           audioRef.current.src = audioSource;
           audioRef.current.load();
         }
 
         audioRef.current.onerror = (e) => {
           console.error("Audio loading error:", e);
           toast.error(`Failed to load ${relaxingSounds[currentTrack].name}`);
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
         };
         }
       }
     } catch (error) {
       console.error("Audio playback error:", error);
 @@ -100,22 +139,26 @@ const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(({ initialTrack
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
         audioRef.current.load();
 
         audioRef.current.onerror = (e) => {
           console.error("Audio loading error:", e);
           toast.error(`Failed to load ${relaxingSounds[next].name}`);
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
         };
         }
       } catch (error) {
         console.error("Audio playback error:", error);
         toast.error("Error playing next track");
 @@ -124,7 +167,7 @@ const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(({ initialTrack
     }
   };
 
   return <audio ref={audioRef} onEnded={nextTrack} />;
   return null;
 });
 
 AudioPlayer.displayName = 'AudioPlayer';
