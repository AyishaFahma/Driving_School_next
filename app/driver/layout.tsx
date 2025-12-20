
// export default function UserLayout({ children }: { children: React.ReactNode }) {
//     return (
//       <div>
//         <header>User Navigation</header>
//         <main>{children}</main>
//         <footer>User Footer</footer>
//       </div>
//     );
//   }
  


'use client'
  import Head from "next/head";

import dynamic from "next/dynamic";
import MobileSearchbar from "../dashboard/MobileSearchbar";

import { useEffect, useState } from "react";
import Sidebar from "./dashboard/Sidebar";
import Topbar from "./dashboard/Topbar";



// const studentLayout = ({ children }) => {
  export default function studentLayout({children,}:{children:React.ReactNode;}){
 
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   const darkMode = localStorage.getItem("dark-mode");
  //   setIsDarkMode(darkMode === "dark");
  //   console.log('Dark mode toggled', !isDarkMode);
  // }, []);

 
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
      </Head>
      
   
      {/* <DrawerProvider> */}
        {/* <div id="root" className={`min-h-100vh ${isDarkMode ? "dark bg-navy-900" : "bg-slate-50"}`}> 
          <div id="root" className={` min-h-screen flex grow bg-slate-50 dark:bg-navy-900 is-sidebar-open is-header-blur ${isDarkMode ? "dark bg-navy-900" : "bg-slate-50"}`}>  */}
        <div
          id="root" className={` min-h-screen flex grow bg-slate-50 dark:bg-navy-900  is-header-blur`}
        >
          {/* App Preloader */}
 <div className="app-preloader fixed z-50 grid h-full w-full place-content-center bg-slate-50 dark:bg-navy-900">
        <div className="app-preloader-inner relative inline-block size-48" />
       </div> 
      
          <Sidebar/>
          <Topbar/>
          <MobileSearchbar/>
   
        
          <main className="main-content w-full px-[var(--margin-x)] pb-8">
            <div className="flex items-center space-x-4 py-5 lg:py-6">
              {children}
            </div>
          </main>
       
        </div>
        
        
      {/* </DrawerProvider> */}
      <script src="/dist/js/app.js" defer></script>
    </>
  );
};

// export default studentLayout;