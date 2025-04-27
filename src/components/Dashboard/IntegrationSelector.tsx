
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface IntegrationSelectorProps {
  onSelectAPI: (type: string, apiKey: string) => void;
}

const IntegrationSelector = ({ onSelectAPI }: IntegrationSelectorProps) => {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleConnect = () => {
    if (!selectedIntegration) {
      toast({
        title: "No integration selected",
        description: "Please select an integration first",
        variant: "destructive",
      });
      return;
    }
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key to connect",
        variant: "destructive",
      });
      return;
    }
    
    onSelectAPI(selectedIntegration, apiKey);
    toast({
      title: "Integration Connected",
      description: `Successfully connected to ${selectedIntegration}`,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Connect Data Source</CardTitle>
        <CardDescription>
          Connect to a third-party service to enhance influencer data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedIntegration === "hypeauditor" ? "default" : "outline"}
              onClick={() => setSelectedIntegration("hypeauditor")}
              className="flex-1"
            >
              HypeAuditor
            </Button>
            <Button 
              variant={selectedIntegration === "modash" ? "default" : "outline"}
              onClick={() => setSelectedIntegration("modash")}
              className="flex-1"
            >
              Modash
            </Button>
            <Button 
              variant={selectedIntegration === "mock" ? "default" : "outline"}
              onClick={() => setSelectedIntegration("mock")}
              className="flex-1"
            >
              Mock Data (Demo)
            </Button>
          </div>
          
          {selectedIntegration && (
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input 
                id="apiKey" 
                placeholder="Enter your API key" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {selectedIntegration === "mock" 
                  ? "Use any text as API key for the demo" 
                  : `Enter your ${selectedIntegration === "hypeauditor" ? "HypeAuditor" : "Modash"} API key`}
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleConnect} 
            disabled={!selectedIntegration || !apiKey}
            className="w-full"
          >
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationSelector;
