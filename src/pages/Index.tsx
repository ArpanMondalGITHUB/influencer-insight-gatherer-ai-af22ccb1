import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Dashboard/Header';
import InfluencerGrid from '@/components/Dashboard/InfluencerGrid';
import AggregateStats from '@/components/Dashboard/AggregateStats';
import IntegrationSelector from '@/components/Dashboard/IntegrationSelector';
import { InfluencerData, GoogleSheetRow } from '@/types/influencer';
import { fetchMockInfluencerData, mockGoogleSheetsData, mockThirdPartyAPI } from '@/services/mockData';

const Index = () => {
  const [influencerData, setInfluencerData] = useState<InfluencerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiConnected, setApiConnected] = useState<{type: string; key: string} | null>(null);
  const { toast } = useToast();

  const fetchData = async (sheetUrl?: string) => {
    setIsLoading(true);
    try {
      console.log("Fetching data from Google Sheet:", sheetUrl || "Using mock data");
      
      let sheetData: GoogleSheetRow[] = mockGoogleSheetsData;
      
      if (apiConnected) {
        const enhancedData = await mockThirdPartyAPI(
          apiConnected.type,
          apiConnected.key,
          sheetData
        );
        setInfluencerData(enhancedData);
      } else {
        const basicData = await fetchMockInfluencerData(sheetData);
        setInfluencerData(basicData);
      }
      
      toast({
        title: "Data Fetched Successfully",
        description: "Influencer data has been retrieved and processed",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error Fetching Data",
        description: "An error occurred while fetching influencer data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAPI = (type: string, apiKey: string) => {
    setApiConnected({ type, key: apiKey });
    console.log(`API Connected: ${type} with key ${apiKey}`);
    
    if (influencerData.length > 0) {
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <Header onFetchData={fetchData} isLoading={isLoading} />
        
        {influencerData.length === 0 && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <IntegrationSelector onSelectAPI={handleSelectAPI} />
            
            <div className="text-center bg-card p-10 rounded-lg shadow-sm border border-border">
              <h2 className="text-xl font-semibold mb-4">Welcome to Influencer Insight AI</h2>
              <p className="text-muted-foreground mb-6">
                This tool helps you analyze Instagram and YouTube influencer data from a Google Sheet.
                Connect a data source and then click "Fetch Data" to get started.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>For demonstration purposes, you can use the mock data option.</p>
                <p className="mt-1">In a full implementation, this would connect to real APIs.</p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-pulse-slow">
              <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">Loading influencer data...</p>
          </div>
        )}
        
        {!isLoading && influencerData.length > 0 && (
          <>
            <AggregateStats data={influencerData} />
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Influencer Profiles</h2>
              {apiConnected && (
                <div className="text-sm text-muted-foreground">
                  Data provided by: <span className="font-medium">{apiConnected.type === "mock" ? "Mock Data (Demo)" : apiConnected.type}</span>
                </div>
              )}
            </div>
            
            <InfluencerGrid influencers={influencerData} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
