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
import UnifiedChatbot from "@/components/dashboard/UnifiedChatbot"; // Changed import
import { getUserById, type UserData } from "@/utils/userData";
import { healthCheck } from "@/utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "assistant">("dashboard");
  const [backendStatus, setBackendStatus] = useState<boolean>(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/");
    } else {
      // Check backend status
      healthCheck().then(status => {
        setBackendStatus(status);
        if (!status) {
          console.warn("Backend is not available, using fallback data");
        }
      });
      
      // Load user data from backend or CSV
      getUserById(userId).then(user => {
        if (user) {
          setUserData(user);
          setUserName(`${user.first_name} ${user.last_name}`);
        }
      });
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
              {!backendStatus && (
                <p className="text-xs text-yellow-600">
                  Backend offline - using demo data
                </p>
              )}
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
              <span className="text-sm font-medium">Health Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === "dashboard" ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            {userData && <StatsCards userData={userData} />}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlucoseChart />
              <MoodChart />
            </div>

            {/* Food Logger */}
            <FoodLogger />

            {/* Meal Planner */}
            {userData && <MealPlanner userData={userData} />}

            {/* Health Profile */}
            {userData && <HealthProfile userData={userData} />}
          </div>
        ) : (
          userData && <UnifiedChatbot userData={userData} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;