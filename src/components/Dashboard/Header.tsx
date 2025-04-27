
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Instagram, Youtube } from 'lucide-react';

interface HeaderProps {
  onFetchData: (sheetUrl?: string) => void;
  isLoading: boolean;
}

const Header = ({ onFetchData, isLoading }: HeaderProps) => {
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const { toast } = useToast();

  const handleFetchData = () => {
    if (!sheetUrl && !sheetUrl.includes('docs.google.com/spreadsheets')) {
      toast({
        title: "Invalid Google Sheet URL",
        description: "Please enter a valid Google Sheets URL",
        variant: "destructive",
      });
      return;
    }
    
    onFetchData(sheetUrl);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          Influencer Insight AI
          <span className="flex space-x-1 ml-2">
            <Instagram className="h-5 w-5 text-dashboard-pink" />
            <Youtube className="h-6 w-6 text-dashboard-red" />
          </span>
        </h1>
        <p className="text-muted-foreground">
          Analyze and visualize influencer data from multiple platforms
        </p>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
        <Input
          placeholder="Google Sheet URL"
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
          className="w-full md:w-80"
        />
        <Button 
          onClick={handleFetchData}
          disabled={isLoading}
          className="bg-dashboard-purple hover:bg-dashboard-purple/90"
        >
          {isLoading ? "Processing..." : "Fetch Data"}
        </Button>
      </div>
    </div>
  );
};

export default Header;
