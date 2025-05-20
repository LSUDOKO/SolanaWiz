"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { analyzeMarketSentiment, type AnalyzeMarketSentimentInput, type AnalyzeMarketSentimentOutput } from "@/ai/flows/analyze-market-sentiment";
import { Button } from "@/componets/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/componets/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/componets/ui/form";
import { Input } from "@/componets/ui/input";
import { Loader2, Search, Sparkles, TrendingDown, TrendingUp, HelpCircle } from "lucide-react";
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/componets/ui/alert";

const sentimentSchema = z.object({
  query: z.string().min(3, "Query must be at least 3 characters long.").max(100, "Query is too long."),
});

type SentimentFormValues = z.infer<typeof sentimentSchema>;

export function SentimentAnalysisSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [sentimentResult, setSentimentResult] = useState<AnalyzeMarketSentimentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SentimentFormValues>({
    resolver: zodResolver(sentimentSchema),
    defaultValues: {
      query: "Solana price action",
    },
  });

  const onSubmit: SubmitHandler<SentimentFormValues> = async (data) => {
    setIsLoading(true);
    setSentimentResult(null);
    setError(null);
    try {
      const result = await analyzeMarketSentiment(data as AnalyzeMarketSentimentInput);
      setSentimentResult(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSentimentIcon = () => {
    if (!sentimentResult || !sentimentResult.sentiment) return <HelpCircle className="h-8 w-8 text-muted-foreground" />;
    const sentimentText = sentimentResult.sentiment.toLowerCase();
    if (sentimentText.includes("bullish")) return <TrendingUp className="h-8 w-8 text-green-500" />;
    if (sentimentText.includes("bearish")) return <TrendingDown className="h-8 w-8 text-red-500" />;
    return <HelpCircle className="h-8 w-8 text-yellow-500" />;
  };

  return (
    <section id="sentiment" className="w-full py-12 md:py-20 lg:py-28 bg-background">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl flex items-center justify-center">
            <Sparkles className="mr-3 h-8 w-8 text-primary" />
            AI Market Sentiment
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Get real-time bullish/bearish signals for Solana powered by AI.
          </p>
        </div>

        <Card className="mt-10 max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle>Analyze Market Sentiment</CardTitle>
            <CardDescription>Enter a query related to Solana to analyze current market sentiment.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Query</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="e.g., 'Solana news' or 'SOL price prediction'" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Analyze Sentiment
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {error && (
          <Alert variant="destructive" className="mt-6 max-w-2xl mx-auto">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {sentimentResult && (
          <Card className="mt-8 max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                {getSentimentIcon()}
                <span className="ml-3">Sentiment Analysis Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{sentimentResult.sentiment.split(':')[0].trim()}</p>
              <p className="text-muted-foreground mt-1 whitespace-pre-line">{sentimentResult.sentiment.substring(sentimentResult.sentiment.indexOf(':') + 1).trim()}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
