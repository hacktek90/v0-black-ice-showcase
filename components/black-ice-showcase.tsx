"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue } from "firebase/database"
import {
  Search,
  Plus,
  Star,
  Home,
  ChevronRight,
  Menu,
  X,
  Minimize2,
  Maximize2,
  XCircle,
  Power,
  RefreshCw,
  Monitor,
  Smartphone,
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

const initFirebase = () => {
  let app
  let db
  const firebaseConfig = {
    apiKey: "AIzaSyAp9kCBsDLnQEmR7wWHXwt3FB2T1zDtiqU",
    authDomain: "h-90-8a7c5.firebaseapp.com",
    databaseURL: "https://h-90-8a7c5-default-rtdb.firebaseio.com",
    projectId: "h-90-8a7c5",
    storageBucket: "h-90-8a7c5.firebasestorage.app",
    messagingSenderId: "367196609301",
    appId: "1:367196609301:web:156e24c1b4532c26af671c",
  }
  if (!app) {
    app = initializeApp(firebaseConfig)
    db = getDatabase(app)
  }
  return db
}

const BlackIceShowcase = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [activeUrl, setActiveUrl] = useState("https://black-ice-3dbk.onrender.com")
  const [activeTitle, setActiveTitle] = useState("Home")
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [isSleeping, setIsSleeping] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768
      setIsMobile(isMobileDevice)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const savedFavs = JSON.parse(localStorage.getItem("bi_favorites") || "[]")
    setFavorites(savedFavs)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (window.innerWidth <= 768) {
      setSidebarOpen(false)
    }

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleFavorite = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation()
    let newFavs
    if (favorites.includes(projectId)) {
      newFavs = favorites.filter((id) => id !== projectId)
    } else {
      newFavs = [...favorites, projectId]
    }
    setFavorites(newFavs)
    localStorage.setItem("bi_favorites", JSON.stringify(newFavs))
  }

  useEffect(() => {
    const database = initFirebase()
    const projectsRef = ref(database, "sites")
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]: [string, any]) => ({
            id,
            ...val,
            timestamp: val.timestamp || 0,
          }))
          .sort((a, b) => b.timestamp - a.timestamp)
        setProjects(list)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()))
  }, [projects, searchQuery])

  const getScreenshotUrl = (url: string) =>
    `https://api.microlink.io/?url=${encodeURIComponent(url || "")}&screenshot=true&meta=false&embed=screenshot.url`

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname
    } catch (e) {
      return "Unknown"
    }
  }

  const handleMinimize = () => setIsMinimized(!isMinimized)
  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
    setSidebarOpen(isMaximized)
  }
  const handleClose = () => {
    setActiveUrl("")
    setActiveTitle("Desktop")
    setIsMinimized(false)
  }

  const handleTaskbarSearch = () => {
    setSidebarOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 100)
  }

  const handleProjectSelect = (url: string, title: string) => {
    setActiveUrl(url)
    setActiveTitle(title)
    setIsMinimized(false)
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  if (isMobile) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a24 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          textAlign: "center",
          color: "#f1f5f9",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            border: "2px solid rgba(59, 130, 246, 0.3)",
          }}
        >
          <Smartphone size={40} color="#3b82f6" />
        </div>

        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "12px",
            color: "#f1f5f9",
          }}
        >
          Not Supported on Mobile
        </h1>

        <p
          style={{
            fontSize: "0.95rem",
            color: "#94a3b8",
            marginBottom: "32px",
            maxWidth: "320px",
            lineHeight: "1.6",
          }}
        >
          BlackICE OS is optimized for desktop. Please visit our mobile-friendly version for the best experience.
        </p>

        <a
          href="https://black-ice-3dbk.onrender.com"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 28px",
            background: "#3b82f6",
            color: "white",
            textDecoration: "none",
            borderRadius: "12px",
            fontSize: "0.95rem",
            fontWeight: "500",
            transition: "all 0.2s",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb"
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6"
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)"
          }}
        >
          Go to Mobile Version
          <ChevronRight size={18} />
        </a>
      </div>
    )
  }

  if (isSleeping) {
    return (
      <div
        className="app-container"
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: "radial-gradient(circle at center, #1e293b 0%, #020617 100%)",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => setIsSleeping(false)}
      >
        {/* Animated Background Elements */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60vw",
            height: "60vw",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "pulse 8s infinite ease-in-out",
            pointerEvents: "none",
          }}
        />

        <div className="flex flex-col items-center z-10 animate-in fade-in duration-1000">
          <div
            style={{
              fontSize: "8rem",
              fontWeight: "200",
              fontVariantNumeric: "tabular-nums",
              color: "var(--text-primary)",
              lineHeight: 1,
              textShadow: "0 0 40px rgba(59, 130, 246, 0.5)",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            {format(currentTime, "HH:mm")}
          </div>
          <div
            style={{
              fontSize: "2rem",
              color: "var(--text-secondary)",
              marginTop: "1rem",
              fontWeight: "300",
              letterSpacing: "2px",
            }}
          >
            {format(currentTime, "EEEE, MMMM do")}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            zIndex: 20,
          }}
        >
          <div className="flex items-center gap-2 text-blue-400/60 text-sm uppercase tracking-widest">
            <Power size={14} />
            <span>System Standby</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleFullscreen()
            }}
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 backdrop-blur-md"
          >
            <Maximize2 size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-slate-300">Enter Fullscreen</span>
          </button>

          <div className="text-slate-600 text-xs mt-4 animate-pulse">Click anywhere to wake</div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <style>{`
        :root {
          --os-bg: #0a0a0f;
          --os-surface: #13131a;
          --os-surface-elevated: #1a1a24;
          --os-border: #252530;
          --os-accent: #3b82f6;
          --os-accent-hover: #2563eb;
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --text-tertiary: #64748b;
          --danger: #ef4444;
          --success: #10b981;
          --warning: #f59e0b;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--os-bg);
          color: var(--text-primary);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          overflow: hidden;
        }

        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          position: relative;
          background: var(--os-bg);
        }

        /* --- OS Taskbar/Dock --- */
        .os-taskbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: rgba(19, 19, 26, 0.8);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--os-border);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 20px;
          z-index: 1000;
        }

        .taskbar-item {
          width: 48px;
          height: 48px;
          background: var(--os-surface-elevated);
          border: 1px solid var(--os-border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .taskbar-item:hover {
          background: var(--os-accent);
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        .taskbar-item.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: var(--os-accent);
          border-radius: 50%;
        }

        /* --- Sidebar --- */
        .sidebar {
          width: 280px;
          background: var(--os-surface);
          border-right: 1px solid var(--os-border);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
          height: calc(100vh - 60px);
          position: relative;
          flex-shrink: 0;
        }

        .sidebar-header {
          padding: 16px;
          border-bottom: 1px solid var(--os-border);
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: var(--os-surface-elevated);
        }
        
        .sidebar-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .sidebar-title {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-primary);
          letter-spacing: 0.5px;
        }

        .close-sidebar-btn {
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          display: none;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .close-sidebar-btn:hover {
          background: var(--os-border);
          color: var(--text-primary);
        }

        .search-wrapper { position: relative; }

        .search-input {
          width: 100%;
          background: var(--os-bg);
          border: 1px solid var(--os-border);
          color: var(--text-primary);
          padding: 8px 8px 8px 32px;
          border-radius: 8px;
          font-size: 0.813rem;
          outline: none;
          transition: all 0.2s;
        }
        .search-input:focus { 
          border-color: var(--os-accent); 
          background: var(--os-surface);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .search-icon { 
          position: absolute; 
          left: 10px; 
          top: 10px; 
          color: var(--text-tertiary); 
          width: 14px; 
        }

        .nav-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }

        .nav-list::-webkit-scrollbar {
          width: 6px;
        }

        .nav-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .nav-list::-webkit-scrollbar-thumb {
          background: var(--os-border);
          border-radius: 3px;
        }

        .section-label {
          font-size: 0.688rem;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text-tertiary);
          margin: 16px 0 8px;
          font-weight: 600;
          padding: 0 8px;
        }

        .project-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 6px;
          position: relative;
          width: 100%;
          text-align: left;
        }

        .project-card:hover {
          background: var(--os-surface-elevated);
          border-color: var(--os-border);
        }

        .project-card.active {
          background: var(--os-accent);
          border-color: var(--os-accent);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .project-card.active .card-title {
          color: white;
        }

        .project-card.active .card-url {
          color: rgba(255, 255, 255, 0.8);
        }

        .card-thumb-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--os-border);
          background: var(--os-bg);
          flex-shrink: 0;
        }

        .card-thumb { width: 100%; height: 100%; object-fit: cover; }

        .card-info { flex: 1; overflow: hidden; }

        .card-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }

        .card-url {
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .fav-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          opacity: 0;
          transition: opacity 0.2s;
          color: var(--text-tertiary);
        }
        .project-card:hover .fav-btn, .fav-btn.active { opacity: 1; }
        .fav-btn.active { color: var(--warning); fill: var(--warning); }

        /* --- Main Content --- */
        .main-view {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          background: var(--os-bg);
          width: 100%;
          height: calc(100vh - 60px);
        }

        .window-chrome {
          height: 48px;
          background: var(--os-surface);
          border-bottom: 1px solid var(--os-border);
          display: flex;
          align-items: center;
          padding: 0 16px;
          justify-content: space-between;
        }

        .window-controls-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .window-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .window-btn:hover {
          background: var(--os-surface-elevated);
          color: var(--text-primary);
        }

        .window-btn.close:hover {
          background: var(--danger);
          color: white;
        }

        .window-title {
          flex: 1;
          text-align: center;
          font-size: 0.813rem;
          color: var(--text-secondary);
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .window-controls-right {
          display: flex;
          gap: 8px;
        }

        .iframe-wrapper {
          flex: 1;
          position: relative;
          background: var(--os-bg);
          border-radius: 0;
          overflow: hidden;
        }

        .web-frame { 
          width: 100%; 
          height: 100%; 
          border: none;
          background: white;
        }

        /* --- Overlay for Mobile --- */
        .mobile-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 90;
          display: none;
        }

        /* --- Start Menu --- */
        .start-menu {
          position: fixed;
          bottom: 70px;
          left: 20px;
          width: 200px;
          background: var(--os-surface-elevated);
          border: 1px solid var(--os-border);
          border-radius: 12px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 2000;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          animation: slideUp 0.2s ease-out;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .start-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          transition: background 0.2s;
          font-size: 0.9rem;
        }

        .start-item:hover {
          background: var(--os-surface);
        }

        .start-item.danger:hover {
          background: var(--danger);
          color: white;
        }

        /* --- Desktop View --- */
        .desktop-view {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: var(--text-tertiary);
          background: radial-gradient(circle at center, #1a1a24 0%, #0a0a0f 100%);
        }

        .clock-display {
          margin-left: auto;
          padding: 0 20px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-variant-numeric: tabular-nums;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* --- Responsive Logic --- */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            transform: translateX(-100%);
          }
          
          .sidebar.open {
            transform: translateX(0);
            box-shadow: 10px 0 30px rgba(0,0,0,0.5);
          }

          .mobile-overlay.open {
            display: block;
          }

          .close-sidebar-btn {
            display: block;
          }
        }

        @media (min-width: 769px) {
          .sidebar.closed {
            margin-left: -280px;
          }
          .sidebar {
            position: relative;
            transform: none;
          }
        }

        /* Calendar Popover Styles */
        .calendar-popover-content {
          background: rgba(19, 19, 26, 0.95) !important;
          backdrop-filter: blur(20px);
          border: 1px solid var(--os-border) !important;
          color: var(--text-primary);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        
        .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: var(--os-accent);
          --rdp-background-color: var(--os-surface-elevated);
          margin: 0;
        }
        
        .rdp-day_selected:not([disabled]), .rdp-day_selected:focus:not([disabled]), .rdp-day_selected:active:not([disabled]), .rdp-day_selected:hover:not([disabled]) {
          background-color: var(--os-accent);
          color: white;
        }
        
        .rdp-day:hover:not(.rdp-day_selected) {
          background-color: var(--os-surface-elevated);
        }
        
        .rdp-button_reset {
          color: var(--text-primary);
        }
        
        .rdp-nav_button {
          color: var(--text-secondary);
        }
        
        .rdp-nav_button:hover {
          color: var(--text-primary);
          background-color: var(--os-surface-elevated);
        }
      `}</style>

      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-top-row">
            <div className="sidebar-title">BLACKICE OS</div>
            <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="project-card"
            style={{
              width: "100%",
              marginBottom: 0,
              background: "rgba(59, 130, 246, 0.1)",
              borderColor: "rgba(59, 130, 246, 0.3)",
            }}
            onClick={() =>
              handleProjectSelect("https://black-ice-3dbk.onrender.com/elegant-store.html", "Submit Project")
            }
          >
            <div
              className="card-thumb-wrapper"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--os-accent)",
              }}
            >
              <Plus color="white" size={20} />
            </div>
            <div className="card-info">
              <div className="card-title" style={{ color: "var(--os-accent)" }}>
                Submit Project
              </div>
              <div className="card-url">Join the showcase</div>
            </div>
          </button>
        </div>

        <div className="nav-list">
          {/* Home Button */}
          <div
            className={`project-card ${activeUrl === "https://black-ice-3dbk.onrender.com" ? "active" : ""}`}
            onClick={() => handleProjectSelect("https://black-ice-3dbk.onrender.com", "BlackICE Academy")}
          >
            <div
              className="card-thumb-wrapper"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--os-surface-elevated)",
              }}
            >
              <Home color="var(--text-secondary)" size={18} />
            </div>
            <div className="card-info">
              <div className="card-title">Home</div>
              <div className="card-url">BlackICE Portal</div>
            </div>
          </div>

          {/* Favorites Section */}
          {favorites.length > 0 && (
            <>
              <div className="section-label">Favorites</div>
              {projects
                .filter((p) => favorites.includes(p.id))
                .map((p) => (
                  <div
                    key={`fav-${p.id}`}
                    className={`project-card ${activeUrl === p.url ? "active" : ""}`}
                    onClick={() => handleProjectSelect(p.url, p.title)}
                  >
                    <div className="card-thumb-wrapper">
                      <img
                        src={getScreenshotUrl(p.url) || "/placeholder.svg"}
                        className="card-thumb"
                        loading="lazy"
                        alt=""
                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40/1a1a24/64748b?text=?")}
                      />
                    </div>
                    <div className="card-info">
                      <div className="card-title">{p.title}</div>
                      <div className="card-url">{getHostname(p.url)}</div>
                    </div>
                    <button className="fav-btn active" onClick={(e) => toggleFavorite(e, p.id)}>
                      <Star size={14} fill="var(--warning)" />
                    </button>
                  </div>
                ))}
            </>
          )}

          <div className="section-label">All Projects ({filteredProjects.length})</div>

          {loading ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-tertiary)" }}>Loading...</div>
          ) : (
            filteredProjects.map((p) => (
              <div
                key={p.id}
                className={`project-card ${activeUrl === p.url ? "active" : ""}`}
                onClick={() => handleProjectSelect(p.url, p.title)}
              >
                <div className="card-thumb-wrapper">
                  <img
                    src={getScreenshotUrl(p.url) || "/placeholder.svg"}
                    className="card-thumb"
                    loading="lazy"
                    alt=""
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40/1a1a24/64748b?text=?")}
                  />
                </div>
                <div className="card-info">
                  <div className="card-title">{p.title || "Untitled"}</div>
                  <div className="card-url">{getHostname(p.url)}</div>
                </div>
                <button
                  className={`fav-btn ${favorites.includes(p.id) ? "active" : ""}`}
                  onClick={(e) => toggleFavorite(e, p.id)}
                >
                  <Star size={14} fill={favorites.includes(p.id) ? "var(--warning)" : "none"} />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main View */}
      <main className="main-view">
        {activeUrl ? (
          <>
            <header className="window-chrome">
              <div className="window-controls-left">
                <button className="window-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
              </div>

              <div className="window-title">
                <span>{activeTitle}</span>
                <ChevronRight size={12} />
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-4 h-4 rounded border border-slate-700 bg-slate-800 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                  </div>
                  <span>{getHostname(activeUrl)}</span>
                </div>
              </div>

              <div className="window-controls-right">
                <button className="window-btn" onClick={handleMinimize}>
                  <Minimize2 size={14} />
                </button>
                <button className="window-btn" onClick={handleMaximize}>
                  <Maximize2 size={14} />
                </button>
                <button className="window-btn close" onClick={handleClose}>
                  <XCircle size={14} />
                </button>
              </div>
            </header>

            {!isMinimized && (
              <div className="iframe-wrapper">
                <iframe
                  src={activeUrl}
                  className="web-frame"
                  title={activeTitle}
                  allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write; fullscreen"
                  allowFullScreen
                />
              </div>
            )}
            {isMinimized && (
              <div className="desktop-view">
                <Monitor size={64} style={{ opacity: 0.2, marginBottom: 20 }} />
                <div>Application Minimized</div>
              </div>
            )}
          </>
        ) : (
          <div className="desktop-view">
            <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem", color: "var(--os-accent)" }}>
              BLACKICE OS
            </div>
            <div>Select a project to begin</div>
          </div>
        )}
      </main>

      {startMenuOpen && (
        <div className="start-menu">
          <div className="start-item" onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Restart System
          </div>
          <div className="start-item danger" onClick={() => setIsSleeping(true)}>
            <Power size={16} /> Sleep Mode
          </div>
        </div>
      )}

      <div className="os-taskbar">
        <div className="taskbar-item" onClick={handleTaskbarSearch} title="Search">
          <Search size={20} color="var(--text-secondary)" />
        </div>

        <div
          className="taskbar-item"
          onClick={() => handleProjectSelect("https://black-ice-3dbk.onrender.com", "BlackICE Portal")}
          title="Home"
        >
          <Home size={20} color="var(--text-secondary)" />
        </div>

        <div className="taskbar-item" onClick={() => setSidebarOpen(true)} title="Favorites">
          <Star size={20} color="var(--text-secondary)" />
        </div>

        <div className="clock-display">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button className="flex flex-col items-end justify-center h-full px-3 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-none bg-transparent outline-none">
                <div className="text-sm font-medium text-slate-200 tabular-nums leading-none mb-1">
                  {format(currentTime, "HH:mm")}
                </div>
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider leading-none">
                  {format(currentTime, "MMM dd")}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" align="end" sideOffset={12}>
              <div className="calendar-popover-content rounded-xl p-4">
                <Calendar mode="single" selected={currentTime} className="rounded-md" />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

export default BlackIceShowcase
