



// "use client";
// import withAuth from "@/hoc/withAuth";
// import React, { useEffect, useState } from "react";


// import { useAuth } from "../context/AuthContext";
// import { data } from "autoprefixer";

// import { useRouter } from "next/navigation";
// import Chart from "./Chart";



// type Dashboard = {
//   id: string;
//   // expiry_datas:string;
//   message: string;
//   total_users: string;
//   monthly_users: string;
//   today_users: string;
//   today_income: string;
//   income: string;
//   expense: string;
//   profit: string;
//   months: string;
//   date: string;
//   status: string;
//   total_amount:string;

// };

// const StaffPage = () => {
//   const { state } = useAuth();
//   const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
//   // const [graphData, setGraphData] = useState<Dashboard[]>([]);
//   const [graphData, setGraphData] = useState<Dashboard | null>(null);
//   const [expiryDatas, setexpiryDatas] = useState<Dashboard[]>([]);
//   // const [today_income, setToday_income] = useState<Dashboard[]>([]);
//   const [today_income, setToday_income] = useState<Dashboard | null>(null);
//   today_income;
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const router = useRouter();

//   useEffect(() => {
//     // Check if this is the first load after login
//     const hasVisitedAdmin = sessionStorage.getItem("hasVisitedAdmin");

//     if (!hasVisitedAdmin) {
//       // Reload only on first access
//       sessionStorage.setItem("hasVisitedAdmin", "true");
//       window.location.reload();
//     }
//   }, []);



//   useEffect(() => {
//     // console.log("Updated Graph Data:", graphData);
//   }, [graphData]); 

//   const fetchDashboardData = async () => {
//     try {
//       const response = await fetch("/api/staff/dashboard/dashboard", {
//         method: "POST",
//         headers: {
//           authorizations: state?.accessToken ?? "",
//           // 'authorizations': token ?? '',
//           api_key: "10f052463f485938d04ac7300de7ec2b", // Make sure the API key is correct
//         },
//         body: JSON.stringify({ user_id: null }),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         // console.error('API error:', errorData);
//         throw new Error(
//           `HTTP error! Status: ${response.status} - ${
//             errorData.message || "Unknown error"
//           }`
//         );
//       }

//       const data = await response.json();
// //  console.log("API Response:", data);
//       if (data.success) {
//         setDashboardData(data.data.dashboard_datas || []);
//         setGraphData(data.data.graph || []);
//         setexpiryDatas(data.data.expiry_datas || []);
//         setToday_income(data.data.today_income || []);
     
//       } else {
//         // console.error("API error:", data.msg || "Unknown error");
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, [state]);
//   return (
//     <>
//       <div className="flex items-center space-x-4 py-5 lg:py-6">
//         <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
//           Hi, Welcome back!
//         </h2>
//         <div className="hidden h-full py-1 sm:flex">
//           <div className="h-full w-px bg-slate-300 dark:bg-navy-600" />
//         </div>
//         <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
//           <li className="flex items-center space-x-2">
//             <a
//               className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
//               href="#"
//             >
//               Home
//             </a>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="size-4"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </li>
//           <li>Dashboard</li>
//         </ul>
//       </div>

