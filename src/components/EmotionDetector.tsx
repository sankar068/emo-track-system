
import { forwardRef, useRef, useImperativeHandle } from 'react';
import FaceEmotionDetector, { FaceEmotionDetectorRef } from './FaceEmotionDetector';
import AudioPlayer, { AudioPlayerRef } from './AudioPlayer';

interface EmotionDetectorProps {}

interface EmotionDetectorRef {
  startVideo: () => Promise<void>;
  stopVideo: () => void;
  toggleSound: () => Promise<void>;
  nextTrack: () => Promise<void>;
  isRecording: boolean;
  isPlaying: boolean;
  currentTrack: number;
  getCurrentTrackName: () => string;
}

const EmotionDetector = forwardRef<EmotionDetectorRef, EmotionDetectorProps>((props, ref) => {
  const faceDetectorRef = useRef<FaceEmotionDetectorRef>(null);
  const audioPlayerRef = useRef<AudioPlayerRef>(null);

  // Expose combined methods to parent component
  useImperativeHandle(ref, () => ({
    startVideo: async () => {
      if (faceDetectorRef.current) {
        await faceDetectorRef.current.startVideo();
      }
    },
    stopVideo: () => {
      if (faceDetectorRef.current) {
        faceDetectorRef.current.stopVideo();
      }
    },
    toggleSound: async () => {
      if (audioPlayerRef.current) {
        await audioPlayerRef.current.toggleSound();
      }
    },
    nextTrack: async () => {
      if (audioPlayerRef.current) {
        await audioPlayerRef.current.nextTrack();
      }
    },
    get isRecording() {
      return faceDetectorRef.current?.isRecording || false;
    },
    get isPlaying() {
      return audioPlayerRef.current?.isPlaying || false;
    },
    get currentTrack() {
      return audioPlayerRef.current?.currentTrack || 0;
    },
    getCurrentTrackName: () => {
      return audioPlayerRef.current?.getCurrentTrackName() || "Unknown";
    }
  }));

  return (
    <>
      <FaceEmotionDetector ref={faceDetectorRef} />
      <AudioPlayer ref={audioPlayerRef} />
    </>
  );
});

EmotionDetector.displayName = 'EmotionDetector';

export default EmotionDetector;
