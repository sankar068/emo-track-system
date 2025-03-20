
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

interface DevelopmentChartProps {
  chartData: Array<{ name: string; score: number }>;
}

const DevelopmentChart = ({ chartData }: DevelopmentChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 border border-border p-2 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="text-foreground font-medium">{label}</p>
          <p className="text-foreground">
            Score: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card col-span-2">
      <CardHeader>
        <CardTitle>Development Progress</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis 
              dataKey="name" 
              className="text-foreground"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              className="text-foreground"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Bar 
              dataKey="score" 
              fill="currentColor"
              className="fill-primary"
            >
              <LabelList 
                dataKey="score" 
                position="top" 
                className="fill-foreground"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DevelopmentChart;
