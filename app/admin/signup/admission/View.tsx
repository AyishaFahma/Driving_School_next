'use clinet'
import React, { useEffect, useRef } from 'react'
import { IoCloseOutline } from 'react-icons/io5';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';


type Viewprops = {
  showViewModal: boolean;
  toggleViewModal: () => void;
  singleData: any
  
}

export default function View({ showViewModal, toggleViewModal, singleData  }: Viewprops) {

  console.log("this is view page");
  console.log("view page single item", singleData);
  //singleData = { : "" , : "" , ...}

  const formRef = useRef<HTMLDivElement>(null)


  const handleDownload = async () => {
    if (!formRef.current) return;

    // temporarily expand the modal to show everything
    const element = formRef.current;
    element.style.overflow = 'visible';
    element.style.height = 'auto';

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('form-details.pdf');


    // modal closing when download button click
    toast.success("Downloaded Successfully")
    
    setTimeout( ()=>{
       toggleViewModal()
    },4000)
  };

  

  return (
    <>
  
      <div 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        role="dialog" >

        <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300">
        </div>

        {/* Modal content */}
        <div className="relative flex w-full max-w-6xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-navy-700 " >

          {/* Modal Header */}
          <div className="flex justify-between items-center rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
              View Admission
            </h3>
            {/* download */}
            <div className='flex justify-between items-center gap-x-5'>
              <button onClick={handleDownload} className='bg-gray-600 md:p-3 p-2 rounded-lg text-white md:text-xl'>Download</button>

              <button
                onClick={toggleViewModal}
                className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 text-3xl">
                <IoCloseOutline />
              </button>
            </div>

          </div>

          {/* pdf content */}
          {/* Modal Body */}
          <div ref={formRef}>
            <form className="mb-8" >
              <div className="flex flex-col sm:flex-row  px-4 py-4 sm:px-5 gap-8 hide-scrollbar scrollable-content max-h-[80vh] overflow-y-auto">
                {/* left section */}
                <div className="flex-1 p-4">


                  <div className="flex flex-col space-y-8 sm:flex-row sm:space-y-0 sm:space-x-8">
                    <div className="flex-1 p-4 border border-gray-300 shadow-md rounded-lg ">
                      <label className="p-4 block mt-2 text-lg font-medium text-slate-700 dark:text-navy-100">
                        Profile Information
                      </label>
                      {/* Profile Information */}
                      <div className="mb-4 p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                          {/* Admission No */}
                          <label className="block">
                            <span>Admission No</span>
                            <span className="relative mt-1 flex">

                              <input
                                name="admission_no"
                                //  value={formData.name}
                                value={singleData.admission_no ? singleData.admission_no : ""}

                                className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"

                                type="text" readOnly />
                            </span>
                          </label>

                          {/* Application No */}
                          <label className="block">
                            <span>Application No</span>
                            <span className="relative mt-1 flex">
                              <input
                                name="app_no"

                                value={singleData.app_no ? singleData.app_no : ""}

                                className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"

                                type="text" readOnly
                              />
                            </span>
                          </label>

                          {/* name */}
                          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2"> */}
                          <label className="block">
                            <span>Name</span>
                            <span className="relative mt-1 flex">
                              <input
                                name="first_name"
                                //  value={formData.name}
                                value={singleData.first_name}

                                className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"

                                type="text" readOnly
                              />
                            </span>
                          </label>
                          {/* mobile*/}
                          <label className="block">
                            <span>Mobile</span>
                            <span className="relative mt-1 flex">
                              <input
                                name="mobile"

                                value={singleData.mobile}

                                className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"

                                type="text" readOnly

                              />
                            </span>
                          </label>
                        </div>
                        {/* dob,address */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                          <label className="block mt-2">
                            <span>D-O-B</span>
                            <span className="relative mt-1 flex">
                              <input
                                name="dob"
                                value={singleData.dob ? singleData.dob : "null"}

                                className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"

                                type="date" readOnly
                              />
                            </span>
                          </label>
                          <label className="block mt-2">
                            <span>Address</span>
                            <span className="relative mt-1 flex">

                              <textarea
                                name="address"
                                rows={4}
                                value={singleData.address ? singleData.address : "null"}

                                className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                                readOnly
                              />
                            </span>
                          </label>
                        </div>
                        {/* Additional Fields */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">

                          {/*DL No:*/}
                          <label className="block mt-2">
                            <span>DL No:</span>
                            <span className="relative flex mt-1">
                              <input
                                name="first_name"
                                //  value={formData.name}
                                value={singleData.first_name}

                                className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"

                                type="text" readOnly
                              />
                            </span>
                          </label>
                          {/* Blood Group*/}
                          <label className="block mt-2">
                            <span>Blood Group</span>
                            <span className="relative mt-1 flex">
                              <input type="text" readOnly className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={singleData.blood_group} />
                            </span>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                          {/* gender*/}
                          <label className="block mt-2">
                            <span>Gender</span>
                            <span className="relative mt-1 flex">
                              <input type="text" readOnly className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={singleData.gender} />
                            </span>
                          </label>
                          {/* branch name */}
                          <div className="relative w-full mt-2" >
                            <label htmlFor="mobile" className="block text-sm text-[#64748B] dark:text-[#A3ADC2]">
                              Branch Name
                            </label>

                            <input type="text" readOnly className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value={singleData.branch_name} />

                          </div>

                        </div>


                        <div className='p-3 my-5'>

                          <div className=" md:grid grid-cols-2 gap-5" >
                            {/* user image and signature */}
                            <div className='flex justify-center items-center flex-col gap-y-8 w-full '>

                              {/* user photo */}
                              {  singleData.user_photo && <div className='flex justify-center items-center flex-col'>
                                <label className='block text-sm text-[#64748B] dark:text-[#A3ADC2] mb-2'>User Profile</label>
                                {/* src={`https://our-demos.com/n/drivingschool_api/assets/images/documents/${singleData.user_photo}`} */}
                                <img src={`/api/image-proxy?url=https://our-demos.com/n/drivingschool_api/assets/images/documents/${singleData.user_photo}`} alt="" crossOrigin="anonymous" className="w-full max-w-xs md:max-w-sm h-auto max-h-52 object-contain rounded-lg shadow-md"/>
                              </div>}

                              {/* signature */}
                              {  singleData.signature && <div className='flex justify-center items-center flex-col'>
                                <label className='block text-sm text-[#64748B] dark:text-[#A3ADC2] mb-2'>Signature</label>
                                <img
                                  src={`/api/image-proxy?url=https://our-demos.com/n/drivingschool_api/assets/images/documents/${singleData.signature}`}
                                  crossOrigin="anonymous" className="w-full max-w-xs md:max-w-sm h-auto max-h-52 object-contain rounded-lg shadow-md"
                                />
                              </div> }

                            </div>

                            {/* documents */}
                            <div className='flex justify-center items-center flex-col gap-y-8  w-full md:mt-0 mt-5 '>

                              { singleData.documents && <div className='flex justify-center items-center flex-col'>
                                <label className='block text-sm text-[#64748B] dark:text-[#A3ADC2] mb-2'>Documents</label>
                                <img src={`/api/image-proxy?url=https://our-demos.com/n/drivingschool_api/assets/images/documents/${singleData.documents}`} alt="" crossOrigin="anonymous" className="w-full max-w-xs md:max-w-sm h-auto max-h-52 object-contain rounded-lg shadow-md"/>
                              </div> }

                            </div>
                          </div>
                        </div>



                        {/* end */}
                      </div>
                    </div>
                  </div>
                </div>


              </div>

            </form>
          </div>



        </div>
      </div>
    </>
  )
}
