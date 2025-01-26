import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">About Us</h1>
          <div className="flex gap-4">
            <ThemeToggle />
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">
              We are dedicated to helping students track and improve their emotional intelligence
              and personal development through comprehensive assessments and personalized feedback.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>What We Do</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide emotional intelligence assessments</li>
                <li>Track personal growth and development</li>
                <li>Offer personalized improvement suggestions</li>
                <li>Support continuous learning and adaptation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Privacy and data security</li>
                <li>Continuous improvement</li>
                <li>User-centered design</li>
                <li>Evidence-based approach</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Have questions or feedback? Reach out to us at{" "}
              <a href="mailto:support@emotracker.com" className="text-primary hover:underline">
                support@emotracker.com
              </a>
            </p>
            <p className="text-muted-foreground mt-4">
              Created with ❤️ by <span className="font-semibold text-primary">Team Sparkle..!</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;