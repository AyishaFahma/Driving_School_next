"use client";
import React, { createContext, useContext, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type DrawerContextType = {
  isDrawerVisible: boolean;
  toggleDrawer: () => void;


};

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};

export const DrawerProvider: React.FC<{ children:React.ReactNode}> = ({ children }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);


  const toggleDrawer = () => {
    // console.log('Drawer toggled',!isDrawerVisible);
    setIsDrawerVisible((prev) => !prev); 
  };
 

  return (
    <DrawerContext.Provider value={{ isDrawerVisible, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};








