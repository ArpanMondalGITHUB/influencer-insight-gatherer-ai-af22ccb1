
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfluencerData } from "@/types/influencer";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AggregateStatsProps {
  data: InfluencerData[];
}

const AggregateStats = ({ data }: AggregateStatsProps) => {
  if (data.length === 0) return null;

  // Calculate aggregate stats
  const totalFollowers = data.reduce((sum, item) => sum + item.followerCount, 0);
  const avgViews = Math.round(data.reduce((sum, item) => sum + item.averageViews, 0) / data.length);
  const avgReach = Math.round(data.reduce((sum, item) => sum + item.averageReach, 0) / data.length);
  const avgBrandedViews = Math.round(data.reduce((sum, item) => sum + item.averageBrandedViews, 0) / data.length);
  
  // Aggregate gender split
  const totalMale = data.reduce((sum, item) => sum + item.genderSplit.male, 0);
  const totalFemale = data.reduce((sum, item) => sum + item.genderSplit.female, 0);
  const totalOther = data.reduce((sum, item) => sum + item.genderSplit.other, 0);
  const total = totalMale + totalFemale + totalOther;
  
  const genderData = [
    { name: 'Male', value: Math.round((totalMale / total) * 100) },
    { name: 'Female', value: Math.round((totalFemale / total) * 100) },
    { name: 'Other', value: Math.round((totalOther / total) * 100) },
  ];
  
  // Aggregate age split
  const ageKeys = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'] as const;
  const ageData = ageKeys.map(ageGroup => {
    const total = data.reduce((sum, item) => sum + (item.ageSplit[ageGroup] || 0), 0);
    return {
      name: ageGroup,
      value: Math.round((total / data.length))
    };
  });
  
  // Platform split
  const instagramCount = data.filter(item => item.platform === 'instagram').length;
  const youtubeCount = data.filter(item => item.platform === 'youtube').length;
  
  const platformData = [
    { name: 'Instagram', value: instagramCount },
    { name: 'YouTube', value: youtubeCount },
  ];
  
  // Colors for charts
  const GENDER_COLORS = ['#3b82f6', '#ec4899', '#8b5cf6'];
  const PLATFORM_COLORS = ['#ec4899', '#ff0000'];
  const AGE_COLORS = ['#3b82f6', '#8b5cf6', '#14b8a6', '#ec4899', '#f97316', '#eab308'];

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overview Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-secondary/30 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Total Influencers</div>
                <div className="font-semibold text-lg">{data.length}</div>
              </div>
              <div className="bg-secondary/30 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Total Followers</div>
                <div className="font-semibold text-lg">{formatNumber(totalFollowers)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-secondary/30 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Avg. Views</div>
                <div className="font-semibold">{formatNumber(avgViews)}</div>
              </div>
              <div className="bg-secondary/30 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Avg. Reach</div>
                <div className="font-semibold">{formatNumber(avgReach)}</div>
              </div>
              <div className="bg-secondary/30 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Branded</div>
                <div className="font-semibold">{formatNumber(avgBrandedViews)}</div>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-1">Platform Distribution</h4>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} influencers`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gender Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Age Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Bar dataKey="value" name="Percentage">
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AggregateStats;
