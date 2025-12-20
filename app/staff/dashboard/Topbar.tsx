
"use client";
import Head from "next/head";
import React, { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useDrawer } from "@/app/dashboard/DrawerContext";


// const Topbar = () => {
//    const { state, clearAuthData } = useAuth();
//    const user = state?.user;
// const [userData, setUserData] = useState<{
//     first_name: string;
//     second_name: string;
//     email: string;
//     mobile: string;
//     address: string;
//     city: string;
//     zip_code: string;
//     userfile: File | null;
//     user_photo: string;
//     user_name:string;
//   }>({
//     first_name: "",
//     second_name: "",
//     email: "",
//     mobile: "",
//     address: "",
//     city: "",
//     zip_code: "",
//     user_name:"",
//     userfile: null, // Default to null for file
//     user_photo: "",
//   });

//   const { toggleDrawer } = useDrawer();
//    const router = useRouter();
//   const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

//   const handleToggle = () => {
//     setIsSidebarExpanded(!isSidebarExpanded);
//   };
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     clearAuthData(); // Clear the context state as well
//     router.push("/login");
//   };



//   const fetchProfileData = async () => {
//     try {
//       const response = await fetch("/api/staff/member/my_profile", {
//         method: "POST",
//         headers: {
//           authorizations: state?.accessToken ?? "",
//           api_key: "10f052463f485938d04ac7300de7ec2b", // Make sure the API key is correct
//         },
//         body: JSON.stringify({
//           /* request body */
//         }),
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `HTTP error! Status: ${response.status} - ${
//             errorData.message || "Unknown error"
//           }`
//         );
//       }

//       const data = await response.json();

//       if (data.success) {
//         setUserData(data.data || []);
//       } else {
//         // console.error("API error:", data.msg || "Unknown error");
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   };
//   // };
//   useEffect(() => {
//     fetchProfileData();
//   }, [state]);


//   return (
//     <>
//       <nav className="header before:bg-white dark:before:bg-navy-750 print:hidden">
//         {/* App Header  */}
//         <div className="header-container relative flex w-full bg-white dark:bg-navy-700 print:hidden">
//           {/* Header Items */}
//           <div className="flex w-full items-center justify-between">
//             {/* Left: Sidebar Toggle Button */}
//             <div className="size-7">
//               <button
//                 onClick={toggleDrawer}
//                 className="sidebar-toggle hidden sm:flex ml-0.5 flex-col justify-center space-y-1.5 text-primary outline-none focus:outline-none dark:text-accent-light/80"
//               >
//                 <span />
//                 <span />
//                 <span />
//               </button>
//             </div>
//             <button
//               onClick={toggleDrawer}
//               className="sidebar-toggle ml-0.5 flex size-7 flex-col justify-center space-y-1.5 text-primary outline-none focus:outline-none dark:text-accent-light/80 xl:hidden"
//             >
//               <span />
//               <span />
//               <span />
//             </button>
//             {/* Right: Header buttons */}
//             <div className="-mr-1.5 flex items-center space-x-2">
              

           
//              {/* Mobile Search Toggle */}

//               <button
//                 // onClick={toggleDrawer}
//                 className="mobile-searchbar-show btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 sm:hidden"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="size-5.5 text-slate-500 dark:text-navy-100"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth="1.5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </button>
//               {/* Main Searchbar */}
//               {/* Dark Mode Toggle */}
//               <button className="darkmode-toggle btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
//                 <svg
//                   className="darkmode-moon size-6 text-amber-400"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M11.75 3.412a.818.818 0 01-.07.917 6.332 6.332 0 00-1.4 3.971c0 3.564 2.98 6.494 6.706 6.494a6.86 6.86 0 002.856-.617.818.818 0 011.1 1.047C19.593 18.614 16.218 21 12.283 21 7.18 21 3 16.973 3 11.956c0-4.563 3.46-8.31 7.925-8.948a.818.818 0 01.826.404z" />
//                 </svg>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="darkmode-sun size-6 text-amber-400"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//               {/* Monochrome Mode Toggle */}
//               <button className="monochrome-toggle btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
//                 <i className="fa-solid fa-palette bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-lg font-semibold text-transparent" />
//               </button>
        
            
// {/* Profile */}
// <div className="flex flex-col items-center space-y-3 py-3">

// <div id="profile-wrapper" className="flex">
//   <button id="profile-ref" className="avatar size-10">
//     <img
//       className="rounded-full"
//       // src="/profile.png"
     
//       src={` https://our-demos.com/n/drivingschool_api/assets/images/documents/${userData.user_photo}`}
     
//     />
//     <span className="absolute right-0 size-3.5 rounded-full border-2 border-white bg-success dark:border-navy-700" />
//   </button>
//   <div id="profile-box" className="popper-root">
//     <div className="popper-box w-60 rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-600 dark:bg-navy-700">
//       <div className="flex items-center space-x-4 rounded-t-lg bg-slate-100 py-4 px-4 dark:bg-navy-800">
        
//         <div>
//           <a
//             href="#"
//             className="text-base font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
//           >
         
//            {userData.user_name}
//           </a>
         
//         </div>
//       </div>
//       <div className="flex flex-col pt-1 pb-3">
//         <Link
//           href="/staff/profile"
//           className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all  focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
//         >
//           <div className="flex size-8 items-center justify-center rounded-lg bg-warning text-white">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="size-4.5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//               />
//             </svg>
//           </div>
//           <div>
//             <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
//               Profile
//             </h2>
//             <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
//                   Your profile setting
//                 </div>
//           </div>
//         </Link>
       
