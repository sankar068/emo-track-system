
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MotivationalQuoteProps {
  quote: string;
}

const MotivationalQuote = ({ quote }: MotivationalQuoteProps) => {
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle>Motivational Quote of the Day</CardTitle></CardHeader>
      <CardContent><p className="text-lg italic text-gray-300">{quote}</p></CardContent>
    </Card>
  );
};

export default MotivationalQuote;
