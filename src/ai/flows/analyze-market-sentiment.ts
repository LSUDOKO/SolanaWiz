'use server';

/**
 * @fileOverview AI-powered sentiment analysis of the Solana market.
 *
 * - analyzeMarketSentiment - Analyzes the current market sentiment for Solana.
 * - AnalyzeMarketSentimentInput - The input type for the analyzeMarketSentiment function.
 * - AnalyzeMarketSentimentOutput - The return type for the analyzeMarketSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMarketSentimentInputSchema = z.object({
  query: z
    .string() // Make query optional to allow default sentiment analysis
    .describe("The search query for analyzing market sentiment, e.g., 'Solana news' or 'Solana price prediction'."),
});
export type AnalyzeMarketSentimentInput = z.infer<typeof AnalyzeMarketSentimentInputSchema>;

const AnalyzeMarketSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe("A summary of the market sentiment (e.g., 'bullish', 'bearish', 'neutral') and the rationale behind it."),
});
export type AnalyzeMarketSentimentOutput = z.infer<typeof AnalyzeMarketSentimentOutputSchema>;

export async function analyzeMarketSentiment(input: AnalyzeMarketSentimentInput): Promise<AnalyzeMarketSentimentOutput> {
  return analyzeMarketSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketSentimentPrompt',
  input: {schema: AnalyzeMarketSentimentInputSchema},
  output: {schema: AnalyzeMarketSentimentOutputSchema},
  prompt: `You are an AI assistant specializing in cryptocurrency market sentiment analysis.

  Analyze the latest news, social media posts, and market data related to Solana (SOL) to determine the overall market sentiment.
  Provide a concise summary of the sentiment, indicating whether it is primarily bullish, bearish, or neutral.
  Include a brief explanation of the factors driving the sentiment.

  Consider these factors:
  - Recent price trends of Solana
  - News articles and social media discussions about Solana
  - Analyst ratings and predictions for Solana
  - Overall market conditions and their potential impact on Solana

  Query: {{query}}

  Sentiment Summary:`,
});

const analyzeMarketSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeMarketSentimentFlow',
    inputSchema: AnalyzeMarketSentimentInputSchema,
    outputSchema: AnalyzeMarketSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
