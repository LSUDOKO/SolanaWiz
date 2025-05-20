
'use server';
/**
 * @fileOverview Service for interacting with the OKX Web3 API for DEX information.
 * This service uses an Okc-Apikey for authentication.
 * General news/announcements and specific "DeFi Strategies" (like staking offers)
 * are not typically available via the Web3 DEX API with just an Okc-Apikey.
 * This service will focus on fetching popular DEX tokens.
 */

// Base URL for OKX API
const OKX_API_BASE_URL = 'https://www.okx.com';

// Load API credentials from environment variables
const OKC_API_KEY = process.env.OKX_API_KEY;

// Interface for the raw token data from OKX Web3 API (e.g., token-list/popular)
interface OkxWeb3Token {
  tokenFullName: string;
  symbol: string;
  tokenContractAddress: string;
  chainFullName: string;
  chainShortName: string; // e.g., "Solana", "ETH"
  logoLink: string;
  // other fields might be present, like price, liquidity, etc.
}

// Standardized interface for a popular token item (used by the Genkit flow)
export interface PopularTokenItem {
  id: string; // contractAddress can serve as ID
  name: string; // tokenFullName
  symbol: string;
  chain: string; // chainFullName or chainShortName
  address: string; // tokenContractAddress
  logoUrl?: string;
}

// For News - now just a placeholder as Web3 API doesn't provide this
export interface DeFiNewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string; // ISO date string
}

interface OkxWeb3ApiResponse<T> {
  code: string; // "0" for success
  msg: string;
  data: T[]; // For list endpoints, data is usually an array
  detailMsg?: string;
  error_code?: string;
  error_message?: string;
}


async function makeOkxWeb3Request(endpoint: string, method: 'GET' | 'POST' = 'GET', body: any = null) {
  const url = `${OKX_API_BASE_URL}${endpoint}`;
  const headersInit: HeadersInit = {
    'User-Agent': 'SolanaWiz/1.0',
  };

  if (!OKC_API_KEY) {
    console.error('OKX Service (Web3): ERROR - Okc-Apikey (from OKX_API_KEY) is not configured in environment variables.');
    throw new Error('Okc-Apikey is not configured for OKX Web3 API requests.');
  }
  headersInit['Okc-Apikey'] = OKC_API_KEY;
  // As per OKX Web3 docs, some POST requests might need Content-Type. For GET, it's usually not needed.
  // If specific POST endpoints require it:
  // if (method === 'POST' && body) {
  //   headersInit['Content-Type'] = 'application/json';
  // }

  const bodyStr = body ? JSON.stringify(body) : null;

  try {
    console.log(`OKX Service (Web3): Fetching ${method} ${url}`);
    const response = await fetch(url, {
      method,
      headers: headersInit,
      body: bodyStr, // Only include body if it's a POST/PUT and bodyStr is not null
      cache: 'no-store', // Ensure fresh data
    });

    const responseText = await response.text();
    console.log(`OKX Service (Web3): Raw response status for ${method} ${endpoint}: ${response.status}`);
    // console.log(`OKX Service (Web3): Raw response text for ${method} ${endpoint}: ${responseText.substring(0, 500)}...`);


    if (!response.ok) {
      const errorDetail = responseText.substring(0, 500);
      console.error(`OKX Service (Web3): API Error (${response.status}) for ${method} ${endpoint}. Response: ${errorDetail}...`);
      throw new Error(`OKX Web3 API request failed with status ${response.status}: ${errorDetail.substring(0,200)}`);
    }
    
    try {
      const jsonData = JSON.parse(responseText);
      console.log(`OKX Service (Web3): Parsed JSON response for ${method} ${endpoint}. Code: ${jsonData.code}, Msg: ${jsonData.msg}`);
      return jsonData;
    } catch (e) {
      const parseErrorDetail = responseText.substring(0, 500);
      console.error(`OKX Service (Web3): Failed to parse JSON response for ${method} ${endpoint}. Response text: ${parseErrorDetail}...`, e);
      throw new Error(`OKX Web3 API response for ${method} ${endpoint} was not valid JSON.`);
    }
  } catch (error) {
    console.error(`OKX Service (Web3): General error during fetch or processing for ${method} ${endpoint}:`, error);
    throw error; // Re-throw the error to be caught by the calling function
  }
}

