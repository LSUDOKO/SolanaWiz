"use client"

import { BarChart, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/componets/ui/card";
import { AreaChart as LucideAreaChart } from "lucide-react"; // Renamed to avoid conflict
import Image from 'next/image';

// Sample data for the chart
const samplePriceData = [
  { date: 'Jan 23', price: 80 },
  { date: 'Feb 23', price: 85 },
  { date: 'Mar 23', price: 95 },
  { date: 'Apr 23', price: 90 },
  { date: 'May 23', price: 100 },
  { date: 'Jun 23', price: 110 },
  { date: 'Jul 23', price: 105 },
  { date: 'Aug 23', price: 120 },
  { date: 'Sep 23', price: 130 },
  { date: 'Oct 23', price: 125 },
  { date: 'Nov 23', price: 140 },
  { date: 'Dec 23', price: 150 },
];


export function TokenAnalyticsSection() {
  return (
    <section id="analytics" className="w-full py-12 md:py-20 lg:py-28 bg-background">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl flex items-center justify-center">
            <LucideAreaChart className="mr-3 h-8 w-8 text-primary" />
            Token Analytics
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Visualize token price histories and other key metrics. (OKX API integration coming soon)
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-1"> {/* Changed to 1 column for focused chart */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Solana (SOL) Price History (Sample)</CardTitle>
              <CardDescription>Illustrative data showing SOL price over the past year.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={samplePriceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
                    <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} name="SOL Price (USD)" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Placeholder for other analytics cards */}
           <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg" data-ai-hint="market volume chart">
              <CardHeader>
                <CardTitle>Trading Volume</CardTitle>
                <CardDescription>Placeholder for trading volume chart.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-48 bg-muted/30 rounded-md">
                 <Image src="https://placehold.co/300x150.png" alt="Trading Volume Placeholder" width={300} height={150} className="opacity-50" />
              </CardContent>
            </Card>
            <Card className="shadow-lg" data-ai-hint="market cap chart">
              <CardHeader>
                <CardTitle>Market Cap Dominance</CardTitle>
                <CardDescription>Placeholder for market cap chart.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-48 bg-muted/30 rounded-md">
                 <Image src="https://placehold.co/300x150.png" alt="Market Cap Placeholder" width={300} height={150} className="opacity-50" />
              </CardContent>
            </Card>
           </div>
        </div>
      </div>
    </section>
  );
}
