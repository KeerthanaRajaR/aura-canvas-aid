import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { type UserData } from "@/utils/userData";

interface HealthProfileProps {
  userData: UserData;
}

const HealthProfile = ({ userData }: HealthProfileProps) => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5 text-primary" />
          Health Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Medical Conditions</h4>
            <p className="font-semibold">{userData.medical_conditions}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Physical Limitations</h4>
            <p className="font-semibold">{userData.physical_limitations}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Location</h4>
            <p className="font-semibold">{userData.city}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">User ID</h4>
            <p className="font-semibold">{userData.user_id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthProfile;
