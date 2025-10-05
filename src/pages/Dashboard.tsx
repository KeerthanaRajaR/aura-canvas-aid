import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, LayoutDashboard } from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import GlucoseChart from "@/components/dashboard/GlucoseChart";
import MoodChart from "@/components/dashboard/MoodChart";
import FoodLogger from "@/components/dashboard/FoodLogger";
import MealPlanner from "@/components/dashboard/MealPlanner";
import HealthProfile from "@/components/dashboard/HealthProfile";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [activeTab, setActiveTab] = useState<"dashboard" | "assistant">("dashboard");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/");
    } else {
      // Load user data from CSV
      setUserName("Tanya Ramsey"); // This would come from actual data
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                HealthCare <span className="text-primary">AI</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Welcome back, {userName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "dashboard"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("assistant")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "assistant"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === "dashboard" ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            <StatsCards />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlucoseChart />
              <MoodChart />
            </div>

            {/* Food Logger */}
            <FoodLogger />

            {/* Meal Planner */}
            <MealPlanner />

            {/* Health Profile */}
            <HealthProfile />
          </div>
        ) : (
          <div className="bg-card rounded-xl p-6 md:p-8 border border-border min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
            <p className="text-muted-foreground">
              Chat with your AI health assistant (Coming Soon)
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