//       <div className="mt-4 mb-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
//         {dashboardData && (
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
//             <div className="card flex-row justify-between p-4">
//               <div>
//                 <p
//                   // className="text-xs+ uppercase"
//                   className="text-xl font-medium text-slate-700 dark:text-navy-100"
//                 >
//                   Total <br />
//                   Customers
//                 </p>
//                 <div className="mt-8 flex items-baseline space-x-1">
//                   <p className="text-2xl font-semibold text-warning">
//                     {dashboardData.total_users}
//                   </p>
//                   {/* <p className="text-xs text-success"></p> */}
//                 </div>
//               </div>
//               <div className="mask is-squircle flex size-10 items-center justify-center bg-warning/10">
//                 <i className="fa-solid fa-user text-2xl text-warning" />
//               </div>
//               <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
//                 <i className="fa-solid fa-user translate-x-1/4 translate-y-1/4 text-5xl opacity-15" />
//               </div>
//             </div>
//             <div className="card flex-row justify-between p-4">
//               <div>
//                 <p
//                   // className="text-xs+ uppercase"
//                   className="text-xl font-medium text-slate-700 dark:text-navy-100"
//                 >
//                   Monthly <br />
//                   Customers
//                 </p>
//                 <div className="mt-8 flex items-baseline space-x-1">
//                   <p className="text-2xl font-semibold text-info">
//                     {dashboardData.monthly_users}
//                   </p>
//                   {/* <p className="text-xs text-success"></p> */}
//                 </div>
//               </div>
//               <div className="mask is-squircle flex size-10 items-center justify-center bg-info/10">
//                 <i className="fa-solid fa-user text-2xl text-info" />
//               </div>
//               <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
//                 <i className="fa-solid fa-user translate-x-1/4 translate-y-1/4 text-5xl opacity-15" />
//               </div>
//             </div>
//             <div className="card flex-row justify-between p-4">
//               <div>
//                 <p
//                   // className="text-xs+ uppercase"
//                   className="text-xl font-medium text-slate-700 dark:text-navy-100"
//                 >
//                   Today <br />
//                   Customers
//                 </p>
//                 <div className="mt-8 flex items-baseline space-x-1">
//                   <p className="text-2xl font-semibold text-success">
//                     {dashboardData.today_users}
//                   </p>
//                   {/* <p className="text-xs text-success"></p> */}
//                 </div>
//               </div>
//               <div className="mask is-squircle flex size-10 items-center justify-center bg-success/10">
//                 <i className="fa-solid fa-user text-2xl text-success" />
//               </div>
//               <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
//                 <i className="fa-solid fa-user translate-x-1/4 translate-y-1/4 text-5xl opacity-15" />
//               </div>
//             </div>
//             <div className="card flex-row justify-between p-4">
//               <div>
//                 <p
//                   // className="text-xs+ uppercase"
//                   className="text-xl font-medium text-slate-700 dark:text-navy-100"
//                 >
//                   Today <br />
//                   Income
//                 </p>
//                 <div className="mt-8 flex items-baseline space-x-1">
//                   <p className="text-2xl font-semibold text-error">
//                     {dashboardData.today_income}
//                   </p>
//                   {/* <p className="text-xs text-error"></p> */}
//                 </div>
//               </div>
//               <div className="mask is-squircle flex size-10 items-center justify-center bg-error/10">
//                 <i className="fa-solid fa-dollar-sign text-2xl text-error" />
//               </div>
//               <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
//                 <i className="fa-solid fa-dollar-sign translate-x-1/4 translate-y-1/4 text-5xl opacity-15" />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 w-full">
//           <div className="card p-4 w-full">
//             <div className="flex justify-between space-x-2">
//               <div className="flex flex-1 flex-col justify-between">
//                 <div>
//                   <p
//                    className="font-medium text-xl text-slate-700 outline-none transition-colors line-clamp-2 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
//                   >
//                     Vehicle Details
//                   </p>

//                 </div>
//               </div>
//               <img
//                 className="size-24 rounded-lg object-cover"
//                 src="/expired.png"
//                 alt="image"
//               />
//             </div>
//             {expiryDatas.length > 0 ? (
//               expiryDatas.map((item) => (
//                 <div className="alert mt-4 flex rounded-lg bg-warning px-4 py-4 text-white sm:px-5">
//                   {item.message}
//                 </div>
//               ))
//             ) : (
//               <div className="card p-4 w-full flex items-center justify-center">
//                 <p className="text-gray-500 dark:text-gray-300 text-lg">
//                   No details found
//                 </p>
//               </div>
//             )}
//           </div>

//           <div className="card p-4 w-full">
//             <div className="flex justify-between space-x-2">
//               <div className="flex flex-1 flex-col justify-between">
//                 <div>
//                   <p
//                     className="font-medium text-xl text-slate-700 outline-none transition-colors line-clamp-2 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
//                   >
//                     Today Accounts
//                   </p>
                 
//                 </div>
//               </div>
//               <img
//                 className="size-24 rounded-lg object-cover"
//                 src="/income.png"
//                 alt="image"
//               />
//             </div>
//             {today_income ? (
//             // {today_income.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
//                   <thead>
//                     <tr 
//                     // className="bg-green-500 text-white"
//                     className="bg-success text-white"
//                     >
//                       <th className="px-4 py-3 text-left border border-gray-300 dark:border-gray-600">
//                         Income
//                       </th>
//                       <th className="px-4 py-3 text-left border border-gray-300 dark:border-gray-600">
//                         Expense
//                       </th>
//                       <th className="px-4 py-3 text-left border border-gray-300 dark:border-gray-600">
//                         Profit
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr className="bg-green-100 dark:bg-gray-800 hover:bg-green-200 dark:hover:bg-gray-700 transition">
//                       <td className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-green-700 dark:text-green-400 font-semibold">
//                         {today_income.income}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 font-semibold">
//                         {today_income.expense}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 font-semibold">
//                         {today_income.total_amount}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="card p-4 w-full flex items-center justify-center">
//                 <p className="text-gray-500 dark:text-gray-300 text-lg">
//                   No details found
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>


