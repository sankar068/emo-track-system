import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";

// Motivational quotes array
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
  const [stats, setStats] = useState({
    overallProgress: 0,
    assessmentsCompleted: 0,
    areasForImprovement: 0
  });
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Get random quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);

    // Load and process survey data
    const submissions = JSON.parse(localStorage.getItem('surveySubmissions') || '[]');
    if (submissions.length > 0) {
      const latestSubmission = submissions[submissions.length - 1].answers;
      
      // Process data for chart
      const processedData = Object.entries(latestSubmission).map(([id, score]) => ({
        name: questions.find(q => q.id === parseInt(id))?.category || '',
        score: Number(score)
      }));
      setChartData(processedData);

      // Calculate stats
      const totalScore = Object.values(latestSubmission).reduce((sum: number, score: any) => sum + Number(score), 0);
      const maxPossibleScore = Object.keys(latestSubmission).length * 5;
      const overallProgress = Math.round((totalScore / maxPossibleScore) * 100);
      const lowScores = Object.values(latestSubmission).filter((score: any) => Number(score) <= 2).length;

      setStats({
        overallProgress,
        assessmentsCompleted: submissions.length,
        areasForImprovement: lowScores
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Student Development Dashboard</h1>
          <Button 
            onClick={() => navigate("/survey")}
            className="bg-gray-700 hover:bg-gray-600"
          >
            Take New Assessment
          </Button>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Motivational Quote of the Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic text-gray-300">{quote}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card col-span-2">
            <CardHeader>
              <CardTitle>Development Progress</CardTitle>
            </CardHeader>
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
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400">Overall Progress</p>
                  <p className="text-2xl font-bold text-white">{stats.overallProgress}%</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400">Assessments Completed</p>
                  <p className="text-2xl font-bold text-white">{stats.assessmentsCompleted}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400">Areas for Improvement</p>
                  <p className="text-2xl font-bold text-white">{stats.areasForImprovement}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Growth Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">Daily Practice</h3>
                <p className="text-gray-400">Set aside 15 minutes each day for self-reflection and emotional awareness exercises.</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">Skill Building</h3>
                <p className="text-gray-400">Focus on one area of improvement at a time. Practice active listening and empathy in daily interactions.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Questions array for category mapping
const questions = [
  {
    id: 1,
    category: "Emotional Awareness",
  },
  {
    id: 2,
    category: "Social Skills",
  },
  {
    id: 3,
    category: "Self-Regulation",
  },
  {
    id: 4,
    category: "Empathy",
  },
  {
    id: 5,
    category: "Motivation",
  },
  {
    id: 6,
    category: "Stress Management",
  },
  {
    id: 7,
    category: "Communication",
  },
  {
    id: 8,
    category: "Adaptability",
  },
  {
    id: 9,
    category: "Self-Confidence",
  },
  {
    id: 10,
    category: "Teamwork",
  },
];

export default Dashboard;