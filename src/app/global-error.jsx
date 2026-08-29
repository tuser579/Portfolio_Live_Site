"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#020818] text-slate-100 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 bg-slate-900/60 p-8 rounded-2xl border border-cyan-500/20 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              Critical Error
            </h2>
            <p className="text-sm text-slate-400">
              A critical error occurred in the application.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
