import * as tf from '@tensorflow/tfjs';
import type { Lead } from '@/types';

export class AIService {
  private static instance: AIService;
  private model: tf.LayersModel | null = null;
  private modelLoaded: boolean = false;
  private modelLoading: boolean = false;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async loadModel() {
    if (this.modelLoaded || this.modelLoading) return;
    
    this.modelLoading = true;
    try {
      // Create and compile the model
      const model = tf.sequential();
      
      model.add(tf.layers.dense({
        units: 64,
        activation: 'relu',
        inputShape: [5],
      }));
      
      model.add(tf.layers.dropout({ rate: 0.2 }));
      
      model.add(tf.layers.dense({
        units: 32,
        activation: 'relu',
      }));
      
      model.add(tf.layers.dense({
        units: 3, // [conversionProbability, recommendedPrice, complexity]
        activation: 'sigmoid',
      }));

      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['accuracy'],
      });

      // Train the model with some initial data
      const trainingData = tf.tensor2d([
        [1, 1, 1, 1, 1], // High value features
        [0, 0, 0, 0, 0], // Low value features
        [0.5, 0.5, 0.5, 0.5, 0.5], // Medium value features
      ]);

      const trainingLabels = tf.tensor2d([
        [0.9, 0.8, 0.7], // High probability, high price, high complexity
        [0.2, 0.3, 0.2], // Low probability, low price, low complexity
        [0.5, 0.5, 0.5], // Medium values
      ]);

      await model.fit(trainingData, trainingLabels, {
        epochs: 50,
        batchSize: 32,
        shuffle: true,
        validationSplit: 0.2,
      });

      this.model = model;
      this.modelLoaded = true;
      console.log('TensorFlow model loaded and trained successfully');
    } catch (error) {
      console.error('Error loading TensorFlow model:', error);
      throw error;
    } finally {
      this.modelLoading = false;
    }
  }

  private extractFeatures(lead: Lead): tf.Tensor2D {
    // Feature extraction logica
    const features = [
      lead.max_quotes / 5,
      lead.email && lead.phone ? 1 : 0,
      // ... andere features
    ]
    return tf.tensor2d([features])
  }

  private parseBudgetRange(budget: string): number {
    const ranges: { [key: string]: number } = {
      '500-1000': 750,
      '1000-2500': 1750,
      '2500-5000': 3750,
      '5000-10000': 7500,
      '10000-20000': 15000,
      '20000+': 25000,
    };
    return ranges[budget] || 5000;
  }

  private parseTimeline(timeline: string): number {
    const timelines: { [key: string]: number } = {
      'Zo snel mogelijk': 1,
      '1-2 maanden': 0.8,
      '2-3 maanden': 0.6,
      '3-6 maanden': 0.4,
      '6+ maanden': 0.2,
    };
    return timelines[timeline] || 0.5;
  }

  private analyzeDescription(description: string): number {
    const keywords = [
      'website', 'webshop', 'e-commerce', 'app', 'applicatie',
      'design', 'ontwikkeling', 'development', 'responsive',
      'cms', 'wordpress', 'seo', 'marketing', 'hosting'
    ];

    const words = description.toLowerCase().split(/\W+/);
    const keywordCount = keywords.reduce((count, keyword) => 
      count + (words.includes(keyword) ? 1 : 0), 0);

    return Math.min(keywordCount / keywords.length, 1);
  }

  async analyzeLead(lead: Lead): Promise<{
    conversionProbability: number;
    recommendedPrice: number;
    insights: string[];
  }> {
    try {
      // Ensure model is loaded
      if (!this.modelLoaded) {
        await this.loadModel();
      }

      if (!this.model) {
        throw new Error('Model not initialized');
      }

      // Extract features
      const features = this.extractFeatures(lead);
      
      // Make prediction
      const prediction = this.model.predict(features) as tf.Tensor;
      const [conversionProb, priceMultiplier, complexity] = Array.from(await prediction.data());

      // Calculate recommended price based on budget range and prediction
      const basePrice = this.parseBudgetRange(lead.budget_range);
      const recommendedPrice = basePrice * priceMultiplier;

      // Generate insights
      const insights = this.generateInsights(lead, conversionProb, complexity);

      // Cleanup tensors
      features.dispose();
      prediction.dispose();

      return {
        conversionProbability: conversionProb,
        recommendedPrice,
        insights,
      };
    } catch (error) {
      console.error('Error analyzing lead:', error);
      throw error;
    }
  }

  private generateInsights(lead: Lead, conversionProb: number, complexity: number): string[] {
    const insights: string[] = [];

    // Conversion probability insights
    if (conversionProb > 0.7) {
      insights.push('Hoge kans op conversie - prioriteit geven aan deze lead');
    } else if (conversionProb < 0.3) {
      insights.push('Lagere conversiekans - overweeg aanpassing van aanpak');
    }

    // Budget insights
    const budget = this.parseBudgetRange(lead.budget_range);
    if (budget > 10000) {
      insights.push('Hoog-waarde project - gedetailleerd voorstel maken');
    }

    // Timeline insights
    if (lead.timeline === 'Zo snel mogelijk') {
      insights.push('Snelle oplevering gewenst - benadruk snelle beschikbaarheid');
    }

    // Complexity insights
    if (complexity > 0.7) {
      insights.push('Complex project - technische expertise benadrukken');
      insights.push('Overweeg gefaseerde aanpak voor te stellen');
    }

    return insights;
  }

  // Cleanup method to free memory
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.modelLoaded = false;
    }
  }
}

const TOTAL_FACTORS = 3; // Number of factors in the scoring system

const getLeadScore = (lead: Lead): number => {
  if (!lead.max_quotes || !lead.email || !lead.phone) {
    return 0;
  }

  const scores = [
    lead.max_quotes / 5,
    lead.email && lead.phone ? 1 : 0,
    // ... andere scores
  ];

  return scores.reduce((a, b) => a + b, 0) / TOTAL_FACTORS;
};