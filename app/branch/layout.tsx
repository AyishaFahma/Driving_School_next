

"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
import Head from "next/head";
// import MobileSearchbar from "./MobileSearchbar";
import MobileSearchbar from "../dashboard/MobileSearchbar";
import Topbar from "./dashboard/Topbar";
import Sidebar from "../dashboard/Sidebar";
import Footer from "../dashboard/Footer";



export default function DashboardLayout({ children, }: { children: React.ReactNode; }) {

    const [loading, setLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Simulate loading on route change
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500); // Adjust the delay as needed
        return () => clearTimeout(timeout);
    }, [pathname]);

    return (
        <>
            <Head>
                <title>Dashboard</title>
                <link rel="icon" href="/images/favicon.png" />
                <link rel="stylesheet" href="/dist/css/app.css" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <script
                    src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
                    defer
                ></script>
            </Head>

            {/* Topbar remains always visible */}
            <Topbar />

            {/* Layout excluding Topbar */}
            {/* <div className="dashboard-layout flex">
        <Sidebar />
        <MobileSearchbar />

      
        <div className="content-area relative w-full min-h-screen bg-slate-50 dark:bg-navy-900">
         
         
          {loading && (
            <div className="loader-overlay absolute inset-0 z-50 grid place-content-center bg-white/70 dark:bg-navy-900/70">
              <div className="app-preloader-inner relative inline-block size-48"></div>
            </div>
          )}

          <main
            className={`main-content px-[var(--margin-x)] pb-8 transition-opacity duration-300 ${
              loading ? "pointer-events-none opacity-50" : "opacity-100"
            }`}
          >
            {children}
          </main>
        </div>
      </div> */}

            <div className="dashboard-layout flex">
                <Sidebar />
                {/* <MobileSearchbar /> */}

                {/* Main Content */}
                <div className="content-area relative w-full min-h-screen bg-slate-50 dark:bg-navy-900">
                    {/* Show loader only over the inner content */}

                    {loading && (
                        <div className="app-preloader loader-overlay absolute inset-0 z-50 grid place-content-center bg-white/70 dark:bg-navy-900/70">
                            <div className="app-preloader-inner relative inline-block size-48"></div>
                        </div>

                    )}

                    <main
                        className={`main-content px-[var(--margin-x)] pb-8 transition-opacity duration-300 ${loading ? "pointer-events-none opacity-50" : "opacity-100"
                            }`}
                    >
                        {/* <div className="app-preloader-inner"> */}
                        {children}
                        {/* </div> */}
                    </main>
                </div>

            </div>
            <Footer />
            <script src="/dist/js/app.js" defer></script>
            <script src="/dist/js/main.js" defer></script>
        </>
    );
}