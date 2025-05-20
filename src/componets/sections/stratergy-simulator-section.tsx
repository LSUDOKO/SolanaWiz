"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { generateTradingStrategy, type GenerateTradingStrategyInput, type GenerateTradingStrategyOutput } from "@/ai/flows/generate-trading-strategy";
import { Button } from "@/componets/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/componets/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/componets/ui/form";
import { Input } from "@/componets/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/componets/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Loader2, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const strategySchema = z.object({
  investmentAmount: z.coerce.number().min(1, "Investment amount must be positive."),
  riskTolerance: z.enum(['low', 'medium', 'high'], { required_error: "Risk tolerance is required." }),
  marketConditions: z.string().min(10, "Market conditions description is too short.").max(500, "Market conditions description is too long."),
  tradingGoals: z.string().min(10, "Trading goals description is too short.").max(500, "Trading goals description is too long."),
});

type StrategyFormValues = z.infer<typeof strategySchema>;

export function StrategySimulatorSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [strategyResult, setStrategyResult] = useState<GenerateTradingStrategyOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<StrategyFormValues>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      investmentAmount: 1000,
      riskTolerance: "medium",
      marketConditions: "Current market is volatile with potential for SOL to break out.",
      tradingGoals: "Aim for 20% return in 3 months.",
    },
  });

  const onSubmit: SubmitHandler<StrategyFormValues> = async (data) => {
    setIsLoading(true);
    setStrategyResult(null);
    setError(null);
    try {
      const result = await generateTradingStrategy(data as GenerateTradingStrategyInput);
      setStrategyResult(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="strategy" className="w-full py-12 md:py-20 lg:py-28 bg-muted/20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl flex items-center justify-center">
            <Bot className="mr-3 h-8 w-8 text-primary" />
            AI Strategy Simulator
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Generate and test AI-powered trading strategies tailored to your preferences.
          </p>
        </div>

        <Card className="mt-10 max-w-3xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle>Configure Your Strategy</CardTitle>
            <CardDescription>Provide details to help our AI generate a trading strategy for you.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="investmentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Amount (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="riskTolerance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Tolerance</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select risk tolerance" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketConditions"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Current Market Conditions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe current market trends, news, etc." {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tradingGoals"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Trading Goals</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What are your financial goals for this strategy?" {...field} rows={3}/>
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
                  Generate Strategy
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {error && (
          <Alert variant="destructive" className="mt-6 max-w-3xl mx-auto">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {strategyResult && (
          <Card className="mt-8 max-w-3xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle>Generated Trading Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary">Strategy Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{strategyResult.strategyDescription}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">Risk Assessment</h3>
                <p className="text-muted-foreground whitespace-pre-line">{strategyResult.riskAssessment}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">Potential Profit</h3>
                <p className="text-muted-foreground whitespace-pre-line">{strategyResult.potentialProfit}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
