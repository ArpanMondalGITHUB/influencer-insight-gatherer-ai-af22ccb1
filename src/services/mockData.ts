
import { InfluencerData, Platform } from "@/types/influencer";

// Create a set of realistic mock data for influencers
export const generateMockInfluencers = (count: number): InfluencerData[] => {
  const influencers: InfluencerData[] = [];
  
  const platforms: Platform[] = ['instagram', 'youtube'];
  const languages = ['English', 'Spanish', 'Hindi', 'French', 'German'];
  const locations = ['United States', 'India', 'United Kingdom', 'Canada', 'Australia', 'Brazil', 'Japan'];
  const states = ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'];
  
  const instagramUsernames = ['beauty_by_jane', 'travel_with_mike', 'tech_reviewer', 'fitness_pro', 'food_lover', 'lifestyle_guru'];
  const youtubeUsernames = ['TechReviews', 'GamingWithJosh', 'CookingMasters', 'FitnessJourney', 'TravelVlogs'];
  
  for (let i = 0; i < count; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const username = platform === 'instagram' 
      ? instagramUsernames[Math.floor(Math.random() * instagramUsernames.length)] + Math.floor(Math.random() * 1000)
      : youtubeUsernames[Math.floor(Math.random() * youtubeUsernames.length)] + Math.floor(Math.random() * 1000);
    
    const followerCountBase = platform === 'instagram' ? 10000 : 50000;
    const followerCount = Math.floor((Math.random() * 20 + 1) * followerCountBase);
    
    const male = Math.floor(Math.random() * 60) + 20;
    const female = Math.floor(Math.random() * (95 - male)) + 5;
    const other = 100 - male - female;
    
    const stateSplit: Record<string, number> = {};
    let remainingPercentage = 100;
    
    // Generate random state distribution
    const stateCount = Math.floor(Math.random() * 5) + 3;
    for (let j = 0; j < stateCount - 1; j++) {
      const state = states[Math.floor(Math.random() * states.length)];
      const percentage = j === stateCount - 2
        ? remainingPercentage
        : Math.floor(Math.random() * (remainingPercentage - (stateCount - j - 1))) + 1;
      
      stateSplit[state] = percentage;
      remainingPercentage -= percentage;
    }
    
    // Add last state with remaining percentage
    stateSplit[states[Math.floor(Math.random() * states.length)]] = remainingPercentage;
    
    // Generate age distribution
    const age1317 = Math.floor(Math.random() * 15);
    const age1824 = Math.floor(Math.random() * (50 - age1317)) + 20;
    const age2534 = Math.floor(Math.random() * (80 - age1317 - age1824)) + 10;
    const age3544 = Math.floor(Math.random() * (95 - age1317 - age1824 - age2534)) + 5;
    const age4554 = Math.floor(Math.random() * (100 - age1317 - age1824 - age2534 - age3544));
    const age55plus = 100 - age1317 - age1824 - age2534 - age3544 - age4554;
    
    const viewsMultiplier = platform === 'instagram' ? 0.2 : 0.1;
    const reachMultiplier = 1.2;
    const brandedMultiplier = platform === 'instagram' ? 0.8 : 0.6;
    
    influencers.push({
      id: `inf-${i+1}`,
      username,
      platform,
      followerCount,
      location: locations[Math.floor(Math.random() * locations.length)],
      contentLanguage: languages[Math.floor(Math.random() * languages.length)],
      averageViews: Math.floor(followerCount * viewsMultiplier),
      averageReach: Math.floor(followerCount * viewsMultiplier * reachMultiplier),
      averageBrandedViews: Math.floor(followerCount * viewsMultiplier * brandedMultiplier),
      genderSplit: { male, female, other },
      stateSplit,
      ageSplit: {
        '13-17': age1317,
        '18-24': age1824,
        '25-34': age2534,
        '35-44': age3544,
        '45-54': age4554,
        '55+': age55plus
      },
      lastUpdated: new Date().toISOString()
    });
  }
  
  return influencers;
};

