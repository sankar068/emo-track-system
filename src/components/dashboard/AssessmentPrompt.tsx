
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";

const AssessmentPrompt = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="glass-card">
      <CardContent className="p-6 text-center">
        <div className="space-y-4">
          <HelpCircle className="w-12 h-12 mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Welcome to Your Development Journey!</h2>
          <p className="text-muted-foreground">
            Please take your assessment to unlock your development progress and personalized growth tips.
          </p>
          <Button onClick={() => navigate("/survey")} className="bg-primary hover:bg-primary/90">
            Start Your Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentPrompt;
