
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface GrowthTipsProps {
  growthTips: {
    dailyPractice: string;
    skillBuilding: string;
  };
}

const GrowthTips = ({ growthTips }: GrowthTipsProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Personalized Growth Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Daily Practice</h3>
            <p className="text-muted-foreground">{growthTips.dailyPractice}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Skill Development</h3>
            <p className="text-muted-foreground">{growthTips.skillBuilding}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthTips;
