import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

const HealthProfile = () => {
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
            <p className="font-semibold">None</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Physical Limitations</h4>
            <p className="font-semibold">Mobility Issues (mild)</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Location</h4>
            <p className="font-semibold">East John</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">User ID</h4>
            <p className="font-semibold">1001</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthProfile;
