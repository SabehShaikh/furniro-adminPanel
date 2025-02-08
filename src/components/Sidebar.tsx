"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  Package,
  ShoppingCart,
  LineChart,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LogoutButton from "./Logout";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/dashboard/analytics", icon: LineChart, label: "Analytics" },
];

// Desktop Sidebar Component
export function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="hidden md:flex w-64 bg-white border-r min-h-screen flex-col">
      {/* Logo */}
      <div className="p-4 border-b flex items-center justify-center">
        <Image
          src="/images/furnirologo.png"
          alt="Furniro Logo"
          width={150}
          height={40}
        />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link href={item.href} key={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
        {/* Logout Button */}
     
        <LogoutButton className="w-full mt-4" />

      </nav>
    </div>
  );
}

// Mobile Navigation Component with Bottom Bar
export function MobileNav() {
  const pathname = usePathname();
  const mainNavItems = navItems.slice(0, 4); // Show only first 4 items in bottom bar

  return (
    <>
      {/* Top Header for Mobile */}
      <div className="md:hidden border-b bg-white fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <Image
            src="/images/furnirologo.png"
            alt="Furniro Logo"
            width={120}
            height={30}
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>More Options</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2 mt-4">
                {/* Logout Button in Mobile Menu */}
                <LogoutButton className="w-full mt-4" />

              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <nav className="flex justify-around items-center h-16">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                href={item.href}
                key={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full
                  ${isActive ? "text-primary" : "text-gray-500"}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Spacer div to prevent content from being hidden under fixed elements */}
      <div className="md:hidden h-[56px] mb-16" />
    </>
  );
}
