import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

// Questions array (shared with Survey component)
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
  const [showAreasForImprovement, setShowAreasForImprovement] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.email) {
      setUserProfile({
        name: currentUser.name || '',
        email: currentUser.email || '',
        joinedDate: currentUser.joinedDate || new Date().toLocaleDateString()
      });
    } else {
      navigate('/login');
    }

    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);

    const submissions = JSON.parse(localStorage.getItem('surveySubmissions') || '[]');
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
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const toggleAreasForImprovement = () => {
    setShowAreasForImprovement(!showAreasForImprovement);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Student Development Dashboard</h1>
          <div className="flex gap-4">
            <ThemeToggle />
            <Button onClick={() => navigate("/about")} variant="outline">About Us</Button>
            <Button onClick={() => navigate("/survey")} className="bg-primary hover:bg-primary/90">Take New Assessment</Button>
            <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-lg font-semibold text-white">{userProfile.name}</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-lg font-semibold text-white">{userProfile.email}</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Joined Date</p>
                <p className="text-lg font-semibold text-white">{userProfile.joinedDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Progress & Motivational Quote */}
        {chartData.length > 0 ? (
          <>
            <Card className="glass-card">
              <CardHeader><CardTitle>Motivational Quote of the Day</CardTitle></CardHeader>
              <CardContent><p className="text-lg italic text-gray-300">{quote}</p></CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card col-span-2">
                <CardHeader><CardTitle>Development Progress</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#4B5563" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader><CardTitle>Statistics</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Overall Progress</p>
                      <p className="text-2xl font-bold">{stats.overallProgress}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Assessments Completed</p>
                      <p className="text-2xl font-bold">{stats.assessmentsCompleted}</p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                        onClick={toggleAreasForImprovement}
                      >
                        {showAreasForImprovement ? "Hide Areas for Improvement" : "Show Areas for Improvement"}
                      </Button>
                      {showAreas
