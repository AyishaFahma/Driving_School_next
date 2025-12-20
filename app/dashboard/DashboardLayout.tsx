// "use client";
// import React, { Children, useEffect, useState } from "react";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import Head from "next/head";
// import { ClipLoader } from "react-spinners";
// import Loader from "./Loader";
// import MobileSearchbar from "./MobileSearchbar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isHidden, setIsHidden] = useState(false);
//   const [loading, setLoading] = useState<boolean>(true); // State for loading
//   const handleClose = () => {
//     setIsHidden(true);
//   };

//   return (
//     <>
//       <Head>
//         <title>Dashboard</title>
//         <link rel="icon" href="/images/favicon.png" />
//         <link rel="stylesheet" href="/dist/css/app.css" />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
//           rel="stylesheet"
//         />

//         <script
//           src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
//           defer
//         ></script>
//       </Head>

//       <div
//         id="root"
//         className={` min-h-screen flex grow bg-slate-50 dark:bg-navy-900  is-header-blur`}
//       >
//         {/* App Preloader */}
//         <div className="app-preloader fixed z-50 grid h-full w-full place-content-center bg-slate-50 dark:bg-navy-900">
//           <div className="app-preloader-inner relative inline-block size-48" />
//         </div>
//         <Topbar />
//         <Sidebar />
//         <MobileSearchbar/>
//         <main className="main-content w-full px-[var(--margin-x)] pb-8">
//           <div className="flex items-center space-x-4 py-5 lg:py-6">
//             {children}

//           </div>

//         </main>




//         {/* <main
//          className="main-content w-full px-[var(--margin-x)] pb-8"
//           style={{
//             boxShadow: 'inset 1px 4px 6px rgba(0, 0, 0, 0.1)',
//             boxSizing: 'border-box'
//           }}
//         >
       
//           {loading ? (
//             <div className="flex justify-center items-center h-full">
//               <ClipLoader color="#36d7b7" size={50} />



              
              
//         </div>
//           ) : (
//             children 
//           )}
//         </main> */}



//       </div>
//       <script src="/dist/js/app.js" defer></script>
//       <script src="/dist/js/main.js" defer></script>
//     </>
//   );
// }


















// actual layout

// "use client";
// import React, { useState, useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import Head from "next/head";
// import MobileSearchbar from "./MobileSearchbar";
// import Loader from "./Loader";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const pathname = usePathname();
//   // useEffect(() => {
//   //   const handleStart = () => setLoading(true); // Show loader on route change start
//   //   const handleComplete = () => setLoading(false); // Hide loader when route changes are done

//   //   router.events?.on("routeChangeStart", handleStart);
//   //   router.events?.on("routeChangeComplete", handleComplete);
//   //   router.events?.on("routeChangeError", handleComplete);

//   //   // Cleanup listeners on unmount
//   //   return () => {
//   //     router.events?.off("routeChangeStart", handleStart);
//   //     router.events?.off("routeChangeComplete", handleComplete);
//   //     router.events?.off("routeChangeError", handleComplete);
//   //   };
//   // }, [router]);
//   useEffect(() => {
//     // When pathname changes, trigger loading
//     setLoading(true);

//     // Simulate loading time with a timeout (for demo purposes)
//     const timeout = setTimeout(() => {
//       setLoading(false); // Hide the loader after a set time
//     }, 500); // Set your desired delay

//     // Cleanup timeout when component unmounts or when pathname changes
//     return () => clearTimeout(timeout);
//   }, [pathname]); 
//   return (
//     <>
//       <Head>
//         <title>Dashboard</title>
//         <link rel="icon" href="/images/favicon.png" />
//         <link rel="stylesheet" href="/dist/css/app.css" />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
//           rel="stylesheet"
//         />
//         <script
//           src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
//           defer
//         ></script>
//       </Head>


//       {/* Loader */}
//       {/* {loading && <Loader />} */}

//       {/* {loading && 
//          <div className="app-preloader fixed z-50 grid h-full w-full place-content-center bg-slate-50 dark:bg-navy-900">
//          <div className="app-preloader-inner relative inline-block size-48" />
//        </div>
//       } */}
           
