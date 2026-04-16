import { MonetizationFramework } from './MonetizationEngine';

export interface ForecastResult {
  expectedROI_Percent: number;
  revenueRange: { min: number; max: number };
  confidenceScore: number;
}

export class ForecastingEngine {
  /**
   * Predicts ROI, estimates revenue bounds, and outputs a confidence score based on modeled constraints.
   */
  async predictROI(monetizationParams: MonetizationFramework, trends: any[]): Promise<ForecastResult> {
    
    // Base traffic assumption modeled off momentum
    let expectedTraffic = 10000;
    let trendMomentumMultiplier = 1.0;

    if (trends && trends.length > 0) {
        trendMomentumMultiplier = trends.reduce((acc, t) => acc + (t.momentum || 1.0), 0) / trends.length;
        expectedTraffic = Math.floor(expectedTraffic * trendMomentumMultiplier);
    }

    // Conversion defaults based on Offer Type complexity (Coaching vs $17 ebook)
    let conversionRate = 0.01;
    if (monetizationParams.basePrice > 1000) conversionRate = 0.002;
    if (monetizationParams.offerType === 'AFFILIATE' || monetizationParams.basePrice < 30) conversionRate = 0.025;

    const projectedCustomers = expectedTraffic * conversionRate;
    const baseRevenue = projectedCustomers * monetizationParams.expectedLTV;

    const confidenceScore = Math.min((trendMomentumMultiplier * 60) + 20, 98.5); // ranges 20 to 98.5

    return {
        expectedROI_Percent: Math.floor((baseRevenue / (expectedTraffic * 0.05)) * 100), // generic mock CPL ROI proxy
        revenueRange: { 
            min: Math.floor(baseRevenue * 0.7), 
            max: Math.floor(baseRevenue * 1.5) 
        },
        confidenceScore: parseFloat(confidenceScore.toFixed(2))
    };
  }
}

export const forecastingEngine = new ForecastingEngine();
