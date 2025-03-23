
 import { Button } from "@/components/ui/button";
 import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import { HelpCircle } from "lucide-react";
 
 interface WelcomeGuideProps {
   dismissWelcomeGuide: () => void;
 }
 
 const WelcomeGuide = ({ dismissWelcomeGuide }: WelcomeGuideProps) => {
   return (
     <Card className="glass-card mb-6 border-2 border-primary">
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <HelpCircle className="w-5 h-5" /> Welcome to Student Development Dashboard
         </CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
         <div className="space-y-2">
           <h3 className="font-semibold">Getting Started:</h3>
           <ul className="list-disc list-inside space-y-2 text-muted-foreground">
             <li>Take your first assessment to start tracking your progress</li>
             <li>View your development across different skills in the chart</li>
             <li>Get personalized growth tips based on your performance</li>
             <li>Track your improvements over time</li>
           </ul>
         </div>
         <div className="flex justify-end">
           <Button onClick={dismissWelcomeGuide} variant="outline">
             Got it, thanks!
           </Button>
         </div>
       </CardContent>
     </Card>
   );
 };
 
 export default WelcomeGuide;