//         <div className="mt-3 px-4">
//           <button 
//           onClick={handleLogout}
//           className="btn h-9 w-full space-x-2 bg-primary text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="size-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="1.5"
//                 d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//               />
//             </svg>
//             <span>Logout</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// </div>


 




//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Topbar;

const Topbar = () => {
  const { state, clearAuthData } = useAuth();
  const user = state?.user;
const [userData, setUserData] = useState<{
   first_name: string;
   second_name: string;
   email: string;
   mobile: string;
   address: string;
   city: string;
   zip_code: string;
   userfile: File | null;
   user_photo: string;
   user_name:string;
 }>({
   first_name: "",
   second_name: "",
   email: "",
   mobile: "",
   address: "",
   city: "",
   zip_code: "",
   user_name:"",
   userfile: null, // Default to null for file
   user_photo: "",
 });
// console.log(photo,'user profile data')
 const { toggleDrawer } = useDrawer();
  const router = useRouter();
 const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);


 const [isCentered, setIsCentered] = useState(false);

 const handleClick = () => {
   setIsCentered((prev) => !prev);
   toggleDrawer(); // Keep the original drawer toggle function
 };


 const handleToggle = () => {
   setIsSidebarExpanded(!isSidebarExpanded);
 };
 const handleLogout = () => {
   localStorage.removeItem("token");
   clearAuthData(); // Clear the context state as well
   router.push("/login");
 };


  const fetchProfileData = async () => {
    try {
      const response = await fetch("/api/staff/member/my_profile", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b", // Make sure the API key is correct
        },
        body: JSON.stringify({
          /* request body */
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      if (data.success) {
        setUserData(data.data || []);
      } else {
        // console.error("API error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  // };
  useEffect(() => {
    fetchProfileData();
  }, [state]);



 return (
   <>
    
   <nav className="header before:bg-white dark:before:bg-navy-750 print:hidden ">
 {/* App Header  */}
 <div className="header-container relative flex w-full bg-white dark:bg-navy-700 print:hidden">
   {/* Header Items */}
   <div className="flex w-full items-center justify-between">
     {/* Left: Sidebar Toggle Button */}
     <div className="size-7">
       <button
         onClick={toggleDrawer}
         className="sidebar-toggle hidden sm:flex ml-0.5 flex-col justify-center space-y-1.5 text-primary outline-none focus:outline-none dark:text-accent-light/80"
       >
         <span />
         <span />
         <span />
       </button>
     </div>

     {/* Center/Left Toggle Button */}
     {/* <div className={`w-full absolute top-0 left-0 transition-all duration-300 ${isCentered ? "flex justify-center" : "flex justify-start ml-2"}`}> */}
     <div className={`w-full absolute top-0 left-0 transition-all duration-300 ${isCentered ? "flex ml-18" : "flex justify-start ml-2"}`}>
       <button
         onClick={handleClick}
         className="mt-6 ml-4 sidebar-toggle flex size-7 flex-col space-y-1.5 text-primary outline-none focus:outline-none dark:text-accent-light/80 xl:hidden"
       >
         <span />
         <span />
         <span />
       </button>
       </div>
           {/* Right: Header buttons */}
           <div className="flex items-right space-x-2">
             
             {/* Dark Mode Toggle */}
             <button className="mt-4 darkmode-toggle btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
               <svg
                 className="darkmode-moon size-6 text-amber-400"
                 fill="currentColor"
                 viewBox="0 0 24 24"
               >
                 <path d="M11.75 3.412a.818.818 0 01-.07.917 6.332 6.332 0 00-1.4 3.971c0 3.564 2.98 6.494 6.706 6.494a6.86 6.86 0 002.856-.617.818.818 0 011.1 1.047C19.593 18.614 16.218 21 12.283 21 7.18 21 3 16.973 3 11.956c0-4.563 3.46-8.31 7.925-8.948a.818.818 0 01.826.404z" />
               </svg>
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 className="darkmode-sun size-6 text-amber-400"
                 viewBox="0 0 20 20"
                 fill="currentColor"
               >
                 <path
                   fillRule="evenodd"
                   d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                   clipRule="evenodd"
                 />
               </svg>
             </button>
             {/* Monochrome Mode Toggle */}
             <button className="mt-4 monochrome-toggle btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
               <i className="fa-solid fa-palette bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-lg font-semibold text-transparent" />
             </button>
            
{/* Profile */}
{/* <div className="flex flex-col space-y-3 py-3"> */}

 <div className="flex flex-col items-center space-y-3 py-3">

 <div id="profile-wrapper" className="flex">
   <button id="profile-ref" className="avatar size-10">
     <img
      className="rounded-full"
      // src="/profile.png"
     
      src={` https://our-demos.com/n/drivingschool_api/assets/images/documents/${userData.user_photo}`}
     
    />
    <span className="absolute right-0 size-3.5 rounded-full border-2 border-white bg-success dark:border-navy-700" />
  </button>
  <div id="profile-box" className="popper-root">
    <div className="popper-box w-60 rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-600 dark:bg-navy-700">
      <div className="flex items-center space-x-4 rounded-t-lg bg-slate-100 py-4 px-4 dark:bg-navy-800">
        
        <div>
          <a
            href="#"
            className="text-base font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
          >
         
           {userData.user_name}
          </a>
         
        </div>
      </div>
      <div className="flex flex-col pt-1 pb-3">
        <Link
          href="/staff/profile"
          className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all  focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-warning text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
              Profile
            </h2>
            <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                  Your profile setting
                </div>
          </div>
        </Link>
       
        <div className="mt-3 px-4">
          <button 
          onClick={handleLogout}
          className="btn h-9 w-full space-x-2 bg-primary text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</div>

          
         </div>
     
       </div>
     </nav>
   </>
 );
};

export default Topbar;











