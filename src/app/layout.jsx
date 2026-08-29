import "./globals.css";
import { Toaster } from "react-hot-toast";
import TerminalModal from "../../Components/ui/TerminalModal";
import QuickConnectDrawer from "../../Components/ui/QuickConnectDrawer";

export const metadata = {
    title:       "MD. Muttakiul Islam Tuser | MERN Stack Developer Portfolio",
    description: "Full-Stack MERN Developer specializing in React, Next.js, Node.js, Express & MongoDB. View projects, skills, and get in touch.",
    keywords:    "MERN Stack Developer, React, Next.js, Node.js, MongoDB, Full Stack Web Developer, Bangladesh",
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <body className="antialiased">
                {children}

                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background:   "rgba(2,8,24,0.95)",
                            color:        "#e2e8f0",
                            border:       "1px solid rgba(0,212,255,0.2)",
                            borderRadius: "14px",
                            fontSize:     "0.85rem",
                            fontWeight:   "500",
                            padding:      "12px 18px",
                            boxShadow:    "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.08)",
                            backdropFilter: "blur(20px)",
                            fontFamily: "'Inter',sans-serif",
                        },
                        success: {
                            duration:  4000,
                            iconTheme: { primary: "#10b981", secondary: "#f1f5f9" },
                            style: {
                                background: "rgba(2,8,24,0.95)",
                                border:     "1px solid rgba(16,185,129,0.35)",
                                color:      "#d1fae5",
                                boxShadow:  "0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(16,185,129,0.1)",
                            },
                        },
                        error: {
                            duration:  5000,
                            iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" },
                            style: {
                                background: "rgba(2,8,24,0.95)",
                                border:     "1px solid rgba(239,68,68,0.35)",
                                color:      "#fecaca",
                                boxShadow:  "0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(239,68,68,0.1)",
                            },
                        },
                    }}
                />
                <TerminalModal />
                <QuickConnectDrawer />
            </body>
        </html>
    );
}