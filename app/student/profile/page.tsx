

"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { MdDateRange, MdEdit } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";
import { CgUserList } from "react-icons/cg";
import { IoIosArrowDropup } from "react-icons/io";



const page = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showAttedence, setShowAttedence] = useState(false);

   const [studentDetails] = useState({
    //  name: "John Doe",
    //  mobileNo: "1234567890",
    //  joiningDate: "2023-09-01",
    //  completedClasses: 15,
   
      "name": "John Doe",
      "mobileNo": "1234567890",
      "joiningDate": "2023-09-01",
      "completedClasses": 15
   
   });
 
   const qrCodeRef = useRef<HTMLCanvasElement | null>(null);
   const fileInputRef = useRef<HTMLInputElement | null>(null);
 
   const gender = "male";
   const defaultAvatar = gender === "male" ? "/male.webp" : "/female.webp";
 
  //  useEffect(() => {
  //    const generateQrCode = async () => {
  //      if (qrCodeRef.current) {
  //        const qrCodeText = `Name: ${studentDetails.name}, ID: ${studentDetails.mobileNo}`;
  //        try {
  //          await QRCode.toCanvas(qrCodeRef.current, qrCodeText, { width: 200 });
  //        } catch (err) {
  //          console.error("Error generating QR code:", err);
  //        }
  //      }
  //    };
 
  //    generateQrCode(); // ✅ Auto-generate QR code on component mount
  //  }, [studentDetails]);
 

  useEffect(() => {
    // const generateQrCode = async () => {
    //   if (qrCodeRef.current) {
    //     const qrCodeText = JSON.stringify({
    //       name: studentDetails.name,
    //       mobileNo: studentDetails.mobileNo,
    //       joiningDate: studentDetails.joiningDate,
    //       completedClasses: studentDetails.completedClasses,
    //     });
  
    //     try {
    //       await QRCode.toCanvas(qrCodeRef.current, qrCodeText, { width: 200 });
    //     } catch (err) {
    //       console.error("Error generating QR code:", err);
    //     }
    //   }
    // };
    const generateQrCode = async () => {
      if (qrCodeRef.current) {
        // const qrCodeText = JSON.stringify({
        //   name: studentDetails.name,
        //   mobileNo: studentDetails.mobileNo,
        //   joiningDate: studentDetails.joiningDate,
        //   completedClasses: studentDetails.completedClasses,
        // });
        const qrCodeText = JSON.stringify({
          name: studentDetails.name,
          mobileNo: studentDetails.mobileNo,
          joiningDate: studentDetails.joiningDate,
          completedClasses: studentDetails.completedClasses,
        });
        console.log("Generated QR Code Text:", qrCodeText);
        try {
          await QRCode.toCanvas(qrCodeRef.current, qrCodeText, { width: 200 });
        } catch (err) {
          console.error("Error generating QR code:", err);
        }
      }
    };
    generateQrCode();
  }, [studentDetails]);
  
   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
     const file = event.target.files?.[0];
     const reader = new FileReader();
     reader.onloadend = () => {
       setProfileImage(reader.result?.toString() ?? null);
       setIsEditing(true);
     };
     if (file) {
       reader.readAsDataURL(file);
     }
   };
 
   const triggerFileInput = () => {
     if (fileInputRef.current) {
       fileInputRef.current.click();
     }
   };

  //  table

  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      name: "john",
      date: "2024-11-01",
      checkinTime: "08:30 AM",
      checkoutTime: "10:30 AM",
     completed_class:"1",
     pending_class:"14",
     
    },
    {
      id: 2,
      name: "Riya",
      date: "2024-11-02",
      checkinTime: "09:00 AM",
      checkoutTime: "11:00 AM",
      completed_class:"2",
      pending_class:"13",
    },
    {
      id: 3,
      name: "Smith",
      date: "2024-11-03",
      checkinTime: "08:45 AM",
      checkoutTime: "10:45 AM",
      completed_class:"3",
      pending_class:"12",
    },
  ]);
  
  return (
    <main className="main-content w-full px-[var(--margin-x)] pb-8">
    <div className="justify-center justify-items-center">
    <div className="justify-items-center">
      <div className="card">
        <div className="h-24 rounded-t-lg bg-primary dark:bg-accent">
          {/* <img
            className="h-full w-full rounded-t-lg object-cover object-center"
            src=""
            alt="image"
          /> */}
        </div>
        <div className="px-4 py-2 sm:px-5">
          <div className="flex justify-between space-x-4">
            <div className="avatar -mt-12 size-20">
              <img
                className="rounded-full border-2 border-white dark:border-navy-700"
                src="/profile.png"
                alt="avatar"
              />
            </div>
            {/* <div className="flex space-x-2">
              <button className="btn h-7 w-7 rounded-full bg-primary/10 p-0 text-primary hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-accent-light/10 dark:text-accent-light dark:hover:bg-accent-light/20 dark:focus:bg-accent-light/20 dark:active:bg-accent-light/25">
                <i className="fab fa-twitter" />
              </button>
              <button className="btn h-7 w-7 rounded-full bg-primary/10 p-0 text-primary hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-accent-light/10 dark:text-accent-light dark:hover:bg-accent-light/20 dark:focus:bg-accent-light/20 dark:active:bg-accent-light/25">
                {/* <i className="fab fa-instagram text-base" /> */}
                {/* {studentDetails.joiningDate}
              </button>
              <button className="btn h-7 w-7 rounded-full bg-primary/10 p-0 text-primary hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-accent-light/10 dark:text-accent-light dark:hover:bg-accent-light/20 dark:focus:bg-accent-light/20 dark:active:bg-accent-light/25">
                {/* <i className="fab fa-facebook-f" /> */}
                {/* <FaGraduationCap className="mr-2" />
                   {studentDetails.completedClasses} Classes
              </button>
            </div> */} 
            <h3 className="pt-2 text-lg font-medium text-slate-700 dark:text-navy-100">
          {studentDetails.name}
          </h3>
          <h4 className="text-gray-600 mb-6">Phone: {studentDetails.mobileNo}</h4>
          </div>
          {/* <h3 className="pt-2 text-lg font-medium text-slate-700 dark:text-navy-100">
          {studentDetails.name}
          </h3> */}
          {/* <p className="text-xs">USA, Washington DC</p> */}
          <div className="flex items-center justify-items-center justify-center pt-2">
            {/* <div className="w-9/12">
              <div
                className="ax-transparent-gridline"
                x-init="$nextTick(() => { $el._x_chart = new ApexCharts($el,pages.charts.cardUser1); $el._x_chart.render() });"
                style={{ minHeight: 85 }}
              >
              
              </div>
            </div> */}
            


                   {/* QR Code */}
         <div className="flex flex-col items-center">
           <canvas ref={qrCodeRef} className="mb-4" />
         </div>


          </div>
          <div className="flex justify-center space-x-3 py-3">
            
            <button
            onClick={() =>
              setShowAttedence(!showAttedence)
            }
            className="btn size-9 rounded-full bg-slate-150 p-0 font-medium text-slate-800 hover:bg-slate-200 hover:shadow-lg hover:shadow-slate-200/50 focus:bg-slate-200 focus:shadow-lg focus:shadow-slate-200/50 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:hover:shadow-navy-450/50 dark:focus:bg-navy-450 dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90">
              {/* <i className="fa-solid fa-comment-dots" /> */}
              {showAttedence ? <IoIosArrowDropup /> :  <CgUserList />}
             
            </button>
            {/* <button
                      onClick={() =>
                        setShowAttedence(!showAttedence)
                      }
                      className="bg-[#2a283a] text-white px-4 py-2 rounded-full w-full border-2 border-[#E8006F] hover:border-[#18b2de]"
                      style={{ marginTop: "5%" }}
                    >
                      {showAttedence ? "Hide" : "Show"} Transaction
                      History
                    </button> */}
          </div>
        </div>
      </div>
   {showAttedence && (
          <div className="mt-5">
          <div className="overflow-x-auto w-full">
    <table className="is-hoverable w-full text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap rounded-l-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  SL No
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Date
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Driver
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Check-In Time
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Check-Out Time
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Completed Classes
                  </th>
                 
                  <th className="whitespace-nowrap rounded-r-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Pending Classes
                  </th> 
            
                </tr>
              </thead>
              <tbody>
              {attendanceData.map((item, index) => (
                <tr key={item.id} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                  <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                  {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                  {item.date}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                  {item.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                  {item.checkinTime}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                  {item.checkoutTime}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                  {item.completed_class}
                  </td>
                  <td className="whitespace-nowrap rounded-r-lg px-4 py-3 sm:px-5">
                  {item.pending_class}
                  </td>
                </tr>
    
                 ))}
              </tbody>
            </table>
          </div>
        </div>
  
          )}
    </div>
  </div>
  </main>
  )
}

export default page

