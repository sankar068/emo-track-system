
 import { Button } from "@/components/ui/button";
 import { useNavigate } from "react-router-dom";
 import { ThemeToggle } from "@/components/theme-toggle";
 import { LogOut } from "lucide-react";
 
 interface DashboardHeaderProps {
   handleLogout: () => void;
 }
 
 const DashboardHeader = ({ handleLogout }: DashboardHeaderProps) => {
   const navigate = useNavigate();
   
   return (
     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
       <h1 className="text-3xl font-bold text-foreground">Student Development Dashboard</h1>
       
       <div className="flex flex-wrap gap-2 items-center">
         <ThemeToggle />
         <Button onClick={() => navigate("/about")} variant="outline">About Us</Button>
         <Button onClick={() => navigate("/survey")} className="bg-primary hover:bg-primary/90">
           Take New Assessment
         </Button>
         <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
           <LogOut className="w-4 h-4" /> Logout
         </Button>
       </div>
     </div>
   );
 };
 
 export default DashboardHeader;
