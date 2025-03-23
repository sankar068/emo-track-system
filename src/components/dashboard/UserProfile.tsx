
 import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import { User } from "lucide-react";
 
 interface UserProfileProps {
   userProfile: {
     name: string;
     email: string;
     joinedDate: string;
   };
 }
 
 const UserProfile = ({ userProfile }: UserProfileProps) => {
   return (
     <Card className="glass-card">
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <User className="w-5 h-5" /> Profile Information
         </CardTitle>
       </CardHeader>
       <CardContent>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="p-4 bg-gray-800 rounded-lg">
             <p className="text-sm text-gray-400">Name</p>
             <p className="text-lg font-semibold text-white">{userProfile.name}</p>
           </div>
           <div className="p-4 bg-gray-800 rounded-lg">
             <p className="text-sm text-gray-400">Email</p>
             <p className="text-lg font-semibold text-white">{userProfile.email}</p>
           </div>
           <div className="p-4 bg-gray-800 rounded-lg">
             <p className="text-sm text-gray-400">Joined Date</p>
             <p className="text-lg font-semibold text-white">{userProfile.joinedDate}</p>
           </div>
         </div>
       </CardContent>
     </Card>
   );
 };
 
 export default UserProfile;