// {/* 
//       <div
//         id="root"
//         className={`min-h-screen flex grow bg-slate-50 dark:bg-navy-900 ${
//           loading ? "pointer-events-none opacity-50" : ""
//         }`}
//       > */}
//              <div
//          id="root"
//          className={` min-h-screen flex grow bg-slate-50 dark:bg-navy-900  is-header-blur`}
//        >
//         <Topbar />
//         <Sidebar />
//         <MobileSearchbar />

//         {loading && 
//          <div className="app-preloader fixed z-50 grid h-full w-full place-content-center bg-slate-50 dark:bg-navy-900">
//          <div className="app-preloader-inner relative inline-block size-48" />
//        </div>
//       }

//         <main className="main-content w-full px-[var(--margin-x)] pb-8">
//           <div className="flex items-center space-x-4 py-5 lg:py-6">
//             {children}
//           </div>
//         </main>
//       </div>
//       <script src="/dist/js/app.js" defer></script>
//       <script src="/dist/js/main.js" defer></script>
//     </>
//   );
// }







// start 
"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Head from "next/head";
import MobileSearchbar from "./MobileSearchbar";
import Footer from "./Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Simulate loading on route change
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // Adjust the delay as needed
    // Cleanup if component unmounts before timeout finishes
    //If the user changes pages again before the 500 ms timer finishes,this cancels the previous timer
    return () => clearTimeout(timeout);
    //runs effect every time rote/path changes
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
      <div className="dashboard-layout flex">
        <Sidebar />
       

        {/* Main Content */}
        <div className="content-area relative w-full min-h-screen bg-slate-50 dark:bg-navy-900">
          {/* Show loader only over the inner content */}
         
          {loading && (
            <div className="app-preloader loader-overlay absolute inset-0 z-50 grid place-content-center bg-white/70 dark:bg-navy-900/70">
             <div className="app-preloader-inner relative inline-block size-48"></div> 
            </div>

          )}

          <main
            className={`main-content px-[var(--margin-x)] pb-8 transition-opacity duration-300 ${
              loading ? "pointer-events-none opacity-50" : "opacity-100" }`}>
             {/* <div className="app-preloader-inner"> */}
            {children}
            {/* </div> */}
          </main>
        </div>
       
      </div>
      <Footer/>
      <script src="/dist/js/app.js" defer></script>
      <script src="/dist/js/main.js" defer></script>
    </>
  );
}
//end














// "use client";
// import React, { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import Head from "next/head";
// import MobileSearchbar from "./MobileSearchbar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [loading, setLoading] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     // Simulate loading on route change
//     setLoading(true);
//     const timeout = setTimeout(() => setLoading(false), 500); // Adjust the delay as needed
//     return () => clearTimeout(timeout);
//   }, [pathname]);

//   return (
//     <>
//       <Head>
//         <title>Dashboard</title>
//         <link rel="icon" href="/images/favicon.png" />
//         <link rel="stylesheet" href="/dist/css/app.css" />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
//           rel="stylesheet"
//         />
//         <script
//           src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
//           defer
//         ></script>
//       </Head>

//       {/* Top-level layout */}
//       <div className="dashboard-layout flex min-h-screen bg-slate-50 dark:bg-navy-900">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main content area */}
//         <div className="content-area flex flex-col w-full">
//           {/* Topbar */}
//           <Topbar />
//           <MobileSearchbar />

//           {/* Main children content */}
//           <div className="relative w-full flex-1">
//             {/* Loader only over children */}
//             {loading && (
//               <div className="loader-overlay absolute inset-0 z-50 grid place-content-center bg-white/70 dark:bg-navy-900/70">
//                 <div className="app-preloader-inner relative inline-block size-48"></div>
//               </div>
//             )}

//             {/* Children content */}
//             <main
//               className={`main-content px-[var(--margin-x)] pb-8 transition-opacity duration-300 ${
//                 loading ? "opacity-50 pointer-events-none" : "opacity-100"
//               }`}
//             >
//               {children}
//             </main>
//           </div>
//         </div>
//       </div>

//       <script src="/dist/js/app.js" defer></script>
//       <script src="/dist/js/main.js" defer></script>
//     </>
//   );
// }