/**
 * Fetches trending DeFi news articles.
 * NOTE: The OKX Web3 DEX API does not typically provide general market news/announcements.
 * This function will return an empty array.
 * @returns {Promise<DeFiNewsArticle[]>} An empty list of news articles.
 */
export async function getDeFiNewsFromOKX(): Promise<DeFiNewsArticle[]> {
  console.warn('OKX Service: getDeFiNewsFromOKX - OKX Web3 DEX API does not provide general news/announcements. Returning empty array for news.');
  return [];
}

/**
 * Fetches popular/trending tokens from the OKX Web3 DEX API.
 * Uses the /api/v5/web3/dex/token-list/popular endpoint.
 * @returns {Promise<PopularTokenItem[]>} A list of popular tokens.
 */
export async function getPopularTokensFromOKX(): Promise<PopularTokenItem[]> {
    console.log('OKX Service (Web3): Preparing to fetch popular tokens from DEX.');
    if (!OKC_API_KEY) {
        console.warn("OKX Service (Web3): CRITICAL - Okc-Apikey (OKX_API_KEY) is not configured. Cannot fetch popular tokens. Returning empty array.");
        return [];
    }
    console.log(`OKX Service (Web3): Okc-Apikey found (first 5 chars): ${OKC_API_KEY.substring(0,5)}...`);

    // Using the token-list/popular endpoint. Requires chainShortName.
    const chainShortName = 'Solana'; // Or 'ETH', 'BSC', etc.
    const limit = 20; // Fetch up to 20 popular tokens
    const endpoint = `/api/v5/web3/dex/token-list/popular?chainShortName=${chainShortName}&limit=${limit}`;
    
    try {
        const response: OkxWeb3ApiResponse<OkxWeb3Token> = await makeOkxWeb3Request(endpoint, 'GET');

        if (response.code !== '0') {
          console.warn(`OKX Web3 Popular Tokens API returned code ${response.code} with message: "${response.msg}". Data: ${response.data ? JSON.stringify(response.data).substring(0,100) : 'undefined'}...`);
          return []; // Return empty if API indicates an error
        }
        if (!response.data || response.data.length === 0) {
            console.warn(`OKX Web3 Popular Tokens API successfully responded (code 0) for chain ${chainShortName} but returned no token data items.`);
            return [];
        }
        
        console.log(`OKX Web3 Popular Tokens API: Received ${response.data.length} raw tokens for chain ${chainShortName}. Processing for curation.`);
        return response.data.map((token: OkxWeb3Token) => ({
            id: token.tokenContractAddress || `${token.symbol}-${token.chainShortName}`, // Ensure ID is unique
            name: token.tokenFullName || token.symbol,
            symbol: token.symbol,
            chain: token.chainFullName || token.chainShortName,
            address: token.tokenContractAddress,
            logoUrl: token.logoLink,
        }));
    } catch (error) {
        // Log the error but return an empty array to prevent breaking the flow
        console.error(`OKX Service (Web3): Error fetching or processing popular tokens from OKX for chain ${chainShortName}:`, error);
        return [];
    }
}

/**
 * Fetches DeFi strategies (placeholder, as Web3 API doesn't directly provide "strategies").
 * This function is deprecated in favor of getPopularTokensFromOKX.
 * @returns {Promise<any[]>} An empty list.
 * @deprecated Use getPopularTokensFromOKX instead.
 */
export async function getDeFiStrategiesFromOKX(): Promise<any[]> {
  console.warn("OKX Service: getDeFiStrategiesFromOKX is deprecated and will return empty. Use getPopularTokensFromOKX for Web3 token data.");
  return [];
}
