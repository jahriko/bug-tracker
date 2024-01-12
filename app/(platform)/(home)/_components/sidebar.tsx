"use client"

import { useState, useContext, createContext } from "react"

interface SidebarContextProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const value = { sidebarOpen, setSidebarOpen }
  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}
