"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#020818] text-slate-100 p-6">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900/60 p-8 rounded-2xl border border-cyan-500/20 backdrop-blur-xl shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Something went wrong!
          </h2>
          <p className="text-sm text-slate-400">
            An unexpected error occurred while loading this page.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all duration-200 border border-slate-700"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
