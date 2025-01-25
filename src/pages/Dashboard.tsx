import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { User } from "lucide-react";

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
  const [growthTips, setGrowthTips] = useState({
    dailyPractice: "",
    skillBuilding: ""
  });
  const [userProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    joinedDate: new Date().toLocaleDateString()
  });

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

      // Calculate stats - Fix for TypeScript error by ensuring numeric operations
      const totalScore = Object.values(latestSubmission).reduce((sum: number, score: any) => Number(sum) + Number(score), 0);
      const maxPossibleScore = Object.keys(latestSubmission).length * 5;
      const overallProgress = Math.round((Number(totalScore) / Number(maxPossibleScore)) * 100);
      const lowScores = Object.values(latestSubmission).filter((score: any) => Number(score) <= 2).length;

      setStats({
        overallProgress,
        assessmentsCompleted: submissions.length,
        areasForImprovement: lowScores
      });

      // Generate personalized growth tips based on scores
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
  }, []);

  // Helper function to generate daily practice tips
  const generateDailyPracticeTip = (weakestArea: string, progress: number) => {
    if (progress < 40) {
      return `Focus on improving your ${weakestArea.toLowerCase()} through daily reflection exercises and mindfulness practices.`;
    } else if (progress < 70) {
      return `Continue strengthening your ${weakestArea.toLowerCase()} skills by setting specific goals and tracking your progress daily.`;
    } else {
      return `Maintain your progress by incorporating advanced ${weakestArea.toLowerCase()} exercises into your daily routine.`;
    }
  };

  // Helper function to generate skill building tips
  const generateSkillBuildingTip = (strongestArea: string, weakestArea: string) => {
    return `Leverage your strength in ${strongestArea.toLowerCase()} to improve your ${weakestArea.toLowerCase()}. Try combining activities that involve both areas for better results.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Student Development Dashboard</h1>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate("/survey")}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Take New Assessment
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
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
                  <button
                    onClick={() => {
                      // Functionality to show assessment questions and highlight drawbacks
                      const areasWithDrawbacks = chartData.filter(data => data.score <= 2); // Areas with score <= 2
                      alert(
                        areasWithDrawbacks.length
                          ? `Areas with drawbacks:\n${areasWithDrawbacks.map(area => area.name).join(", ")}`
                          : "No significant drawbacks!"
                      );
                    }}
                    className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-gray-500 text-left"
                  >
                    <p className="text-sm text-gray-400">Areas for Improvement</p>
                    <p className="text-2xl font-bold text-white">{stats.areasForImprovement}</p>
                  </button>
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
                <p className="text-gray-400">{growthTips.dailyPractice}</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">Skill Building</h3>
                <p className="text-gray-400">{growthTips.skillBuilding}</p>
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
