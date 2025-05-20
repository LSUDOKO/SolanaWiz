
'use server';
/**
 * @fileOverview AI-powered curation of popular DEX tokens from OKX Web3 API.
 * News fetching is not supported by this API type.
 *
 * - getDeFiTrends - Fetches and curates popular DEX tokens.
 * - GetDeFiTrendsInput - The input type for the getDeFiTrends function.
 * - GetDeFiTrendsOutput - The return type for the getDeFiTrends function.
 * - DeFiNewsItem - Schema for a news item (will be empty).
 * - PopularTokenItem - Schema for a popular token.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getDeFiNewsFromOKX, getPopularTokensFromOKX, type DeFiNewsArticle, type PopularTokenItem as RawPopularTokenItem } from '@/services/okx-service';

// Schemas for individual items
const DeFiNewsItemSchema = z.object({
  title: z.string().describe('The headline of the news article.'),
  summary: z.string().describe('A brief summary of the news article (2-3 sentences).'),
  url: z.string().describe('The direct URL to the news article.'), // Removed .url()
  source: z.string().describe('The source of the news (e.g., OKX News, CoinDesk).'),
  publishedAt: z.string().describe('The publication date of the article in ISO format.')
});
export type DeFiNewsItem = z.infer<typeof DeFiNewsItemSchema>;

// Updated schema for popular tokens
const PopularTokenItemSchema = z.object({
  id: z.string().describe('Unique identifier for the token (e.g., contract address).'),
  name: z.string().describe('The full name of the token.'),
  symbol: z.string().describe('The ticker symbol of the token (e.g., SOL, BTC).'),
  chain: z.string().describe('The blockchain network the token resides on (e.g., Solana, Ethereum).'),
  address: z.string().describe('The contract address of the token.'),
  logoUrl: z.string().optional().describe('URL to the token\'s logo image.'),
  aiDescription: z.string().describe('A brief AI-generated description or noteworthy aspect of the token (1-2 sentences).')
});
export type PopularTokenItem = z.infer<typeof PopularTokenItemSchema>;


// Input schema for the flow
const GetDeFiTrendsInputSchema = z.object({
  newsItemsCount: z.number().int().min(0).optional().default(0).describe('Number of news items to fetch (will be 0 as not supported).'), // Changed .positive() to .min(0)
  tokenItemsCount: z.number().int().min(1).optional().default(3).describe('Number of popular tokens to fetch and curate.'), // Ensure at least 1 token is requested if this field is used for selection.
});
export type GetDeFiTrendsInput = z.infer<typeof GetDeFiTrendsInputSchema>;

// Output schema for the flow
const GetDeFiTrendsOutputSchema = z.object({
  news: z.array(DeFiNewsItemSchema).describe('A curated list of trending DeFi news articles (will be empty).'),
  tokens: z.array(PopularTokenItemSchema).describe('A curated list of popular DEX tokens with AI-generated descriptions.'),
});
export type GetDeFiTrendsOutput = z.infer<typeof GetDeFiTrendsOutputSchema>;


export async function getDeFiTrends(input: GetDeFiTrendsInput): Promise<GetDeFiTrendsOutput> {
  return getDeFiTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'curatePopularTokensPrompt',
  input: { schema: z.object({ rawTokens: z.array(z.any()), inputParams: GetDeFiTrendsInputSchema }) },
  output: { schema: GetDeFiTrendsOutputSchema },
  prompt: `You are a Crypto Market Analyst. Your task is to curate popular tokens based on data provided from the OKX Web3 DEX API and generate a brief, insightful description for each.

Context:
- Token items count requested: {{{inputParams.tokenItemsCount}}}
- News is not available from this data source.

Raw Token Data (up to 20 items provided):
{{#if rawTokens}}
{{#each rawTokens}}
- Name: {{{this.name}}} (Symbol: {{{this.symbol}}})
  Chain: {{{this.chain}}}
  Address: {{{this.address}}}
  Logo: {{{this.logoUrl}}}
{{/each}}
{{else}}
No token data provided.
{{/if}}

Please select up to {{{inputParams.tokenItemsCount}}} of the most relevant or interesting tokens from the raw data.
For each selected token, provide its id, name, symbol, chain, address, logoUrl, and generate a concise 'aiDescription' (1-2 sentences highlighting something noteworthy like its primary use case, recent performance, or unique feature).
Format your response strictly according to the output schema.
If no relevant token data is found, return an empty array for 'tokens'. The 'news' array should always be empty.
`,
});

const getDeFiTrendsFlow = ai.defineFlow(
  {
    name: 'getDeFiTrendsFlow',
    inputSchema: GetDeFiTrendsInputSchema,
    outputSchema: GetDeFiTrendsOutputSchema,
  },
  async (input) => {
    // News is not fetched from Web3 API
    const rawNewsData: DeFiNewsArticle[] = await getDeFiNewsFromOKX(); // This will return []
    
    // Fetch popular tokens from OKX Web3 DEX API
    const rawTokenData: RawPopularTokenItem[] = await getPopularTokensFromOKX();

    if (!rawTokenData || rawTokenData.length === 0) {
      console.warn("OKX service returned no popular token data. AI curation will receive empty list.");
      return { news: [], tokens: [] };
    }
    
    console.log(`Genkit Flow: Received ${rawTokenData.length} raw tokens from service. Passing to AI for curation.`);

    const { output } = await prompt({
        rawTokens: rawTokenData, // Pass raw token data
        inputParams: input
    });

    if (!output) {
      console.warn("AI did not produce an output for DeFi trends. Falling back to use raw token data.");
      // Fallback: use a subset of raw tokens if AI fails
      const fallbackTokens = rawTokenData.slice(0, input.tokenItemsCount).map(t => ({
        id: t.id,
        name: t.name,
        symbol: t.symbol,
        chain: t.chain,
        address: t.address,
        logoUrl: t.logoUrl,
        aiDescription: "AI description could not be generated for this token.", // Default description
      }));
      return {
        news: [], // Always empty for Web3 API
        tokens: fallbackTokens,
      };
    }
    
    // Ensure news is always empty as per API capability
    console.log(`Genkit Flow: AI curated ${output.tokens.length} tokens.`);
    return { ...output, news: [] };
  }
);

