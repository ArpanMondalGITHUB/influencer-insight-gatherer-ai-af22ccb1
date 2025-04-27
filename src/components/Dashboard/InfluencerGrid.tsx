
import { InfluencerData } from "@/types/influencer";
import InfluencerCard from "./InfluencerCard";

interface InfluencerGridProps {
  influencers: InfluencerData[];
}

const InfluencerGrid = ({ influencers }: InfluencerGridProps) => {
  if (influencers.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No influencer data available</p>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      {influencers.map((influencer) => (
        <InfluencerCard key={influencer.id} influencer={influencer} />
      ))}
    </div>
  );
};

export default InfluencerGrid;
