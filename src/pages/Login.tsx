import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const userIdNum = parseInt(userId);
    
    if (userIdNum >= 1001 && userIdNum <= 1100) {
      // Verify user exists in CSV
      try {
        const response = await fetch('/data/users.csv');
        const csvText = await response.text();
        const userExists = csvText.includes(`${userId},`);
        
        if (userExists) {
          localStorage.setItem("userId", userId);
          toast({
            title: "Login Successful",
            description: "Welcome to HealthCare AI",
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "User Not Found",
            description: "User ID not found in database",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        toast({
          title: "Error",
          description: "Failed to verify user",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Invalid User ID",
        description: "Please enter a valid User ID (1001 - 1100)",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-accent-light p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-2xl p-8 md:p-10 border border-border">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center">
              <Activity className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            HealthCare <span className="text-primary">AI</span>
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Your personalized health companion
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium mb-2">
                Enter Your User ID
              </label>
              <Input
                id="userId"
                type="text"
                placeholder="e.g., 1001"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary-dark"
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Valid User IDs: 1001 - 1100
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
