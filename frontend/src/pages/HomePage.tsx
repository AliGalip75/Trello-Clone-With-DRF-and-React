// src/pages/HomePage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Layout, Kanban } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="w-full px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage projects with <span className="text-indigo-600">clarity</span>.
                </h1>
                <p className="mx-auto max-w-175 text-gray-500 md:text-xl dark:text-gray-400">
                  The simplest way to organize your work, collaborate with your team, and hit your deadlines.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/dashboard/boards/">
                  <Button className="cursor-pointer h-11 px-8" size="lg">
                    Start for free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="cursor-pointer h-11 px-8">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section (Bento Grid Style) */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="w-full px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-indigo-100 px-3 py-1 text-sm text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  Productivity
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Workflow customization at its finest.
                </h2>
                <ul className="grid gap-4 mt-8">
                    {/* Feature Items */}
                  {["Real-time collaboration", "Customizable workflows", "Automated deadlines"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center">
                {/* Placeholder for a Dashboard Screenshot or Graphic */}
                <div className="relative w-full h-[300px] bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl shadow-2xl flex items-center justify-center text-white">
                    <Layout className="h-24 w-24 opacity-80" />
                    <span className="absolute bottom-4 text-sm opacity-75">Dashboard Preview</span>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
};

export default HomePage;