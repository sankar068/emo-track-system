import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const questions = [
  {
    id: 1,
    question: "How well do you understand and manage your emotions?",
    category: "Emotional Awareness",
  },
  {
    id: 2,
    question: "How comfortable are you in social situations?",
    category: "Social Skills",
  },
  {
    id: 3,
    question: "How well can you control your impulses and behaviors?",
    category: "Self-Regulation",
  },
  {
    id: 4,
    question: "How well do you understand others' feelings?",
    category: "Empathy",
  },
  {
    id: 5,
    question: "How motivated are you to achieve your goals?",
    category: "Motivation",
  },
  {
    id: 6,
    question: "How well do you handle stress and pressure?",
    category: "Stress Management",
  },
  {
    id: 7,
    question: "How effectively do you communicate with others?",
    category: "Communication",
  },
  {
    id: 8,
    question: "How well do you adapt to change?",
    category: "Adaptability",
  },
  {
    id: 9,
    question: "How confident are you in your abilities?",
    category: "Self-Confidence",
  },
  {
    id: 10,
    question: "How well do you work in team settings?",
    category: "Teamwork",
  },
];

const Survey = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const navigate = useNavigate();

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: parseInt(value) });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    console.log("Survey answers:", answers);
    toast.success("Assessment completed successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Student Development Assessment
            </CardTitle>
            <div className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium">
              {questions[currentQuestion].question}
            </div>
            <div className="text-sm text-gray-500">
              Category: {questions[currentQuestion].category}
            </div>
            <RadioGroup
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-3">
                  <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                  <Label htmlFor={`rating-${value}`} className="text-sm">
                    {value === 1 && "Poor"}
                    {value === 2 && "Fair"}
                    {value === 3 && "Good"}
                    {value === 4 && "Very Good"}
                    {value === 5 && "Excellent"}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Survey;