// <div className="card mt-4 p-4">
//    <h6 className="text-xl font-medium text-slate-700 dark:text-navy-100">Accounts Overview</h6>
  
//   {graphData &&(
 
//     <Chart data={graphData} />
  
//   )}
// </div>
//     </>
//   );
// };


// export default withAuth(StaffPage, ["staff"]);




"use client";
import withAuth from "@/hoc/withAuth";
import React, { useEffect, useState } from "react";


import { useAuth } from "../context/AuthContext";
import { data } from "autoprefixer";
import Chart from "./Chart";
import { useRouter } from "next/navigation";
import { FaChartPie } from "react-icons/fa";



type Dashboard = {
  id: string;
  // expiry_datas:string;
  message: string;
  total_users: string;
  monthly_users: string;
  today_users: string;
 today_income: string;
  income: string;
  expense: string;
  profit: string;
  months: string;
  date: string;
  status: string;
  total_amount:string;


};
interface DashboardData {
  expiry_datas: any[]; 
  today_income: {
    income: number;
    expense:number;
    total_amount:number;
  };
  graph: any | null;
  dashboard_datas: any | null;
}
const StaffPage = () => {
  const { state } = useAuth();
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  // const [graphData, setGraphData] = useState<Dashboard[]>([]);
  // const [data, setData] = useState<Dashboard[]>([]);
  const [data, setData] = useState<DashboardData>({
    expiry_datas: [],
    today_income: { income: 0 ,expense:0 , total_amount:0},  // ✅ Initialize with `income: 0`
    graph: null,
    dashboard_datas: null,
  });
  // const [data, setData] = useState({
  //   expiry_datas: [],
  //   today_income: {},
  //   graph: null,
  //   dashboard_datas: null,
  // });
  const [graphData, setGraphData] = useState<Dashboard | null>(null);
  const [expiryDatas, setexpiryDatas] = useState<Dashboard[]>([]);
  // const [today_income, setToday_income] = useState<Dashboard[]>([]);
  const [today_income, setToday_income] = useState<Dashboard | null>(null);
  today_income;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Check if this is the first load after login
    const hasVisitedAdmin = sessionStorage.getItem("hasVisitedAdmin");

    if (!hasVisitedAdmin) {
      // Reload only on first access
      sessionStorage.setItem("hasVisitedAdmin", "true");
      window.location.reload();
    }
  }, []);



  useEffect(() => {
   // console.log("Updated Graph Data:", graphData);
  }, [graphData]); 

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/staff/dashboard/dashboard", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          // 'authorizations': token ?? '',
          api_key: "10f052463f485938d04ac7300de7ec2b", // Make sure the API key is correct
        },
        body: JSON.stringify({ user_id: null }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        // console.error('API error:', errorData);
        throw new Error(
          `HTTP error! Status: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
 console.log("API Response:", data.data);
      if (data.success) {
       // setDashboardData(data.data.dashboard_datas || []);
       // setGraphData(data.data.graph || []);
       // setexpiryDatas(data.data.expiry_datas || []);
       // setToday_income(data.data.today_income || []);
     setData(data.data || []);
      } else {
        // console.error("API error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [state]);
  return (
    <>
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Hi, Welcome back!
        </h2>
        <div className="hidden h-full py-1 sm:flex">
          <div className="h-full w-px bg-slate-300 dark:bg-navy-600" />
        </div>
        <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
          <li className="flex items-center space-x-2">
            <a
              className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
              href="#"
            >
              Home
            </a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li>Dashboard</li>
        </ul>
      </div>

    
{data && (
  <>
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">

  <div className="relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-info to-info-focus p-3.5">
    <p className="text-xs uppercase text-sky-100">Total Customer</p>
    <div className="flex items-end justify-between space-x-2">
      <p className="mt-4 text-2xl font-medium text-white">
      {data?.dashboard_datas?.total_users ?? 0}
      </p>
      <a href="#" className="border-b border-dotted border-current pb-0.5 text-xs font-medium text-sky-100 outline-hidden transition-colors duration-300 line-clamp-1 hover:text-white focus:text-white">
      
                <i className="fa-solid fa-user text-2xl text-white" />
            
      
      </a>
    </div>
    <div className="mask is-reuleaux-triangle absolute top-0 right-0 -m-3 size-16 bg-white/20" />
  </div>

  <div className="relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 p-3.5">
    <p className="text-xs uppercase text-amber-50">Monthly Customer</p>
    <div className="flex items-end justify-between space-x-2">
      <p className="mt-4 text-2xl font-medium text-white">
      {data?.dashboard_datas?.monthly_users ?? 0}
      </p>
      <a href="#" className="border-b border-dotted border-current pb-0.5 text-xs font-medium text-amber-50 outline-hidden transition-colors duration-300 line-clamp-1 hover:text-white focus:text-white">
      <i className="fa-solid fa-user text-2xl text-white" />
      </a>
    </div>
    <div className="mask is-diamond absolute top-0 right-0 -m-3 size-16 bg-white/20" />
  </div>

  <div className="relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 p-3.5">
    <p className="text-xs uppercase text-pink-100">Today Customer</p>
    <div className="flex items-end justify-between space-x-2">
      <p className="mt-4 text-2xl font-medium text-white">
      {data?.dashboard_datas?.today_users ?? 0}
      </p>
      <a href="#" className="border-b border-dotted border-current pb-0.5 text-xs font-medium text-pink-100 outline-hidden transition-colors duration-300 line-clamp-1 hover:text-white focus:text-white">
      <i className="fa-solid fa-user text-2xl text-white" />
      </a>
    </div>
    <div className="mask is-hexagon-2 absolute top-0 right-0 -m-3 size-16 bg-white/20" />
  </div>



  <div className="relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-3.5">
    <p className="text-xs uppercase text-purple-100">Today income</p>
    <div className="flex items-end justify-between space-x-2">
      <p className="mt-4 text-2xl font-medium text-white">
      {/* Income: {data.today_income.income} */}
      {data?.dashboard_datas?.today_income ?? 0}
      {/* {data?.today_income?.income ?? 0} */}
      </p>
      <a href="#" className="border-b border-dotted border-current pb-0.5 text-xs font-medium text-purple-100 outline-hidden transition-colors duration-300 line-clamp-1 hover:text-white focus:text-white">
      {/* <i className="fa-solid fa-dollar-sign text-2xl text-white" /> */}
      <i className="text-2xl text-white">
        <FaChartPie/>
      </i>
      </a>
    </div>
    <div className="mask is-star absolute top-0 right-0 -m-3 size-16 bg-white/20" />
  </div>


</div>
{/* //card2 */}

      <div className="flex items-center justify-between">
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 w-full">
          <div className="card p-4 w-full">
            <div className="flex justify-between space-x-2">
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p
                   className="font-medium text-xl text-slate-700 outline-none transition-colors line-clamp-2 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
                  >
                    Vehicle Details
                  </p>

                </div>
              </div>
              <img
                className="size-24 rounded-lg object-cover"
                src="/expired.png"
                alt="image"
              />
            </div>
            {data.expiry_datas.length > 0 ? (
              data.expiry_datas.map((item) => (
                <div className="alert mt-4 flex rounded-lg bg-warning px-4 py-4 text-white sm:px-5">
                  {item.message}
                </div>
              ))
            ) : (
              <div className="card p-4 w-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-300 text-lg">
                  No details found
                </p>
              </div>
            )}
          </div>

          <div className="card p-4 w-full">
            <div className="flex justify-between space-x-2">
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p
                    className="font-medium text-xl text-slate-700 outline-none transition-colors line-clamp-2 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
                  >
                    Today Accounts
                  </p>
                 
                </div>
              </div>
              <img
                className="size-24 rounded-lg object-cover"
                src="/income.png"
                alt="image"
              />
            </div>
            {data.today_income ? (
            // {today_income.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr 
                    // className="bg-green-500 text-white"
                    className="bg-success text-white"
                    >
                      <th className="px-4 py-3 text-left border border-gray-300 dark:border-gray-600">
                        Income
                      </th>
                      <th className="px-4 py-3 text-left border border-gray-300 dark:border-gray-600">
                        Expense
                      </th>
                      <th className="px-4 py-3 text-left border border-gray-300 dark:border-gray-600">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-green-100 dark:bg-gray-800 hover:bg-green-200 dark:hover:bg-gray-700 transition">
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-green-700 dark:text-green-400 font-semibold">
                        {data.today_income.income}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 font-semibold">
                        {data.today_income.expense}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 font-semibold">
                        {data.today_income.total_amount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card p-4 w-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-300 text-lg">
                  No details found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>


<div className="card mt-4 p-4">
   <h6 className="text-xl font-medium text-slate-700 dark:text-navy-100">Accounts Overview</h6>
  
  {data.graph &&(
 
    <Chart data={data.graph} />
  
  )}
</div>
</>
)}
    </>
  );
};

// export default page
export default withAuth(StaffPage, ["staff"]);
//only users with staff role and valid token can acess this page