
"use client"

import Link from "next/link"
import { Menu, TrendingUp, LayoutGrid, BarChartBig, Bot, Newspaper } from "lucide-react" // Added Newspaper
import { SolanaLogo } from "@/componets/icons/solana-logo"
import { ThemeToggle } from "@/componets/theme-toggle"
import { Button } from "@/componets/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/componets/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import * as React from "react"

const navItems = [
  { href: "#sentiment", label: "Sentiment", icon: TrendingUp },
  { href: "#features", label: "Features", icon: LayoutGrid },
  { href: "#defi-trends", label: "DeFi Trends", icon: Newspaper }, // Added new nav item
  { href: "#analytics", label: "Analytics", icon: BarChartBig },
  { href: "#strategy", label: "Strategy AI", icon: Bot },
];

export function Navbar() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.label}
          variant="ghost"
          asChild
          className={`justify-start ${inSheet ? "w-full" : ""}`}
          onClick={() => inSheet && setMobileMenuOpen(false)}
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <SolanaLogo className="h-8 w-8 text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            SolanaWiz
          </span>
        </Link>
        
        {!isMobile && (
          <nav className="flex flex-1 items-center space-x-1">
            <NavLinks />
          </nav>
        )}

        <div className={`flex flex-1 items-center justify-end space-x-2 ${isMobile ? "" : "md:flex-none"}`}>
          <ThemeToggle />
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] p-4">
                <div className="mb-4 flex items-center space-x-2">
                  <SolanaLogo className="h-8 w-8 text-primary" />
                  <span className="font-bold text-lg">SolanaWiz</span>
                </div>
                <nav className="flex flex-col space-y-2">
                  <NavLinks inSheet={true} />
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
