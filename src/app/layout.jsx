import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
    title:       "MD. Muttakiul Islam Tuser — Portfolio",
    description: "MERN Stack Developer Portfolio",
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
                            background:   "#1e293b",
                            color:        "#f1f5f9",
                            border:       "1px solid #334155",
                            borderRadius: "12px",
                            fontSize:     "14px",
                            fontWeight:   "500",
                            padding:      "12px 16px",
                            boxShadow:    "0 8px 32px rgba(0,0,0,0.4)",
                        },
                        success: {
                            duration:  4000,
                            iconTheme: { primary: "#10b981", secondary: "#f1f5f9" },
                            style: {
                                background: "#022c22",
                                border:     "1px solid #10b981",
                                color:      "#d1fae5",
                            },
                        },
                        error: {
                            duration:  5000,
                            iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" },
                            style: {
                                background: "#1f0a0a",
                                border:     "1px solid #ef4444",
                                color:      "#fecaca",
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
}