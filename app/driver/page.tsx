'use client'

import withAuth from "@/hoc/withAuth";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";



const DriverDashboard = () => {
   const { state, clearAuthData  } = useAuth();
  
   
    return (
      <div>
        <h1>Driver Dashboard</h1>
       
        </div>
      )};
      
export default DriverDashboard; 
