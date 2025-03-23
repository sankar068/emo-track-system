
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks, TrendingUp, Info } from "lucide-react";

interface ImprovementSuggestionsProps {
  areasWithDrawbacks: string[];
  chartData: Array<{ name: string; score: number }>;
}

const ImprovementSuggestions = ({ areasWithDrawbacks, chartData }: ImprovementSuggestionsProps) => {
  const getSpecificSuggestions = (area: string) => {
    const suggestions = {
      "Emotional Awareness": [
        "Practice daily journaling to identify your emotions",
        "Use emotion labeling exercises to increase vocabulary",
        "Try mindfulness meditation focused on emotions",
        "Discuss feelings with a trusted friend or therapist"
      ],
      "Social Skills": [
        "Join social groups or clubs aligned with your interests",
        "Practice active listening in conversations",
        "Role-play social scenarios with a friend",
        "Take a public speaking or improv class"
      ],
      "Self-Regulation": [
        "Develop a personal calming routine",
        "Practice deep breathing exercises",
        "Create a stress management plan",
        "Use the STOP technique (Stop, Take a breath, Observe, Proceed)"
      ],
      "Empathy": [
        "Read fiction from diverse perspectives",
        "Practice perspective-taking exercises",
        "Volunteer with different communities",
        "Ask open-ended questions in conversations"
      ],
      "Motivation": [
        "Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)",
        "Create a vision board",
        "Break large goals into smaller milestones",
        "Find an accountability partner"
      ],
      "Stress Management": [
        "Incorporate regular physical exercise",
        "Learn progressive muscle relaxation",
        "Practice time management techniques",
        "Create boundaries between work and personal life"
      ],
      "Communication": [
        "Practice assertive communication",
        "Take a communication skills workshop",
        "Record yourself speaking and review",
        "Ask for feedback on your communication style"
      ],
      "Adaptability": [
        "Purposely change your routine regularly",
        "Take on new challenges outside your comfort zone",
        "Practice reframing negative situations",
        "Develop a growth mindset through learning"
      ],
      "Self-Confidence": [
        "List your strengths and accomplishments",
        "Practice positive self-talk",
        "Set and achieve small goals to build confidence",
        "Take on leadership roles in safe environments"
      ],
      "Teamwork": [
        "Volunteer for group projects",
        "Practice giving constructive feedback",
        "Learn conflict resolution strategies",
        "Develop active listening in group settings"
      ]
    };

    return suggestions[area as keyof typeof suggestions] || [
      "Focus on understanding this area better",
      "Seek resources specific to this skill",
      "Consider professional development in this area",
      "Practice regularly to improve"
    ];
  };

  // Find lowest scoring areas
  const sortedAreas = [...chartData].sort((a, b) => a.score - b.score);
  const lowestScoringAreas = sortedAreas.slice(0, 3).map(area => area.name);

  return (
    <Card className="glass-card col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="w-5 h-5" /> Detailed Improvement Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={lowestScoringAreas[0] || "general"}>
          <TabsList className="mb-4">
            {lowestScoringAreas.map(area => (
              <TabsTrigger key={area} value={area}>{area}</TabsTrigger>
            ))}
            <TabsTrigger value="general">General Tips</TabsTrigger>
          </TabsList>

          {lowestScoringAreas.map(area => (
            <TabsContent key={area} value={area} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="text-lg font-semibold">Improvement Plan for {area}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <Info className="w-4 h-4 text-blue-400" /> Why This Matters
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Improving your {area.toLowerCase()} will enhance your overall emotional intelligence
                    and help you navigate both personal and professional situations more effectively.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Practical Suggestions</h4>
                  <ul className="space-y-2">
                    {getSpecificSuggestions(area).map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span className="text-sm">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Progress Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Set a goal to practice one suggestion daily for two weeks, then take another assessment
                    to measure your improvement.
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}
          
          <TabsContent value="general" className="space-y-4">
            <h3 className="text-lg font-semibold">General Improvement Tips</h3>
            <p className="text-sm text-muted-foreground">
              Consistency is key to improving emotional intelligence. Try to incorporate these practices into your daily routine:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">Set aside 15 minutes daily for reflection and emotional awareness</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">Practice active listening in every conversation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">Read books on emotional intelligence and personal development</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">Use the assessment tool regularly to track your progress</span>
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ImprovementSuggestions;
