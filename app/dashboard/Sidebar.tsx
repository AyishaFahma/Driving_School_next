"use client";

import React, { useState } from "react";
import { useDrawer } from "./DrawerContext";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Tooltip } from 'react-tooltip';

interface User {
  id: number;
  name: string;
  // other properties...
}

interface UserData {
  user_type: string;
  // other properties...
}

interface UserWithData extends User {
  data?: UserData; // Make data optional if it might not always be present
}

interface AuthState {
  user: UserWithData | null; // Ensure user can be UserWithData or null
  // other properties...
}

const Sidebar = () => {


  const { state, clearAuthData, setAuthData } = useAuth();

  const user = state?.user as UserWithData | null; // Assert user as UserWithData or null

  const userType = user?.data?.user_type; // Now TypeScript recognizes data
  // console.log(userType, "userType");
  const data = user?.data;
  // console.log(data, "data");

  const [activeTab, setActiveTab] = useState("dashboard");
  const { isDrawerVisible, toggleDrawer } = useDrawer();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpens, setIsDropdownOpens] = useState(false);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // New state for hiding the entire sidebar

  const handleToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleSidebarVisibility = () => {
    setIsSidebarVisible(!isSidebarVisible); // Toggle sidebar visibility without 'prev'
  };
  const router = useRouter();
  const showDashboard = () => setActiveTab("dashboard");
  const showUser = () => setActiveTab("user");
  const showStaff = () => setActiveTab("staff");
  const showProfile = () => setActiveTab("profile");

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearAuthData(); // Clear the context state as well
    router.push("/login");
  };
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleDropdownToggles = () => {
    setIsDropdownOpens(!isDropdownOpens);
  };



  return (
    <>
      {/* {user && ()} */}
      <link rel="stylesheet" href="/css/base.css" />
      <link rel="stylesheet" href="/dist/css/app.css" />

      {isSidebarVisible && (
        <div className="sidebar print:hidden">
          {/* Main Sidebar */}
          <div className="main-sidebar">
            <div className="flex h-full w-full flex-col items-center border-r border-slate-150 bg-white dark:border-navy-700 dark:bg-navy-800">
              {/* Application Logo */}
              <div className="flex pt-4">
                {/* <Link href="/"> */}
                <img
                  className="size-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                  src="/logo.png"
                  alt="logo"
                />
                {/* </Link> */}
              </div>
              {/* Main Sections Links */}



              {/*largeScren*/}

              {data?.user_type === "admin" ? (

                <div className="is-scrollbar-hidden flex grow flex-col space-y-4 overflow-y-auto pt-6 hidden lg:flex">
                  {/* Tooltip Component */}


                  <Link
                    href="/admin"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Dashboards"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      className="size-7"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fillOpacity=".3"
                        d="M5 14.059c0-1.01 0-1.514.222-1.945.221-.43.632-.724 1.453-1.31l4.163-2.974c.56-.4.842-.601 1.162-.601.32 0 .601.2 1.162.601l4.163 2.974c.821.586 1.232.88 1.453 1.31.222.43.222.935.222 1.945V19c0 .943 0 1.414-.293 1.707C18.414 21 17.943 21 17 21H7c-.943 0-1.414 0-1.707-.293C5 20.414 5 19.943 5 19v-4.94Z"
                      />
                      <path
                        fill="currentColor"
                        d="M3 12.387c0 .267 0 .4.084.441.084.041.19-.04.4-.204l7.288-5.669c.59-.459.885-.688 1.228-.688.343 0 .638.23 1.228.688l7.288 5.669c.21.163.316.245.4.204.084-.04.084-.174.084-.441v-.409c0-.48 0-.72-.102-.928-.101-.208-.291-.355-.67-.65l-7-5.445c-.59-.459-.885-.688-1.228-.688-.343 0-.638.23-1.228.688l-7 5.445c-.379.295-.569.442-.67.65-.102.208-.102.448-.102.928v.409Z"
                      />
                      <path
                        fill="currentColor"
                        d="M11.5 15.5h1A1.5 1.5 0 0 1 14 17v3.5h-4V17a1.5 1.5 0 0 1 1.5-1.5Z"
                      />
                      <path
                        fill="currentColor"
                        d="M17.5 5h-1a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5Z"
                      />
                    </svg>
                    <Tooltip id="main-sidebar-tooltip" className="dark:bg-navy-600" />
                  </Link>

                  {/* Admission */}
                  <Link
                    href="/admin/signup/admission"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Admission"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-6"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                  </Link>



                  {/* Master */}
                  <Link
                    href="/admin/settings/service-management"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Service Details"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                    <svg
                      className="size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillOpacity="0.25"
                        d="M21.0001 16.05V18.75C21.0001 20.1 20.1001 21 18.7501 21H6.6001C6.9691 21 7.3471 20.946 7.6981 20.829C7.7971 20.793 7.89609 20.757 7.99509 20.712C8.31009 20.586 8.61611 20.406 8.88611 20.172C8.96711 20.109 9.05711 20.028 9.13811 19.947L9.17409 19.911L15.2941 13.8H18.7501C20.1001 13.8 21.0001 14.7 21.0001 16.05Z"
                        fill="currentColor"
                      ></path>
                      <path
                        fillOpacity="0.5"
                        d="M17.7324 11.361L15.2934 13.8L9.17334 19.9111C9.80333 19.2631 10.1993 18.372 10.1993 17.4V8.70601L12.6384 6.26701C13.5924 5.31301 14.8704 5.31301 15.8244 6.26701L17.7324 8.17501C18.6864 9.12901 18.6864 10.407 17.7324 11.361Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M7.95 3H5.25C3.9 3 3 3.9 3 5.25V17.4C3 17.643 3.02699 17.886 3.07199 18.12C3.09899 18.237 3.12599 18.354 3.16199 18.471C3.20699 18.606 3.252 18.741 3.306 18.867C3.315 18.876 3.31501 18.885 3.31501 18.885C3.32401 18.885 3.32401 18.885 3.31501 18.894C3.44101 19.146 3.585 19.389 3.756 19.614C3.855 19.731 3.95401 19.839 4.05301 19.947C4.15201 20.055 4.26 20.145 4.377 20.235L4.38601 20.244C4.61101 20.415 4.854 20.559 5.106 20.685C5.115 20.676 5.11501 20.676 5.11501 20.685C5.25001 20.748 5.385 20.793 5.529 20.838C5.646 20.874 5.76301 20.901 5.88001 20.928C6.11401 20.973 6.357 21 6.6 21C6.969 21 7.347 20.946 7.698 20.829C7.797 20.793 7.89599 20.757 7.99499 20.712C8.30999 20.586 8.61601 20.406 8.88601 20.172C8.96701 20.109 9.05701 20.028 9.13801 19.947L9.17399 19.911C9.80399 19.263 10.2 18.372 10.2 17.4V5.25C10.2 3.9 9.3 3 7.95 3ZM6.6 18.75C5.853 18.75 5.25 18.147 5.25 17.4C5.25 16.653 5.853 16.05 6.6 16.05C7.347 16.05 7.95 16.653 7.95 17.4C7.95 18.147 7.347 18.75 6.6 18.75Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </Link>

                  {/* Accounts */}
                  <Link
                    href="/admin/accounts/daily-accounts"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Accounts"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      className="size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="8" r="4" fill="currentColor" />
                      <path
                        d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Link>

                  {/* Reports */}
                  <Link
                    href="/admin/report/payment-history"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Payment "
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      className="size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.85714 3H4.14286C3.51167 3 3 3.51167 3 4.14286V9.85714C3 10.4883 3.51167 11 4.14286 11H9.85714C10.4883 11 11 10.4883 11 9.85714V4.14286C11 3.51167 10.4883 3 9.85714 3Z"
                        fill="currentColor"
                      />
                      <path
                        d="M9.85714 12.8999H4.14286C3.51167 12.8999 3 13.4116 3 14.0428V19.757C3 20.3882 3.51167 20.8999 4.14286 20.8999H9.85714C10.4883 20.8999 11 20.3882 11 19.757V14.0428C11 13.4116 10.4883 12.8999 9.85714 12.8999Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                      <path
                        d="M19.757 3H14.0428C13.4116 3 12.8999 3.51167 12.8999 4.14286V9.85714C12.8999 10.4883 13.4116 11 14.0428 11H19.757C20.3882 11 20.8999 10.4883 20.8999 9.85714V4.14286C20.8999 3.51167 20.3882 3 19.757 3Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                      <path
                        d="M19.757 12.8999H14.0428C13.4116 12.8999 12.8999 13.4116 12.8999 14.0428V19.757C12.8999 20.3882 13.4116 20.8999 14.0428 20.8999H19.757C20.3882 20.8999 20.8999 20.3882 20.8999 19.757V14.0428C20.8999 13.4116 20.3882 12.8999 19.757 12.8999Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                    </svg>
                  </Link>


                  {/* licence report */}
                  <Link
                    href="/admin/report/licence-renewal"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Renewal Report"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>

                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}

                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
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
                  </button>
                </div>

              ) : data?.user_type === "staff" ? (
                //  {/* staff */}
                <div className="is-scrollbar-hidden flex grow flex-col space-y-4 overflow-y-auto pt-6 hidden lg:flex">
                  {/* Tooltip Component */}

                  <Link
                    href="/staff"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Dashboards"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >

                    <svg
                      className="size-7"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fillOpacity=".3"
                        d="M5 14.059c0-1.01 0-1.514.222-1.945.221-.43.632-.724 1.453-1.31l4.163-2.974c.56-.4.842-.601 1.162-.601.32 0 .601.2 1.162.601l4.163 2.974c.821.586 1.232.88 1.453 1.31.222.43.222.935.222 1.945V19c0 .943 0 1.414-.293 1.707C18.414 21 17.943 21 17 21H7c-.943 0-1.414 0-1.707-.293C5 20.414 5 19.943 5 19v-4.94Z"
                      />
                      <path
                        fill="currentColor"
                        d="M3 12.387c0 .267 0 .4.084.441.084.041.19-.04.4-.204l7.288-5.669c.59-.459.885-.688 1.228-.688.343 0 .638.23 1.228.688l7.288 5.669c.21.163.316.245.4.204.084-.04.084-.174.084-.441v-.409c0-.48 0-.72-.102-.928-.101-.208-.291-.355-.67-.65l-7-5.445c-.59-.459-.885-.688-1.228-.688-.343 0-.638.23-1.228.688l-7 5.445c-.379.295-.569.442-.67.65-.102.208-.102.448-.102.928v.409Z"
                      />
                      <path
                        fill="currentColor"
                        d="M11.5 15.5h1A1.5 1.5 0 0 1 14 17v3.5h-4V17a1.5 1.5 0 0 1 1.5-1.5Z"
                      />
                      <path
                        fill="currentColor"
                        d="M17.5 5h-1a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5Z"
                      />
                    </svg>
                    {/* </Link> */}
                    <Tooltip id="main-sidebar-tooltip" className="dark:bg-navy-600" />
                  </Link>

                  {/* Admission */}
                  <Link
                    href="/staff/signup/admission"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Admission"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-6"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                  </Link>

                  {/* Accounts */}
                  <Link
                    href="/staff/accounts/daily-accounts"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Accounts"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      className="size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="8" r="4" fill="currentColor" />
                      <path
                        d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Link>
                  {/* Reports*/}
                  <Link
                    href="/staff/report/payment-history"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Payment"
                  >
                    <svg
                      className="size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.85714 3H4.14286C3.51167 3 3 3.51167 3 4.14286V9.85714C3 10.4883 3.51167 11 4.14286 11H9.85714C10.4883 11 11 10.4883 11 9.85714V4.14286C11 3.51167 10.4883 3 9.85714 3Z"
                        fill="currentColor"
                      />
                      <path
                        d="M9.85714 12.8999H4.14286C3.51167 12.8999 3 13.4116 3 14.0428V19.757C3 20.3882 3.51167 20.8999 4.14286 20.8999H9.85714C10.4883 20.8999 11 20.3882 11 19.757V14.0428C11 13.4116 10.4883 12.8999 9.85714 12.8999Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                      <path
                        d="M19.757 3H14.0428C13.4116 3 12.8999 3.51167 12.8999 4.14286V9.85714C12.8999 10.4883 13.4116 11 14.0428 11H19.757C20.3882 11 20.8999 10.4883 20.8999 9.85714V4.14286C20.8999 3.51167 20.3882 3 19.757 3Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                      <path
                        d="M19.757 12.8999H14.0428C13.4116 12.8999 12.8999 13.4116 12.8999 14.0428V19.757C12.8999 20.3882 13.4116 20.8999 14.0428 20.8999H19.757C20.3882 20.8999 20.8999 20.3882 20.8999 19.757V14.0428C20.8999 13.4116 20.3882 12.8999 19.757 12.8999Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                    </svg>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    data-tooltip="Logout"
                    data-placement="right"
                    // className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
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
                  </button>
                </div>
              ) : data?.user_type === "branch" ? (
                  <div className="is-scrollbar-hidden flex grow flex-col space-y-4 overflow-y-auto pt-6 hidden lg:flex">
                    {/* Tooltip Component */}

                    <Link
                      href="/branch"
                      data-tooltip-id="main-sidebar-tooltip"
                      data-tooltip-content="Dashboard"
                      className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    >

                      <svg
                        className="size-7"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          fillOpacity=".3"
                          d="M5 14.059c0-1.01 0-1.514.222-1.945.221-.43.632-.724 1.453-1.31l4.163-2.974c.56-.4.842-.601 1.162-.601.32 0 .601.2 1.162.601l4.163 2.974c.821.586 1.232.88 1.453 1.31.222.43.222.935.222 1.945V19c0 .943 0 1.414-.293 1.707C18.414 21 17.943 21 17 21H7c-.943 0-1.414 0-1.707-.293C5 20.414 5 19.943 5 19v-4.94Z"
                        />
                        <path
                          fill="currentColor"
                          d="M3 12.387c0 .267 0 .4.084.441.084.041.19-.04.4-.204l7.288-5.669c.59-.459.885-.688 1.228-.688.343 0 .638.23 1.228.688l7.288 5.669c.21.163.316.245.4.204.084-.04.084-.174.084-.441v-.409c0-.48 0-.72-.102-.928-.101-.208-.291-.355-.67-.65l-7-5.445c-.59-.459-.885-.688-1.228-.688-.343 0-.638.23-1.228.688l-7 5.445c-.379.295-.569.442-.67.65-.102.208-.102.448-.102.928v.409Z"
                        />
                        <path
                          fill="currentColor"
                          d="M11.5 15.5h1A1.5 1.5 0 0 1 14 17v3.5h-4V17a1.5 1.5 0 0 1 1.5-1.5Z"
                        />
                        <path
                          fill="currentColor"
                          d="M17.5 5h-1a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5Z"
                        />
                      </svg>
                      {/* </Link> */}
                      <Tooltip id="main-sidebar-tooltip" className="dark:bg-navy-600" />
                    </Link>

                    {/* Customer */}
                    <Link
                      href="/branch/admission"
                      data-tooltip-id="main-sidebar-tooltip"
                      data-tooltip-content="Customer"
                      className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6 6 0 01-9 5.197"
                        />
                      </svg>
                    </Link>

                    {/* Expenses */}
                    <Link
                      href="/branch/accounts/daily-accounts"
                      data-tooltip-id="main-sidebar-tooltip"
                      data-tooltip-content="Expenses"
                      className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                        <path d="M8 16h.01M12 16v6" />
                        <path d="M15 19l-3 3-3-3" />
                      </svg>
                    </Link>


                    {/* Payments for Branch */}
                    <Link
                      href="/branch/report/payment-history"
                      data-tooltip-id="main-sidebar-tooltip"
                      data-tooltip-content="Reports"
                      className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    >
                      <svg
                        className="size-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </Link>

                    {/* Reports for Branch */}
                    {/* <Link
                      href="/staff/report/payment-history"
                      data-tooltip-id="main-sidebar-tooltip"
                      data-tooltip-content="Reports"
                      className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    >
                      <svg
                        className="size-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </Link> */}

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      data-tooltip-id="main-sidebar-tooltip"
                      data-tooltip-content="Logout"
                      // className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                      className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    >
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
                    </button>
                  </div>
                ) : null }



              {/*small screen*/}
              {data?.user_type === "admin" ? (
                <div className="is-scrollbar-hidden flex grow flex-col space-y-4 overflow-y-auto pt-6 lg:hidden">

                  <Tooltip id="main-sidebar-tooltip" className="dark:bg-navy-600" />
                  {/* Dashobards */}
                  <Link
                    href="/admin"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Dashboards"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      onClick={toggleDrawer}
                      className="size-7"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fillOpacity=".3"
                        d="M5 14.059c0-1.01 0-1.514.222-1.945.221-.43.632-.724 1.453-1.31l4.163-2.974c.56-.4.842-.601 1.162-.601.32 0 .601.2 1.162.601l4.163 2.974c.821.586 1.232.88 1.453 1.31.222.43.222.935.222 1.945V19c0 .943 0 1.414-.293 1.707C18.414 21 17.943 21 17 21H7c-.943 0-1.414 0-1.707-.293C5 20.414 5 19.943 5 19v-4.94Z"
                      />
                      <path
                        fill="currentColor"
                        d="M3 12.387c0 .267 0 .4.084.441.084.041.19-.04.4-.204l7.288-5.669c.59-.459.885-.688 1.228-.688.343 0 .638.23 1.228.688l7.288 5.669c.21.163.316.245.4.204.084-.04.084-.174.084-.441v-.409c0-.48 0-.72-.102-.928-.101-.208-.291-.355-.67-.65l-7-5.445c-.59-.459-.885-.688-1.228-.688-.343 0-.638.23-1.228.688l-7 5.445c-.379.295-.569.442-.67.65-.102.208-.102.448-.102.928v.409Z"
                      />
                      <path
                        fill="currentColor"
                        d="M11.5 15.5h1A1.5 1.5 0 0 1 14 17v3.5h-4V17a1.5 1.5 0 0 1 1.5-1.5Z"
                      />
                      <path
                        fill="currentColor"
                        d="M17.5 5h-1a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5Z"
                      />
                    </svg>
                    {/* </Link> */}
                  </Link>

                  {/* Admission */}
                  <Link
                    href="/admin/signup/admission"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Admission"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-6"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                  </Link>
                  {/* Master */}
                  <Link
                    href="/admin/settings/service-management"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Service Details"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      className="size-7"
                      onClick={toggleDrawer}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillOpacity="0.25"
                        d="M21.0001 16.05V18.75C21.0001 20.1 20.1001 21 18.7501 21H6.6001C6.9691 21 7.3471 20.946 7.6981 20.829C7.7971 20.793 7.89609 20.757 7.99509 20.712C8.31009 20.586 8.61611 20.406 8.88611 20.172C8.96711 20.109 9.05711 20.028 9.13811 19.947L9.17409 19.911L15.2941 13.8H18.7501C20.1001 13.8 21.0001 14.7 21.0001 16.05Z"
                        fill="currentColor"
                      ></path>
                      <path
                        fillOpacity="0.5"
                        d="M17.7324 11.361L15.2934 13.8L9.17334 19.9111C9.80333 19.2631 10.1993 18.372 10.1993 17.4V8.70601L12.6384 6.26701C13.5924 5.31301 14.8704 5.31301 15.8244 6.26701L17.7324 8.17501C18.6864 9.12901 18.6864 10.407 17.7324 11.361Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M7.95 3H5.25C3.9 3 3 3.9 3 5.25V17.4C3 17.643 3.02699 17.886 3.07199 18.12C3.09899 18.237 3.12599 18.354 3.16199 18.471C3.20699 18.606 3.252 18.741 3.306 18.867C3.315 18.876 3.31501 18.885 3.31501 18.885C3.32401 18.885 3.32401 18.885 3.31501 18.894C3.44101 19.146 3.585 19.389 3.756 19.614C3.855 19.731 3.95401 19.839 4.05301 19.947C4.15201 20.055 4.26 20.145 4.377 20.235L4.38601 20.244C4.61101 20.415 4.854 20.559 5.106 20.685C5.115 20.676 5.11501 20.676 5.11501 20.685C5.25001 20.748 5.385 20.793 5.529 20.838C5.646 20.874 5.76301 20.901 5.88001 20.928C6.11401 20.973 6.357 21 6.6 21C6.969 21 7.347 20.946 7.698 20.829C7.797 20.793 7.89599 20.757 7.99499 20.712C8.30999 20.586 8.61601 20.406 8.88601 20.172C8.96701 20.109 9.05701 20.028 9.13801 19.947L9.17399 19.911C9.80399 19.263 10.2 18.372 10.2 17.4V5.25C10.2 3.9 9.3 3 7.95 3ZM6.6 18.75C5.853 18.75 5.25 18.147 5.25 17.4C5.25 16.653 5.853 16.05 6.6 16.05C7.347 16.05 7.95 16.653 7.95 17.4C7.95 18.147 7.347 18.75 6.6 18.75Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </Link>
                  {/* Accounts */}
                  <Link
                    href="/admin/accounts/daily-accounts"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Accounts"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      className="size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="8" r="4" fill="currentColor" />
                      <path
                        d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Link>
                  {/* Reports*/}
                  <Link
                    href="/admin/report/payment-history"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Payment"
                  >
                    <svg
                      className="size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.85714 3H4.14286C3.51167 3 3 3.51167 3 4.14286V9.85714C3 10.4883 3.51167 11 4.14286 11H9.85714C10.4883 11 11 10.4883 11 9.85714V4.14286C11 3.51167 10.4883 3 9.85714 3Z"
                        fill="currentColor"
                      />
                      <path
                        d="M9.85714 12.8999H4.14286C3.51167 12.8999 3 13.4116 3 14.0428V19.757C3 20.3882 3.51167 20.8999 4.14286 20.8999H9.85714C10.4883 20.8999 11 20.3882 11 19.757V14.0428C11 13.4116 10.4883 12.8999 9.85714 12.8999Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                      <path
                        d="M19.757 3H14.0428C13.4116 3 12.8999 3.51167 12.8999 4.14286V9.85714C12.8999 10.4883 13.4116 11 14.0428 11H19.757C20.3882 11 20.8999 10.4883 20.8999 9.85714V4.14286C20.8999 3.51167 20.3882 3 19.757 3Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                      <path
                        d="M19.757 12.8999H14.0428C13.4116 12.8999 12.8999 13.4116 12.8999 14.0428V19.757C12.8999 20.3882 13.4116 20.8999 14.0428 20.8999H19.757C20.3882 20.8999 20.8999 20.3882 20.8999 19.757V14.0428C20.8999 13.4116 20.3882 12.8999 19.757 12.8999Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                    </svg>
                  </Link>

                  {/* licence report */}

                  <Link
                    href="/admin/report/licence-renewal"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Renewal Report"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>

                  </Link>

                  <button
                    onClick={handleLogout}
                    data-tooltip="Logout"
                    data-placement="right"
                    // className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
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
                  </button>
                </div>

              ) : data?.user_type === "staff" ? (
                <div className="is-scrollbar-hidden flex grow flex-col space-y-4 overflow-y-auto pt-6 lg:hidden">
                  {/* Tooltip Component */}
                  <Tooltip id="main-sidebar-tooltip" className="dark:bg-navy-600" />
                  {/* Dashobards */}
                  <Link
                    href="/staff"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Dashobards"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      onClick={toggleDrawer}
                      className="size-7"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fillOpacity=".3"
                        d="M5 14.059c0-1.01 0-1.514.222-1.945.221-.43.632-.724 1.453-1.31l4.163-2.974c.56-.4.842-.601 1.162-.601.32 0 .601.2 1.162.601l4.163 2.974c.821.586 1.232.88 1.453 1.31.222.43.222.935.222 1.945V19c0 .943 0 1.414-.293 1.707C18.414 21 17.943 21 17 21H7c-.943 0-1.414 0-1.707-.293C5 20.414 5 19.943 5 19v-4.94Z"
                      />
                      <path
                        fill="currentColor"
                        d="M3 12.387c0 .267 0 .4.084.441.084.041.19-.04.4-.204l7.288-5.669c.59-.459.885-.688 1.228-.688.343 0 .638.23 1.228.688l7.288 5.669c.21.163.316.245.4.204.084-.04.084-.174.084-.441v-.409c0-.48 0-.72-.102-.928-.101-.208-.291-.355-.67-.65l-7-5.445c-.59-.459-.885-.688-1.228-.688-.343 0-.638.23-1.228.688l-7 5.445c-.379.295-.569.442-.67.65-.102.208-.102.448-.102.928v.409Z"
                      />
                      <path
                        fill="currentColor"
                        d="M11.5 15.5h1A1.5 1.5 0 0 1 14 17v3.5h-4V17a1.5 1.5 0 0 1 1.5-1.5Z"
                      />
                      <path
                        fill="currentColor"
                        d="M17.5 5h-1a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5Z"
                      />
                    </svg>
                    {/* </Link> */}
                  </Link>

                  {/* Admission */}
                  <Link
                    href="/staff/signup/admission"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Admission"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-6"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                  </Link>

                  {/* Accounts */}
                  <Link
                    href="/staff/accounts/daily-accounts"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Accounts"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      className="size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="8" r="4" fill="currentColor" />
                      <path
                        d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Link>
                  {/* Reports*/}
                  <Link
                    href="/staff/report/payment-history"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Payment"
                  >
                    <svg
                      className="size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.85714 3H4.14286C3.51167 3 3 3.51167 3 4.14286V9.85714C3 10.4883 3.51167 11 4.14286 11H9.85714C10.4883 11 11 10.4883 11 9.85714V4.14286C11 3.51167 10.4883 3 9.85714 3Z"
                        fill="currentColor"
                      />
                      <path
                        d="M9.85714 12.8999H4.14286C3.51167 12.8999 3 13.4116 3 14.0428V19.757C3 20.3882 3.51167 20.8999 4.14286 20.8999H9.85714C10.4883 20.8999 11 20.3882 11 19.757V14.0428C11 13.4116 10.4883 12.8999 9.85714 12.8999Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                      <path
                        d="M19.757 3H14.0428C13.4116 3 12.8999 3.51167 12.8999 4.14286V9.85714C12.8999 10.4883 13.4116 11 14.0428 11H19.757C20.3882 11 20.8999 10.4883 20.8999 9.85714V4.14286C20.8999 3.51167 20.3882 3 19.757 3Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                      <path
                        d="M19.757 12.8999H14.0428C13.4116 12.8999 12.8999 13.4116 12.8999 14.0428V19.757C12.8999 20.3882 13.4116 20.8999 14.0428 20.8999H19.757C20.3882 20.8999 20.8999 20.3882 20.8999 19.757V14.0428C20.8999 13.4116 20.3882 12.8999 19.757 12.8999Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                    </svg>
                  </Link>

                  <button
                    onClick={handleLogout}
                    data-tooltip="Logout"
                    data-placement="right"
                    // className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
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
                  </button>
                </div>

              ) : data?.user_type === "branch" ? (
                <div className="is-scrollbar-hidden flex grow flex-col space-y-4 overflow-y-auto pt-6 lg:hidden">
                  {/* Tooltip Component */}
                  <Tooltip id="main-sidebar-tooltip" className="dark:bg-navy-600" />
                  {/* Dashobards */}

                  <Link
                    href="/branch"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Dashobard"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                      onClick={toggleDrawer}
                      className="size-7"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fillOpacity=".3"
                        d="M5 14.059c0-1.01 0-1.514.222-1.945.221-.43.632-.724 1.453-1.31l4.163-2.974c.56-.4.842-.601 1.162-.601.32 0 .601.2 1.162.601l4.163 2.974c.821.586 1.232.88 1.453 1.31.222.43.222.935.222 1.945V19c0 .943 0 1.414-.293 1.707C18.414 21 17.943 21 17 21H7c-.943 0-1.414 0-1.707-.293C5 20.414 5 19.943 5 19v-4.94Z"
                      />
                      <path
                        fill="currentColor"
                        d="M3 12.387c0 .267 0 .4.084.441.084.041.19-.04.4-.204l7.288-5.669c.59-.459.885-.688 1.228-.688.343 0 .638.23 1.228.688l7.288 5.669c.21.163.316.245.4.204.084-.04.084-.174.084-.441v-.409c0-.48 0-.72-.102-.928-.101-.208-.291-.355-.67-.65l-7-5.445c-.59-.459-.885-.688-1.228-.688-.343 0-.638.23-1.228.688l-7 5.445c-.379.295-.569.442-.67.65-.102.208-.102.448-.102.928v.409Z"
                      />
                      <path
                        fill="currentColor"
                        d="M11.5 15.5h1A1.5 1.5 0 0 1 14 17v3.5h-4V17a1.5 1.5 0 0 1 1.5-1.5Z"
                      />
                      <path
                        fill="currentColor"
                        d="M17.5 5h-1a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5Z"
                      />
                    </svg>
                    {/* </Link> */}
                  </Link>

                  {/* Customer */}
                  <Link
                    href="/branch/admission"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Customers"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6 6 0 01-9 5.197"
                        />
                      </svg>
                  </Link>

                  {/* Expenses */}
                  <Link
                    href="/branch/accounts/daily-accounts"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Expenses"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                        <path d="M8 16h.01M12 16v6" />
                        <path d="M15 19l-3 3-3-3" />
                      </svg>
                  </Link>

                  {/* payment for branch*/}
                  <Link
                    href="/branch/report/payment-history"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Reports"
                  >
                    <svg
                        className="size-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                  </Link>

                  {/* report for branch */}

                  {/* <Link
                    href="/staff/report/payment-history"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                    data-tooltip-id="main-sidebar-tooltip"
                    data-tooltip-content="Reports"
                  >
                    <svg
                        className="size-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                  </Link> */}

                  {/*  logout button */}
                  <button
                    onClick={handleLogout}
                    data-tooltip="Logout"
                    data-placement="right"
                    // className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                    className="tooltip-main-sidebar flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-navy-600 dark:text-accent-light dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                  >
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
                  </button>
                </div>
                
              ) : null }


            </div>
          </div>






          {/* second Sidebar */}
          {isDrawerVisible && (
            <div className="sidebar-panel">
              <div className="flex h-full grow flex-col bg-white pl-[var(--main-sidebar-width)] dark:bg-navy-750">
                {/* Sidebar Panel Header */}
                <div className="flex h-18 w-full items-center justify-between pl-4 pr-1">

                  {data?.user_type === "admin" ? (
                    <p className="text-base tracking-wider text-slate-800 dark:text-navy-100">
                      Admin{" "}
                    </p>
                  ) : data?.user_type === "staff" ? (
                    <p className="text-base tracking-wider text-slate-800 dark:text-navy-100">
                      Staff{" "}
                    </p>
                  ) : data?.user_type === "branch" ? (
                    <p className="text-base tracking-wider text-slate-800 dark:text-navy-100">
                      Branch{" "}
                    </p>
                  ) : null }


                  <button
                    onClick={toggleDrawer}
                    className="btn size-7 rounded-full p-0 text-primary hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:text-accent-light/80 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 xl:hidden"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                </div>


                {/* Sidebar Panel Body */}



                {/* largeScren */}

                {data?.user_type === "admin" ? (
                  <div
                    className="nav-wrapper h-[calc(100%-4.5rem)] overflow-x-hidden pb-6 hidden lg:flex"
                    data-simplebar
                  >
                    <ul className="flex flex-1 flex-col px-4 font-inter">
                      <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50"></li>
                      <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                        <ul className="ac-panel">
                          {/* admission */}
                          <li>
                            <Link
                              href="/admin/signup/admission"
                              className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                              data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                              data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                              <div className="flex items-center space-x-2">
                                {/* <div className="size-1.5 rounded-full border border-current opacity-40" /> */}
                                <span className="font-bold">Admission</span>
                              </div>
                            </Link>
                          </li>

                          {/* master */}

                          <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                            <button
                              onClick={handleDropdownToggle} // Toggle the dropdown on button click
                              className="ac-trigger flex w-full items-center justify-between py-2 text-xs+ tracking-wide text-slate-600 outline-none transition-[color,padding-left] duration-300 ease-in-out hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                            >
                              <span className="font-bold ml-2">Master</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`size-4 text-slate-400 transition-transform ease-in-out ${isDropdownOpen ? "rotate-90" : ""
                                  }`}
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
                            </button>

                            {/* Toggle visibility of dropdown list */}
                            <ul
                              className={`ac-panel ${isDropdownOpen ? "block" : "hidden"
                                }`}
                            >
                              {/* service */}

                              <li>
                                <Link
                                  href="/admin/settings/service-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Service</span>
                                  </div>
                                </Link>
                              </li>
                              {/* vehicle */}
                              <li>
                                <Link
                                  href="/admin/settings/vehicle-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Vehicle</span>
                                  </div>
                                </Link>
                              </li>
                              {/* Branch */}
                              <li>
                                <Link
                                  href="/admin/settings/branch-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Branch</span>
                                  </div>
                                </Link>
                              </li>
                              {/* License Cost */}
                              <li>
                                <Link
                                  href="/admin/accounts/license-cost"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>License Cost</span>
                                  </div>
                                </Link>
                              </li>
                              {/* fresh License Cost */}
                              <li>
                                <Link
                                  href="/admin/accounts/fresh-licence-cost"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Fresh Licence cost</span>
                                  </div>
                                </Link>
                              </li>
                              {/* staff */}
                              <li>
                                <Link
                                  href="/admin/settings/staff-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Staff</span>
                                  </div>
                                </Link>
                              </li>
                              {/* driver */}
                              <li>
                                <Link
                                  href="/admin/settings/driver-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Driver</span>
                                  </div>
                                </Link>
                              </li>
                            </ul>
                          </li>
                          {/* accounts */}
                          <li>
                            <Link
                              href="/admin/accounts/daily-accounts"
                              className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                              data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                              data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                              <div className="flex items-center space-x-2">
                                {/* <div className="size-1.5 rounded-full border border-current opacity-40" /> */}
                                <span className="font-bold">Accounts</span>
                              </div>
                            </Link>
                          </li>

                          {/* report */}
                          <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                            <button
                              onClick={handleDropdownToggles} // Toggle the dropdown on button click
                              className="ac-trigger flex w-full items-center justify-between py-2 text-xs+ tracking-wide text-slate-600 outline-none transition-[color,padding-left] duration-300 ease-in-out hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                            >
                              <span className="font-bold ml-2">Reports</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`size-4 text-slate-400 transition-transform ease-in-out ${isDropdownOpens ? "rotate-90" : ""
                                  }`}
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
                            </button>

                            {/* Toggle visibility of dropdown list */}
                            <ul
                              className={`ac-panel ${isDropdownOpens ? "block" : "hidden"}`} >
                              <li>
                                <Link
                                  href="/admin/report/payment-history"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4">
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Payment History</span>
                                  </div>
                                </Link>
                              </li>

                              {/* licence renewal report */}

                              <li>
                                <Link
                                  href="/admin/report/licence-renewal"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4">
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Renewal History</span>
                                  </div>
                                </Link>
                              </li>

                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                ) : data?.user_type === "staff" ? (
                  <div
                    className="nav-wrapper h-[calc(100%-4.5rem)] overflow-x-hidden pb-6 hidden lg:flex"
                    data-simplebar
                  >
                    <ul className="flex flex-1 flex-col px-4 font-inter">
                      <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50"></li>
                      <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                        <ul className="ac-panel">
                          {/* admission */}
                          <li>
                            <Link
                              href="/staff/signup/admission"
                              className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                              data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                              data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                              <div className="flex items-center space-x-2">

                                <span className="font-bold" >Admission</span>
                              </div>
                            </Link>
                          </li>

                          {/* accounts */}
                          <li>
                            <Link
                              href="/staff/accounts/daily-accounts"
                              className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                              data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                              data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                              <div className="flex items-center space-x-2">

                                <span className="font-bold">Accounts</span>
                              </div>
                            </Link>
                          </li>

                          {/* report */}
                          <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                            <button
                              onClick={handleDropdownToggles} // Toggle the dropdown on button click
                              className="ac-trigger flex w-full items-center justify-between py-2 text-xs+ tracking-wide text-slate-600 outline-none transition-[color,padding-left] duration-300 ease-in-out hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                            >
                              <span className="font-bold ml-2">Reports</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`size-4 text-slate-400 transition-transform ease-in-out ${isDropdownOpens ? "rotate-90" : ""
                                  }`}
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
                            </button>

                            {/* Toggle visibility of dropdown list */}
                            <ul
                              className={`ac-panel ${isDropdownOpens ? "block" : "hidden"
                                }`}
                            >
                              <li>
                                <Link
                                  href="/staff/report/payment-history"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Payment History</span>
                                  </div>
                                </Link>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                ) : data?.user_type === "branch" ? (

                  <div
                    className="nav-wrapper h-[calc(100%-4.5rem)] overflow-x-hidden pb-6 hidden lg:flex"
                    data-simplebar>
                    <ul className="flex flex-1 flex-col px-4 font-inter">
                      <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50"></li>
                      <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                        <ul className="ac-panel">

                          {/* customer management */}
                          <li>
                            <Link
                              href="/branch/admission"
                              className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                              data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                              data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                              <div className="flex items-center space-x-2">

                                <span className="font-bold" >Customer Management</span>
                              </div>
                            </Link>
                          </li>

                          {/* master */}

                          <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                            <button
                              onClick={handleDropdownToggle} // Toggle the dropdown on button click
                              className="ac-trigger flex w-full items-center justify-between py-2 text-xs+ tracking-wide text-slate-600 outline-none transition-[color,padding-left] duration-300 ease-in-out hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                            >
                              <span className="font-bold ml-2">Master</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`size-4 text-slate-400 transition-transform ease-in-out ${isDropdownOpen ? "rotate-90" : ""
                                  }`}
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
                            </button>

                            {/* Toggle visibility of dropdown list */}
                            <ul
                              className={`ac-panel ${isDropdownOpen ? "block" : "hidden"
                                }`}
                            >
                              {/* Staff add */}

                              <li>
                                <Link
                                  href="/branch/settings/staff-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Staff</span>
                                  </div>
                                </Link>
                              </li>

                              {/* Service */}
                              <li>
                                <Link
                                  href="/branch/settings/service-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Service</span>
                                  </div>
                                </Link>
                              </li>
                                                                                                                     
                            </ul>
                          </li>

                          {/* Expenses */}
                          <li>
                            <Link
                              href="/branch/accounts/daily-accounts"
                              className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                              data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                              data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                              <div className="flex items-center space-x-2">

                                <span className="font-bold">Expenses</span>
                              </div>
                            </Link>
                          </li>

                          {/* report */}
                          <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                            <button
                              onClick={handleDropdownToggles} // Toggle the dropdown on button click
                              className="ac-trigger flex w-full items-center justify-between py-2 text-xs+ tracking-wide text-slate-600 outline-none transition-[color,padding-left] duration-300 ease-in-out hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50" >
                              <span className="font-bold ml-2">Reports</span> 
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`size-4 text-slate-400 transition-transform ease-in-out ${isDropdownOpens ? "rotate-90" : ""
                                  }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor" >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>

                            {/* Toggle visibility of dropdown list */}
                            <ul  className={`ac-panel ${isDropdownOpens ? "block" : "hidden"  }`} >
                              {/* payment history */}
                              <li>
                                <Link
                                  href="/branch/report/payment-history"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4" >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Payment History</span>
                                  </div>
                                </Link>
                              </li>

                              {/* renewal reports */}
                              <li>
                                <Link
                                  href="/branch/report/renewal-report"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4" >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Renewal Report</span>
                                  </div>
                                </Link>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                ) : null }


                {/* small screen */}

                {data?.user_type === "admin" ? (
                  <div
                    className="nav-wrapper h-[calc(100%-4.5rem)] overflow-x-hidden pb-6 lg:hidden"
                    data-simplebar
                  >
                    <ul className="flex flex-1 flex-col px-4 font-inter">
                      <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                        <ul className="ac-panel">
                          {/* admission */}
                          <li>
                            <Link
                              href="/admin/signup/admission"
                              className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                              data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                              data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                              <div className="flex items-center space-x-2">
                                {/* <div className="size-1.5 rounded-full border border-current opacity-40" /> */}
                                <span
                                  className="font-bold"
                                  onClick={toggleDrawer}
                                >
                                  Admission
                                </span>
                              </div>
                            </Link>
                          </li>

                          {/* master */}

                          <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                            <button
                              onClick={handleDropdownToggle} // Toggle the dropdown on button click
                              className="ac-trigger flex w-full items-center justify-between py-2 text-xs+ tracking-wide text-slate-600 outline-none transition-[color,padding-left] duration-300 ease-in-out hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                            >
                              <span className="font-bold ml-2">Master</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`size-4 text-slate-400 transition-transform ease-in-out ${isDropdownOpen ? "rotate-90" : ""
                                  }`}
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
                            </button>

                            {/* Toggle visibility of dropdown list */}
                            <ul
                              className={`ac-panel ${isDropdownOpen ? "block" : "hidden"
                                }`}
                            >
                              {/* Service*/}
                              <li>
                                <Link
                                  href="/admin/settings/service-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>Service</span>
                                  </div>
                                </Link>
                              </li>
                              {/* Vehicle*/}
                              <li>
                                <Link
                                  href="/admin/settings/vehicle-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>Vehicle</span>
                                  </div>
                                </Link>
                              </li>
                              {/* Branch*/}
                              <li>
                                <Link
                                  href="/admin/settings/branch-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>Branch</span>
                                  </div>
                                </Link>
                              </li>
                              {/* License Cost*/}
                              <li>
                                <Link
                                  href="/admin/accounts/license-cost"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>
                                      License Cost
                                    </span>
                                  </div>
                                </Link>
                              </li>
                              {/* Fresh Licence cost */}
                              <li>
                                <Link
                                  href="/admin/accounts/fresh-licence-cost"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>
                                      Fresh Licence cost
                                    </span>
                                  </div>
                                </Link>
                              </li>
                              {/* Staff*/}
                              <li>
                                <Link
                                  href="/admin/settings/staff-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>Staff</span>
                                  </div>
                                </Link>
                              </li>
                              {/* Driver */}
                              <li>
                                <Link
                                  href="/admin/settings/driver-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>Driver</span>
                                  </div>
                                </Link>
                              </li>                              
                            </ul>
                          </li>
                          {/* accounts */}
                          <li>
                            <Link
                              href="/admin/accounts/daily-accounts"
                              className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                              data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                              data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                              <div className="flex items-center space-x-2">
                                {/* <div className="size-1.5 rounded-full border border-current opacity-40" /> */}
                                {/* <span  onClick={toggleDrawer}>Accounts</span> */}
                                <span
                                  className="font-bold"
                                  onClick={toggleDrawer}
                                >
                                  Accounts
                                </span>
                              </div>
                            </Link>
                          </li>

                          {/* report */}
                          <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                            <button
                              onClick={handleDropdownToggles} // Toggle the dropdown on button click
                              className="ac-trigger flex w-full items-center justify-between py-2 text-xs+ tracking-wide text-slate-600 outline-none transition-[color,padding-left] duration-300 ease-in-out hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                            >
                              <span className="font-bold ml-2">Reports</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`size-4 text-slate-400 transition-transform ease-in-out ${isDropdownOpens ? "rotate-90" : ""
                                  }`}
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
                            </button>

                            {/* Toggle visibility of dropdown list */}
                            <ul
                              className={`ac-panel ${isDropdownOpens ? "block" : "hidden"}`}>
                              <li>
                                <Link
                                  href="/admin/report/payment-history"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4" >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>
                                      Payment History
                                    </span>
                                  </div>
                                </Link>
                              </li>

                              {/* licence renewal report */}

                              <li>
                                <Link
                                  href="/admin/report/licence-renewal"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4">
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span>Renewal History</span>
                                  </div>
                                </Link>
                              </li>

                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                ) : data?.user_type === "staff" ? (
                  <div
                    className="nav-wrapper h-[calc(100%-4.5rem)] overflow-x-hidden pb-6 lg:hidden"
                    data-simplebar
                  >
                    <ul className="flex flex-1 flex-col px-4 font-inter">
                      <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                        <ul className="ac-panel">
                          {/* admission */}
                          <li>
                            <Link
                              href="/staff/signup/admission"
                              className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                              data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                              data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="size-1.5 rounded-full border border-current opacity-40" />
                                <span onClick={toggleDrawer}>Admission</span>
                              </div>
                            </Link>
                          </li>
                          {/* accounts */}
                          <li>
                            <Link
                              href="/staff/accounts/daily-accounts"
                              className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                              data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                              data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="size-1.5 rounded-full border border-current opacity-40" />
                                <span onClick={toggleDrawer}>Accounts</span>
                              </div>
                            </Link>
                          </li>

                          {/* report */}
                          <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                            <button
                              onClick={handleDropdownToggles} // Toggle the dropdown on button click
                              className="ac-trigger flex w-full items-center justify-between py-2 text-xs+ tracking-wide text-slate-600 outline-none transition-[color,padding-left] duration-300 ease-in-out hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                            >
                              <span>Reports</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`size-4 text-slate-400 transition-transform ease-in-out ${isDropdownOpens ? "rotate-90" : ""
                                  }`}
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
                            </button>

                            {/* Toggle visibility of dropdown list */}
                            <ul
                              className={`ac-panel ${isDropdownOpens ? "block" : "hidden"
                                }`}
                            >
                              <li>
                                <Link
                                  href="/staff/report/payment-history"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>Payment History</span>
                                  </div>
                                </Link>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                ) : data?.user_type === "branch" ? (
                  <div
                    className="nav-wrapper h-[calc(100%-4.5rem)] overflow-x-hidden pb-6 lg:hidden"
                    data-simplebar
                  >
                    <ul className="flex flex-1 flex-col px-4 font-inter">
                      <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                        <ul className="ac-panel">

                          {/* customer management */}
                          <li>
                            <Link
                              href="/branch/admission"
                              className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                              data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                              data-active-class="font-medium text-primary dark:text-accent-light"
                            >
                              <div className="flex items-center space-x-2">
                                {/* <div className="size-1.5 rounded-full border border-current opacity-40" /> */}
                                <span
                                  className="font-bold"
                                  onClick={toggleDrawer} >
                                  Customer Management
                                </span>
                              </div>
                            </Link>
                          </li>

                          {/* master */}

                          <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                            <button 
                              onClick={handleDropdownToggle} // Toggle the dropdown on button click
                              className="ac-trigger flex w-full items-center justify-between py-2 text-xs+ tracking-wide text-slate-600 outline-none transition-[color,padding-left] duration-300 ease-in-out hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50" >
                              <span className="font-bold ml-2">Master</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`size-4 text-slate-400 transition-transform ease-in-out ${isDropdownOpen ? "rotate-90" : ""
                                  }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"  >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>

                            {/* Toggle visibility of dropdown list */}
                            <ul  className={`ac-panel ${isDropdownOpen ? "block" : "hidden"  }`} >

                              {/* Staff*/}
                              <li>
                                <Link
                                  href="/branch/settings/staff-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>Staff</span>
                                  </div>
                                </Link>
                              </li>

                              {/* service*/}
                              <li>
                                <Link
                                  href="/branch/settings/service-management"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>Service</span>
                                  </div>
                                </Link>
                              </li>
                                                                                                                                           
                            </ul>
                          </li>

                          {/* expenses*/}
                          <li>
                            <Link
                              href="/branch/accounts/daily-accounts"
                              className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4"
                              data-default-class="text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50"
                              data-active-class="font-medium text-primary dark:text-accent-light">
                              <div className="flex items-center space-x-2">                                
                                <span
                                  className="font-bold"
                                  onClick={toggleDrawer}>
                                  Expenses
                                </span>
                              </div>
                            </Link>
                          </li>

                          {/* reports */}
                          <li className="ac nav-parent [&.is-active_svg]:rotate-90 [&.is-active_.ac-trigger]:font-semibold [&.is-active_.ac-trigger]:text-slate-800 dark:[&.is-active_.ac-trigger]:text-navy-50">
                            <button
                              onClick={handleDropdownToggles} // Toggle the dropdown on button click
                              className="ac-trigger flex w-full items-center justify-between py-2 text-xs+ tracking-wide text-slate-600 outline-none transition-[color,padding-left] duration-300 ease-in-out hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50" >
                              <span className="font-bold">Reports</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`size-4 text-slate-400 transition-transform ease-in-out ${isDropdownOpens ? "rotate-90" : ""
                                  }`}
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
                            </button>

                            {/* Toggle visibility of dropdown list */}
                            <ul className={`ac-panel ${isDropdownOpens ? "block" : "hidden" }`} >

                              {/* payment history */}
                              <li>
                                <Link
                                  href="/branch/report/payment-history"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4" >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>Payment History</span>
                                  </div>
                                </Link>
                              </li>

                              {/* renewal report */}

                              <li>
                                <Link
                                  href="/branch/report/renewal-report"
                                  className="nav-link flex items-center justify-between p-2 text-xs+ tracking-wide outline-none transition-[color,padding-left] duration-300 ease-in-out hover:pl-4" >
                                  <div className="flex items-center space-x-2">
                                    <div className="size-1.5 rounded-full border border-current opacity-40" />
                                    <span onClick={toggleDrawer}>Renewal Report</span>
                                  </div>
                                </Link>
                              </li>

                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                ) : null }
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Sidebar;
