
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, TrendingUp, TrendingDown, Info } from "lucide-react";

interface StatisticsCardProps {
  stats: {
    overallProgress: number;
    assessmentsCompleted: number;
    areasForImprovement: number;
  };
  areasWithDrawbacks: string[];
}

const StatisticsCard = ({ stats, areasWithDrawbacks }: StatisticsCardProps) => {
  const [showAreasForImprovement, setShowAreasForImprovement] = useState(false);

  const toggleAreasForImprovement = () => {
    setShowAreasForImprovement(!showAreasForImprovement);
  };

  // Generate improvement status
  const getImprovementStatus = (progress: number) => {
    if (progress <= 30) return { text: "Needs significant improvement", icon: <TrendingDown className="w-4 h-4 text-destructive" /> };
    if (progress <= 60) return { text: "Making progress", icon: <TrendingUp className="w-4 h-4 text-amber-500" /> };
    return { text: "Good progress", icon: <TrendingUp className="w-4 h-4 text-green-500" /> };
  };

  const status = getImprovementStatus(stats.overallProgress);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Overall Progress</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{stats.overallProgress}%</p>
              <Badge variant="outline" className="flex items-center gap-1">
                {status.icon} {status.text}
              </Badge>
            </div>
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
            {showAreasForImprovement && (
              <div className="mt-2">
                <p className="text-sm text-gray-400 flex items-center gap-1 mb-2">
                  <Info className="w-4 h-4" /> Areas for Improvement:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {areasWithDrawbacks.map(area => (
                    <li key={area} className="text-gray-300">{area}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
