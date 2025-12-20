'use client'

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

const Login = () => {

  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false); // Loading state

  const { state, setAuthData, isAuthenticated } = useAuth(); // Destructure state and setAuthData
  const router = useRouter();
  
  // auto login on refresh 
  // so if there’s already a token in localStorage, user won’t need to log in again.
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      // User is already authenticated, redirect based on role
      const rolePaths = {
        admin: "/admin",
        branch : "/branch" ,
        staff: "/staff",
        //driver:"/driver",
       student: "/student",
      };
      router.push(rolePaths[role as keyof typeof rolePaths] || "/unauthorized"); 
    }
  }, [router]);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Invalid credentials.");
    }

    const data = await response.json();
    console.log('logindata',data)

    const { token, user_type: role } = data?.data || {};

    if (!role || !token) {
      throw new Error("Role or token missing in the response.");
    }

    // Clear the session flag for the admin page
    sessionStorage.removeItem("hasVisitedAdmin");

    // save token and role in localstorage , it is a permenent storage even if the user refresh the browser it stayes there
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    // Store user data in context (optional)  so that other component can acess it without getting from localstorage
    //update auth context
    if (setAuthData) {
      setAuthData({
        user: data,
        accessToken: token,
        refreshToken: data.refreshToken,
      });
    }
     
    // re-directing depends on role
    const rolePaths = {
      admin: "/admin",
      branch : "/branch" ,
      staff: "/staff",
     student: "/student",
    };

    await router.push(rolePaths[role as keyof typeof rolePaths] || "/unauthorized");
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message || "Something went wrong.");
    } else {
      setError("Something went wrong.");
    }
  } finally {
    setLoading(false);
  }
};
  return (
        <div>
      <link rel="stylesheet" href="/css/base.css" />
      <link rel="stylesheet" href="/dist/css/app.css" />
      <main className="grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <img
              className="mx-auto size-16"
              // src="/images/app-logo.svg"
              src="/logo.png"
              alt="logo"
            />
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-slate-600 dark:text-navy-100">
                Welcome Back
              </h2>
              <p className="text-slate-400 dark:text-navy-300">
                Please sign in to continue
              </p>
            </div>
          </div>
          <div className="card mt-5 rounded-lg p-5 lg:p-7">
          <form onSubmit={handleLogin}>
            <label className="block">
              <span>Username:</span>
              <span className="relative mt-1.5 flex">
                <input
                  className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  placeholder="Enter Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
              </span>
            </label>
            <label className="mt-4 block">
              <span>Password:</span>
              <span className="relative mt-1.5 flex">
                <input
                  className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  placeholder="Enter Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update state
                  required
                />
                <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
              </span>
            </label>
            <div className="mt-4 flex items-center justify-between space-x-2">
              {/* <label className="inline-flex items-center space-x-2">
                <input
                  className="form-checkbox is-basic size-5 rounded border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
                  type="checkbox"
                />
                <span className="line-clamp-1">Remember me</span>
              </label> */}
              <Link
                href="/forgotpassword"
                className="text-xs text-slate-400 transition-colors line-clamp-1 hover:text-slate-800 focus:text-slate-800 dark:text-navy-300 dark:hover:text-navy-100 dark:focus:text-navy-100"
              >
                Forgot Password?
              </Link>
            </div>
            <button   type="submit" className="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
            {loading ? "Signing In..." : "Sign In"}

            </button>

            </form>
          {error && <p className="mt-3 text-red-500">{error}</p>}
          </div>
        </div>
      </main>

    </div>
  );
};

export default Login;




// import React from "react";

// const page = () => {
//   return (
//     <div>
//       <div className="justify-items-center">
//         <div className="card">
//           <div className="h-24 rounded-t-lg bg-primary dark:bg-accent">
//             <img
//               className="h-full w-full rounded-t-lg object-cover object-center"
//               src="images/object/object-2.jpg"
//               alt="image"
//             />
//           </div>
//           <div className="px-4 py-2 sm:px-5">
//             <div className="flex justify-between space-x-4">
//               <div className="avatar -mt-12 size-20">
//                 <img
//                   className="rounded-full border-2 border-white dark:border-navy-700"
//                   src="images/avatar/avatar-4.jpg"
//                   alt="avatar"
//                 />
//               </div>
//               <div className="flex space-x-2">
//                 <button className="btn h-7 w-7 rounded-full bg-primary/10 p-0 text-primary hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-accent-light/10 dark:text-accent-light dark:hover:bg-accent-light/20 dark:focus:bg-accent-light/20 dark:active:bg-accent-light/25">
//                   <i className="fab fa-twitter" />
//                 </button>
//                 <button className="btn h-7 w-7 rounded-full bg-primary/10 p-0 text-primary hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-accent-light/10 dark:text-accent-light dark:hover:bg-accent-light/20 dark:focus:bg-accent-light/20 dark:active:bg-accent-light/25">
//                   <i className="fab fa-instagram text-base" />
//                 </button>
//                 <button className="btn h-7 w-7 rounded-full bg-primary/10 p-0 text-primary hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-accent-light/10 dark:text-accent-light dark:hover:bg-accent-light/20 dark:focus:bg-accent-light/20 dark:active:bg-accent-light/25">
//                   <i className="fab fa-facebook-f" />
//                 </button>
//               </div>
//             </div>
//             <h3 className="pt-2 text-lg font-medium text-slate-700 dark:text-navy-100">
//               Konnor Guzman
//             </h3>
//             <p className="text-xs">USA, Washington DC</p>
//             <div className="flex items-center space-x-4 pt-2">
//               <div className="w-9/12">
//                 <div
//                   className="ax-transparent-gridline"
//                   x-init="$nextTick(() => { $el._x_chart = new ApexCharts($el,pages.charts.cardUser1); $el._x_chart.render() });"
//                   style={{ minHeight: 85 }}
//                 >
                
//                 </div>
//               </div>
//               <div className="w-3/12 text-center">
//                 <p className="text-xl font-medium text-slate-700 dark:text-navy-100">
//                   24
//                 </p>
//                 <p className="text-xs+">Posts</p>
//               </div>
//             </div>
//             <div className="flex justify-center space-x-3 py-3">
//               <button className="btn size-9 rounded-full bg-slate-150 p-0 font-medium text-slate-800 hover:bg-slate-200 hover:shadow-lg hover:shadow-slate-200/50 focus:bg-slate-200 focus:shadow-lg focus:shadow-slate-200/50 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:hover:shadow-navy-450/50 dark:focus:bg-navy-450 dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90">
//                 <i className="fa fa-video text-xs+" />
//               </button>
//               <button className="btn size-9 rounded-full bg-slate-150 p-0 font-medium text-slate-800 hover:bg-slate-200 hover:shadow-lg hover:shadow-slate-200/50 focus:bg-slate-200 focus:shadow-lg focus:shadow-slate-200/50 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:hover:shadow-navy-450/50 dark:focus:bg-navy-450 dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90">
//                 <i className="fa-solid fa-comment-dots" />
//               </button>
//               <button className="btn size-9 rounded-full bg-slate-150 p-0 font-medium text-slate-800 hover:bg-slate-200 hover:shadow-lg hover:shadow-slate-200/50 focus:bg-slate-200 focus:shadow-lg focus:shadow-slate-200/50 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:hover:shadow-navy-450/50 dark:focus:bg-navy-450 dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90">
//                 <i className="fa fa-ellipsis-h" />
//               </button>
//             </div>
//           </div>
//         </div>
     
//       </div>
//     </div>
//   );
// };

// export default page;
