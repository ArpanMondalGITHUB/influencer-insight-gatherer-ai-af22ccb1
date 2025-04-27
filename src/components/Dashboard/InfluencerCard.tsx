
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfluencerData, Platform } from "@/types/influencer";
import { Instagram, Youtube } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface InfluencerCardProps {
  influencer: InfluencerData;
}

const InfluencerCard = ({ influencer }: InfluencerCardProps) => {
  const PlatformIcon = influencer.platform === 'instagram' ? Instagram : Youtube;
  const platformColor = influencer.platform === 'instagram' ? 'text-dashboard-pink' : 'text-dashboard-red';
  
  // Format numbers with K/M suffix
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  // Prepare gender data for pie chart
  const genderData = [
    { name: 'Male', value: influencer.genderSplit.male },
    { name: 'Female', value: influencer.genderSplit.female },
    { name: 'Other', value: influencer.genderSplit.other },
  ];
  
  const GENDER_COLORS = ['#3b82f6', '#ec4899', '#8b5cf6'];

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="bg-card/50 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {influencer.profilePicture ? (
              <img 
                src={influencer.profilePicture} 
                alt={influencer.username}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <PlatformIcon className={`h-5 w-5 ${platformColor}`} />
              </div>
            )}
            <div>
              <CardTitle className="text-lg flex items-center">
                {influencer.username}
                <PlatformIcon className={`ml-1 h-4 w-4 ${platformColor}`} />
              </CardTitle>
              <div className="flex items-center text-xs text-muted-foreground space-x-1">
                <span>{influencer.location}</span>
                <span>•</span>
                <span>{influencer.contentLanguage}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-card/60">
            {formatNumber(influencer.followerCount)} followers
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-secondary/30 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">Avg. Views</div>
              <div className="font-semibold">{formatNumber(influencer.averageViews)}</div>
            </div>
            <div className="bg-secondary/30 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">Avg. Reach</div>
              <div className="font-semibold">{formatNumber(influencer.averageReach)}</div>
            </div>
            <div className="bg-secondary/30 p-2 rounded-md col-span-2">
              <div className="text-xs text-muted-foreground">Avg. Branded Views</div>
              <div className="font-semibold">{formatNumber(influencer.averageBrandedViews)}</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Gender Split</h4>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-right">
            Last updated: {new Date(influencer.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfluencerCard;
