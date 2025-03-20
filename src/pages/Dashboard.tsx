import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import EmotionDetector from "@/components/EmotionDetector";
import BackgroundSettings from '@/components/BackgroundSettings';
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EmotionControls from "@/components/dashboard/EmotionControls";
import WelcomeGuide from "@/components/dashboard/WelcomeGuide";
import UserProfile from "@/components/dashboard/UserProfile";
import AssessmentPrompt from "@/components/dashboard/AssessmentPrompt";
import MotivationalQuote from "@/components/dashboard/MotivationalQuote";
import DevelopmentChart from "@/components/dashboard/DevelopmentChart";
import StatisticsCard from "@/components/dashboard/StatisticsCard";
import GrowthTips from "@/components/dashboard/GrowthTips";

const questions = [
  { id: 1, question: "How well do you understand and manage your emotions?", category: "Emotional Awareness" },
  { id: 2, question: "How comfortable are you in social situations?", category: "Social Skills" },
  { id: 3, question: "How well can you control your impulses and behaviors?", category: "Self-Regulation" },
  { id: 4, question: "How well do you understand others' feelings?", category: "Empathy" },
  { id: 5, question: "How motivated are you to achieve your goals?", category: "Motivation" },
  { id: 6, question: "How well do you handle stress and pressure?", category: "Stress Management" },
  { id: 7, question: "How effectively do you communicate with others?", category: "Communication" },
  { id: 8, question: "How well do you adapt to change?", category: "Adaptability" },
  { id: 9, question: "How confident are you in your abilities?", category: "Self-Confidence" },
  { id: 10, question: "How well do you work in team settings?", category: "Teamwork" },
];

const motivationalQuotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({ overallProgress: 0, assessmentsCompleted: 0, areasForImprovement: 0 });
  const [quote, setQuote] = useState("");
  const [userProfile, setUserProfile] = useState({ name: "", email: "", joinedDate: "" });
  const [areasWithDrawbacks, setAreasWithDrawbacks] = useState([]);
  const [growthTips, setGrowthTips] = useState({ dailyPractice: "", skillBuilding: "" });
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(true);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTrackName, setCurrentTrackName] = useState("Rain Sounds");
  const emotionDetectorRef = useRef(null);

  useEffect(() => {
    setStats({ 
      overallProgress: 0, 
      assessmentsCompleted: 0, 
      areasForImprovement: 0 
    });

    setChartData([]);
    setAreasWithDrawbacks([]);
    setGrowthTips({
      dailyPractice: "",
      skillBuilding: ""
    });

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (currentUser && currentUser.email) {
      setUserProfile({
        name: currentUser.name || '',
        email: currentUser.email || '',
        joinedDate: currentUser.joinedDate || new Date().toLocaleDateString()
      });

      const hasSeenGuide = localStorage.getItem(`${currentUser.email}_hasSeenGuide`);
      setShowWelcomeGuide(!hasSeenGuide);
    } else {
      navigate('/login');
    }
    
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);

    const submissions = JSON.parse(localStorage.getItem('surveySubmissions') || '[]');
    setHasCompletedAssessment(submissions.length > 0);
    if (submissions.length > 0) {
      const latestSubmission = submissions[submissions.length - 1].answers;
      
      const processedData = Object.entries(latestSubmission).map(([id, score]) => ({
        name: questions.find(q => q.id === parseInt(id))?.category || '',
        score: Number(score)
      }));
      setChartData(processedData);

      const totalScore = Object.values(latestSubmission).reduce((sum, score) => Number(sum) + Number(score), 0);
      const maxPossibleScore = Object.keys(latestSubmission).length * 5;
      const overallProgress = Math.round((Number(totalScore) / Number(maxPossibleScore)) * 100);
      const lowScores = Object.values(latestSubmission).filter(score => Number(score) <= 2).length;
      const areasWithLowScores = processedData.filter(data => data.score <= 2).map(area => area.name);
      setAreasWithDrawbacks(areasWithLowScores);
      setStats({ overallProgress, assessmentsCompleted: submissions.length, areasForImprovement: lowScores });

      if (processedData.length > 0) {
        const lowestScoreCategory = processedData.reduce((min, current) => 
          current.score < min.score ? current : min
        );

        const highestScoreCategory = processedData.reduce((max, current) => 
          current.score > max.score ? current : max
        );

        setGrowthTips({
          dailyPractice: generateDailyPracticeTip(lowestScoreCategory.name, overallProgress),
          skillBuilding: generateSkillBuildingTip(highestScoreCategory.name, lowestScoreCategory.name)
        });
      }
    }
  }, [navigate]);

  const generateDailyPracticeTip = (weakestArea: string, progress: number) => {
    return `Focus on ${weakestArea} for at least 15 minutes daily. Your current progress is ${progress}%.`;
  };

  const generateSkillBuildingTip = (strongestArea: string, weakestArea: string) => {
    return `Leverage your strength in ${strongestArea} to improve in ${weakestArea}. Consider joining a workshop or group activity.`;
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('surveySubmissions');
    navigate('/login');
  };

  const dismissWelcomeGuide = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.email) {
      localStorage.setItem(`${currentUser.email}_hasSeenGuide`, 'true');
      setShowWelcomeGuide(false);
      toast.success("Welcome guide dismissed! You can always find help in the About section.");
    }
  };

  const startEmotionDetection = async () => {
    if (emotionDetectorRef.current && typeof emotionDetectorRef.current.startVideo === 'function') {
      await emotionDetectorRef.current.startVideo();
      setIsRecording(true);
    }
  };

  const stopEmotionDetection = () => {
    if (emotionDetectorRef.current && typeof emotionDetectorRef.current.stopVideo === 'function') {
      emotionDetectorRef.current.stopVideo();
      setIsRecording(false);
    }
  };

  const toggleSound = async () => {
    if (emotionDetectorRef.current && typeof emotionDetectorRef.current.toggleSound === 'function') {
      await emotionDetectorRef.current.toggleSound();
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = async () => {
    if (emotionDetectorRef.current && typeof emotionDetectorRef.current.nextTrack === 'function') {
      await emotionDetectorRef.current.nextTrack();
      const next = (currentTrack + 1) % 3;
      setCurrentTrack(next);
      
      if (emotionDetectorRef.current.getCurrentTrackName) {
        setCurrentTrackName(emotionDetectorRef.current.getCurrentTrackName());
      }
    }
  };

  return (
    <div className="min-h-screen bg-background/80 backdrop-blur-sm p-6">
      <EmotionDetector ref={emotionDetectorRef} />
      
      <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
        <DashboardHeader handleLogout={handleLogout} />

        <EmotionControls
          isRecording={isRecording}
          isPlaying={isPlaying}
          currentTrackName={currentTrackName}
          startEmotionDetection={startEmotionDetection}
          stopEmotionDetection={stopEmotionDetection}
          toggleSound={toggleSound}
          nextTrack={nextTrack}
        />

        {showWelcomeGuide && <WelcomeGuide dismissWelcomeGuide={dismissWelcomeGuide} />}

        <UserProfile userProfile={userProfile} />

        {hasCompletedAssessment ? (
          <>
            <MotivationalQuote quote={quote} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DevelopmentChart chartData={chartData} />
              <StatisticsCard 
                stats={stats} 
                areasWithDrawbacks={areasWithDrawbacks}
              />
            </div>

            <GrowthTips growthTips={growthTips} />
          </>
        ) : (
          <AssessmentPrompt />
        )}
      </div>
      <BackgroundSettings />
    </div>
  );
};

export default Dashboard;
