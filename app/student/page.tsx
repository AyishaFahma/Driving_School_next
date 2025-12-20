'use client'

import withAuth from "@/hoc/withAuth";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";


const StudentDashboard = () => {
   const { state, clearAuthData  } = useAuth();
  
   
    return (
      <div>
        <h1>Student Dashboard</h1>
       
        </div>
      )};

      export default StudentDashboard
// export default withAuth(StudentDashboard, ['student']); 