// Simulate fetching from Google Sheets
export const mockGoogleSheetsData = [
  { id: '1', username: 'travel_mike', platform: 'instagram' as Platform },
  { id: '2', username: 'fitness_jane', platform: 'instagram' as Platform },
  { id: '3', username: 'TechReviewer', platform: 'youtube' as Platform },
  { id: '4', username: 'FoodieDelights', platform: 'youtube' as Platform },
  { id: '5', username: 'fashion_trends', platform: 'instagram' as Platform },
  { id: '6', username: 'GamingWithAlex', platform: 'youtube' as Platform },
  { id: '7', username: 'beauty_guru', platform: 'instagram' as Platform },
  { id: '8', username: 'DIYProjects', platform: 'youtube' as Platform },
];

// Mock API for fetching data
export const fetchMockInfluencerData = (
  sheetData = mockGoogleSheetsData
): Promise<InfluencerData[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate random data for each influencer in the sheet
      const influencers = sheetData.map((row) => {
        const followerCountBase = row.platform === 'instagram' ? 10000 : 50000;
        const followerCount = Math.floor((Math.random() * 20 + 1) * followerCountBase);
        
        const male = Math.floor(Math.random() * 60) + 20;
        const female = Math.floor(Math.random() * (95 - male)) + 5;
        const other = 100 - male - female;
        
        const locations = ['United States', 'India', 'United Kingdom', 'Canada', 'Australia'];
        const languages = ['English', 'Spanish', 'Hindi', 'French', 'German'];
        const states = ['California', 'New York', 'Texas', 'Florida', 'Illinois'];
        
        const stateSplit: Record<string, number> = {};
        let remainingPercentage = 100;
        
        // Generate random state distribution
        for (let i = 0; i < 4; i++) {
          const state = states[i];
          const percentage = i === 3
            ? remainingPercentage
            : Math.floor(Math.random() * (remainingPercentage - (4 - i - 1))) + 1;
          
          stateSplit[state] = percentage;
          remainingPercentage -= percentage;
        }
        
        // Add last state with remaining percentage
        stateSplit[states[4]] = remainingPercentage;
        
        // Generate age distribution
        const age1317 = Math.floor(Math.random() * 15);
        const age1824 = Math.floor(Math.random() * (50 - age1317)) + 20;
        const age2534 = Math.floor(Math.random() * (80 - age1317 - age1824)) + 10;
        const age3544 = Math.floor(Math.random() * (95 - age1317 - age1824 - age2534)) + 5;
        const age4554 = Math.floor(Math.random() * (100 - age1317 - age1824 - age2534 - age3544));
        const age55plus = 100 - age1317 - age1824 - age2534 - age3544 - age4554;
        
        const viewsMultiplier = row.platform === 'instagram' ? 0.2 : 0.1;
        const reachMultiplier = 1.2;
        const brandedMultiplier = row.platform === 'instagram' ? 0.8 : 0.6;
        
        return {
          id: row.id,
          username: row.username,
          platform: row.platform,
          followerCount,
          location: locations[Math.floor(Math.random() * locations.length)],
          contentLanguage: languages[Math.floor(Math.random() * languages.length)],
          averageViews: Math.floor(followerCount * viewsMultiplier),
          averageReach: Math.floor(followerCount * viewsMultiplier * reachMultiplier),
          averageBrandedViews: Math.floor(followerCount * viewsMultiplier * brandedMultiplier),
          genderSplit: { male, female, other },
          stateSplit,
          ageSplit: {
            '13-17': age1317,
            '18-24': age1824,
            '25-34': age2534,
            '35-44': age3544,
            '45-54': age4554,
            '55+': age55plus
          },
          lastUpdated: new Date().toISOString()
        };
      });
      
      resolve(influencers);
    }, 1500);
  });
};

// Mock third-party API services
export const mockThirdPartyAPI = (
  apiType: string, 
  apiKey: string, 
  influencers: any[]
): Promise<InfluencerData[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      console.log(`Connecting to ${apiType} with key ${apiKey}`);
      
      // In a real app, this would make real API calls to the chosen service
      // For now, we're just enhancing our mock data
      const enhancedData = generateMockInfluencers(influencers.length);
      
      // Add the username and platform from the original data
      const finalData = enhancedData.map((enhanced, index) => {
        if (index < influencers.length) {
          return {
            ...enhanced,
            id: influencers[index].id,
            username: influencers[index].username,
            platform: influencers[index].platform
          };
        }
        return enhanced;
      });
      
      resolve(finalData);
    }, 2000);
  });
};
