"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Activity, Apple, History, Home, User } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Apple className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-xl">NutriTrack</span>
            </Link>
          </div>

          <div className="flex space-x-4">
            <NavLink href="/" icon={<Home />} text="Home" isActive={isActive("/")} />
            <NavLink href="/dashboard" icon={<Activity />} text="Dashboard" isActive={isActive("/dashboard")} />
            <NavLink href="/food-analysis" icon={<Apple />} text="Food Analysis" isActive={isActive("/food-analysis")} />
            <NavLink href="/bmi" icon={<User />} text="BMI Calculator" isActive={isActive("/bmi")} />
            <NavLink href="/history" icon={<History />} text="History" isActive={isActive("/history")} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, text, isActive }: { href: string; icon: React.ReactNode; text: string; isActive: boolean }) {
  return (
    <Link href={href}>
      <Button variant={isActive ? "default" : "ghost"} className="flex items-center gap-2">
        {icon}
        <span>{text}</span>
      </Button>
    </Link>
  );
}