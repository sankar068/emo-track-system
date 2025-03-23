
 import { useState } from 'react';
 import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 
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
 
   return (
     <Card className="glass-card">
       <CardHeader>
         <CardTitle>Statistics</CardTitle>
       </CardHeader>
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
             {showAreasForImprovement && (
               <div className="mt-2">
                 <p className="text-sm text-gray-400">Areas for Improvement:</p>
                 <ul className="list-disc list-inside">
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
