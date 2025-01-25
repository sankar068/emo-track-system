import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

// Importing Modal components (Assuming you have a Modal component in your UI library)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Motivational quotes array
const motivationalQuotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
];

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

// Type definitions for stats and growth tips
interface Stats {
  overallProgress: number;
  assessmentsCompleted: number;
  areasForImprovement: string[];
}

interface GrowthTips {
  dailyPractice: string;
  skillBuilding: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<{ name: string; score: number }[]>([]);
  const [stats, setStats] = useState<Stats>({
    overallProgress: 0,
    assessmentsCompleted: 0,
    areasForImprovement: []
  });
  const [quote, setQuote] = useState<string>("");
  const [growthTips, setGrowthTips] = useState<GrowthTips>({
    dailyPractice: "",
    skillBuilding: ""
  });
  const [userProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    joinedDate: new Date().toLocaleDateString()
  });
  
  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<string>("");

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
      const totalScore = Object.values(latestSubmission).reduce((sum: number, score: any) => Number(sum) + Number(score), 0);
      const maxPossibleScore = Object.keys(latestSubmission).length * 5;
      const overallProgress = Math.round((Number(totalScore) / Number(maxPossibleScore)) * 100);
      
      // Identify areas for improvement
      const lowScoreEntries = Object.entries(latestSubmission).filter(([id, score]: [string, any]) => Number(score) <= 2);
      const lowScoreCategories = lowScoreEntries.map(([id, score]: [string, any]) => {
        const category = questions.find(q => q.id === parseInt(id))?.category || '';
        return category;
      });

      setStats({
        overallProgress,
        assessmentsCompleted: submissions.length,
        areasForImprovement: lowScoreCategories
      });

      // Generate personalized growth tips based on scores
      const lowestScoreCategory = processedData.reduce((min, current) => 
        current.score < min.score ? current : min
      , processedData[0]);

      const highestScoreCategory = processedData.reduce((max, current) => 
        current.score > max.score ? current : max
      , processedData[0]);

      setGrowthTips({
        dailyPractice: generateDailyPracticeTip(lowestScoreCategory.name, overallProgress),
        skillBuilding: generateSkillBuildingTip(highestScoreCategory.name, lowestScoreCategory.name)
      });
    }
  }, []);

  // Helper function to generate daily practice tips
  const generateDailyPracticeTip = (weakestArea: string, progress: number): string => {
    if (progress < 40) {
      return Focus on improving your ${weakestArea.toLowerCase()} through daily reflection exercises and mindfulness practices.;
    } else if (progress < 70) {
      return Continue strengthening your ${weakestArea.toLowerCase()} skills by setting specific goals and tracking your progress daily.;
    } else {
      return Maintain your progress by incorporating advanced ${weakestArea.toLowerCase()} exercises into your daily routine.;
    }
  };

  // Helper function to generate skill building tips
  const generateSkillBuildingTip = (strongestArea: string, weakestArea: string): string => {
    return Leverage your strength in ${strongestArea.toLowerCase()} to improve your ${weakestArea.toLowerCase()}. Try combining activities that involve both areas for better results.;
  };

  // Handler for clicking on an area of improvement
  const handleAreaClick = (area: string) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  };

  // Content for individual area details (You can customize this as needed)
  const getAreaDetails = (area: string): string => {
    // Placeholder for detailed tips or information about the area
    return Here are some tips to improve your ${area.toLowerCase()}. Consider seeking resources, practicing regularly, and setting specific goals related to ${area.toLowerCase()}.;
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

        {/* Motivational Quote */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Motivational Quote of the Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic text-gray-300">{quote}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Development Progress Chart */}
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

          {/* Quick Stats */}
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
                {/* Areas for Improvement */}
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400">Areas for Improvement</p>
                  {stats.areasForImprovement.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {stats.areasForImprovement.map((area, index) => (
                        <li key={index}>
                          <button
                            onClick={() => handleAreaClick(area)}
                            className="text-lg font-semibold text-blue-400 hover:underline"
                          >
                            {area}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg font-semibold text-green-400">No areas for improvement!</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Tips */}
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

      {/* Modal for Area Details */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedArea}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p className="text-gray-700">{getAreaDetails(selectedArea)}</p>
            </DialogDescription>
            <div className="mt-4">
              <Button onClick={() => setIsModalOpen(false)} className="bg-blue-500 hover:bg-blue-400">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;
