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
  Shield,
  CheckCircle,
  Cloud,
  Sun,
  CloudRain,
  Newspaper,
  Minus,
  Square,
  Moon,
  BarChart3,
  Eye,
  Clock,
  Zap,
  Bell,
  Settings,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  TrendingUp,
  Activity,
  BatteryCharging,
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  const [securityScanning, setSecurityScanning] = useState(false)
  const [securitySecure, setSecuritySecure] = useState(false)
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false)
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null)
  const [news, setNews] = useState<string | null>(null)
  const [newsList, setNewsList] = useState<Array<{ title: string; link: string }>>([])
  const [newsExpanded, setNewsExpanded] = useState(false)
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [isDarkMode, setIsDarkMode] = useState(true)
  const [dashboardOpen, setDashboardOpen] = useState(false)
  const [visitedProjects, setVisitedProjects] = useState<Set<string>>(new Set())
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [isCharging, setIsCharging] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Welcome to BlackICE OS", message: "Your system is ready", time: "Just now", read: false },
    { id: 2, title: "Security Scan Complete", message: "No threats found", time: "2m ago", read: false },
    { id: 3, title: "Weather Update", message: "Clear skies today", time: "5m ago", read: true },
  ])
  const [sessionStartTime] = useState(new Date())
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const currentDate = format(currentTime, "MMM dd")

  useEffect(() => {
    if (typeof window !== "undefined" && "getBattery" in navigator) {
      ;(navigator as any).getBattery().then((battery: any) => {
        const updateBatteryInfo = () => {
          setBatteryLevel(Math.round(battery.level * 100))
          setIsCharging(battery.charging)
        }

        updateBatteryInfo()

        battery.addEventListener("levelchange", updateBatteryInfo)
        battery.addEventListener("chargingchange", updateBatteryInfo)

        return () => {
          battery.removeEventListener("levelchange", updateBatteryInfo)
          battery.removeEventListener("chargingchange", updateBatteryInfo)
        }
      })
    } else {
      // Fallback for browsers without Battery API support
      const interval = setInterval(() => {
        setBatteryLevel((prev) => Math.max(prev - 1, 10))
      }, 60000)
      return () => clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (activeUrl && activeUrl !== "https://black-ice-3dbk.onrender.com") {
      setVisitedProjects((prev) => new Set([...prev, activeUrl]))
    }
  }, [activeUrl])

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) => Math.max(prev - 1, 10))
    }, 60000) // Decrease by 1% every minute
    return () => clearInterval(interval)
  }, [])

  const getSessionDuration = () => {
    const now = new Date()
    const diff = now.getTime() - sessionStartTime.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m`
  }

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

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
          )
          const data = await res.json()
          if (data.current_weather) {
            setWeather({
              temp: Math.round(data.current_weather.temperature),
              condition: getWeatherCondition(data.current_weather.weathercode),
            })
          }
        } catch (e) {
          console.error("Failed to fetch weather", e)
        }
      },
      (err) => console.error("Geolocation error", err),
    )
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/world/rss.xml",
        )
        const data = await response.json()
        if (data.items && data.items.length > 0) {
          setNews(data.items[0].title)
          setNewsList(
            data.items.slice(0, 10).map((item: any) => ({
              title: item.title,
              link: item.link,
            })),
          )
        }
      } catch (error) {
        console.error("Failed to fetch news", error)
      }
    }

    fetchNews()
    const newsInterval = setInterval(fetchNews, 10000)

    return () => {
      clearInterval(newsInterval)
    }
  }, [])

  useEffect(() => {
    if (newsList.length === 0) return
    const rotateInterval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsList.length)
    }, 10000)
    return () => clearInterval(rotateInterval)
  }, [newsList])

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

  const handleSecurityClick = () => {
    setSecurityDialogOpen(true)
    setSecurityScanning(true)
    setSecuritySecure(false)

    setTimeout(() => {
      setSecurityScanning(false)
      setSecuritySecure(true)
    }, 2000)
  }

  const getWeatherCondition = (code: number) => {
    if (code <= 3) return "Clear"
    if (code <= 48) return "Cloudy"
    if (code <= 82) return "Rain"
    return "Storm"
  }

  const themeColors = isDarkMode
    ? {
        bg: "#0a0a0f",
        surface: "#13131a",
        surfaceElevated: "#1a1a24",
        border: "#252530",
        accent: "#3b82f6",
        textPrimary: "#f1f5f9",
        textSecondary: "#94a3b8",
        textTertiary: "#64748b",
      }
    : {
        bg: "#f8fafc",
        surface: "#ffffff",
        surfaceElevated: "#f1f5f9",
        border: "#e2e8f0",
        accent: "#3b82f6",
        textPrimary: "#0f172a",
        textSecondary: "#475569",
        textTertiary: "#94a3b8",
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
        style={{
          width: "100vw",
          height: "100vh",
          background: "radial-gradient(circle at center, #1e293b 0%, #020617 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
    <div className="app-container" data-theme={isDarkMode ? "dark" : "light"}>
      <style>{`
        :root {
          --os-bg: ${themeColors.bg};
          --os-surface: ${themeColors.surface};
          --os-surface-elevated: ${themeColors.surfaceElevated};
          --os-border: ${themeColors.border};
          --os-accent: ${themeColors.accent};
          --os-accent-hover: #2563eb;
          --text-primary: ${themeColors.textPrimary};
          --text-secondary: ${themeColors.textSecondary};
          --text-tertiary: ${themeColors.textTertiary};
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
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          height: auto;
          background: ${
            isDarkMode
              ? "linear-gradient(180deg, rgba(30, 30, 40, 0.85) 0%, rgba(20, 20, 28, 0.95) 100%)"
              : "linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)"
          };
          backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"};
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 16px;
          z-index: 1000;
          box-shadow: ${
            isDarkMode
              ? "0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset"
              : "0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset"
          };
        }

        .taskbar-item {
          width: 44px;
          height: 44px;
          background: transparent;
          border: none;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .taskbar-item:hover {
          background: ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"};
          /* updated to macOS-style hover scale and shift */
          transform: translateY(-12px) scale(1.4);
          z-index: 10;
        }

        /* added adjacent icon scaling for macOS-style dock effect */
        .taskbar-item:hover + .taskbar-item,
        .taskbar-item:has(+ .taskbar-item:hover) {
          transform: translateY(-6px) scale(1.2);
        }

        .taskbar-item:active {
          transform: translateY(-4px) scale(1.05);
        }

        .taskbar-item.active::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          background: var(--os-accent);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--os-accent);
        }

        .taskbar-divider {
          width: 1px;
          height: 28px;
          background: ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
          margin: 0 6px;
        }

        .taskbar-widget {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 12px;
          background: ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)"};
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .taskbar-widget:hover {
          background: ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"};
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
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
          background: ${isDarkMode ? "radial-gradient(circle at center, #1a1a24 0%, #0a0a0f 100%)" : "radial-gradient(circle at center, #f1f5f9 0%, #e2e8f0 100%)"};
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
          background: ${isDarkMode ? "rgba(19, 19, 26, 0.95)" : "rgba(255, 255, 255, 0.95)"} !important;
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

        /* Security Dialog Styles */
        .security-dialog-content {
          background: ${isDarkMode ? "rgba(19, 19, 26, 0.95)" : "rgba(255, 255, 255, 0.95)"} !important;
          backdrop-filter: blur(20px);
          border: 1px solid var(--os-border) !important;
          color: var(--text-primary);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        
        .scan-line {
          height: 2px;
          background: var(--os-accent);
          box-shadow: 0 0 10px var(--os-accent);
          animation: scan 2s infinite linear;
        }
        
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }

        /* Custom Scrollbar for News Modal */
        .news-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .news-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .news-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
        }
        .news-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* Dashboard Panel Styles */
        .dashboard-panel {
          position: fixed;
          bottom: 70px;
          right: 20px;
          width: 380px;
          max-height: 520px;
          background: ${isDarkMode ? "linear-gradient(180deg, #13131a 0%, #0a0a0f 100%)" : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"};
          border: 1px solid var(--os-border);
          border-radius: 16px;
          z-index: 2000;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: slideUp 0.25s ease-out;
          overflow: hidden;
        }

        .stat-card {
          background: ${isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"};
          border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s;
        }

        .stat-card:hover {
          background: ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
          border-color: var(--os-accent);
        }

        /* Notification Panel Styles */
        .notification-panel {
          position: fixed;
          bottom: 70px;
          right: 80px;
          width: 320px;
          max-height: 400px;
          background: ${isDarkMode ? "rgba(19, 19, 26, 0.95)" : "rgba(255, 255, 255, 0.95)"};
          backdrop-filter: blur(20px);
          border: 1px solid var(--os-border);
          border-radius: 16px;
          z-index: 2000;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: slideUp 0.25s ease-out;
          overflow: hidden;
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
            className={`project-card ${activeUrl === "https://blackice-ac.vercel.app/" ? "active" : ""}`}
            onClick={() => handleProjectSelect("https://blackice-ac.vercel.app/", "BlackICE Academy")}
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
              <div className="card-title">BlackICE Academy</div>
              <div className="card-url">Official Portal</div>
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

      {/* Start Menu */}
      {startMenuOpen && (
        <div className="start-menu">
          <div
            className="start-item"
            onClick={() => {
              setDashboardOpen(true)
              setStartMenuOpen(false)
            }}
          >
            <BarChart3 size={16} /> Dashboard
          </div>
          <div
            className="start-item"
            onClick={() => {
              setIsDarkMode(!isDarkMode)
              setStartMenuOpen(false)
            }}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />} {isDarkMode ? "Light Mode" : "Dark Mode"}
          </div>
          <div className="start-item" onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Restart System
          </div>
          <div className="start-item danger" onClick={() => setIsSleeping(true)}>
            <Power size={16} /> Sleep Mode
          </div>
        </div>
      )}

      {dashboardOpen && (
        <div className="dashboard-panel">
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}
              >
                <BarChart3 size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  Dashboard
                </h2>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  System Overview
                </p>
              </div>
            </div>
            <button
              onClick={() => setDashboardOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: "var(--text-tertiary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <X size={16} />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Projects Visited */}
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={14} className="text-blue-400" />
                  <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Visited
                  </span>
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {visitedProjects.size}
                </div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  projects this session
                </div>
              </div>

              {/* Not Visited */}
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Not Visited
                  </span>
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {Math.max(0, projects.length - visitedProjects.size)}
                </div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  remaining projects
                </div>
              </div>

              {/* Favorites */}
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={14} className="text-yellow-400" />
                  <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Favorites
                  </span>
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {favorites.length}
                </div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  saved projects
                </div>
              </div>

              {/* Session Time */}
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-purple-400" />
                  <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Session
                  </span>
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {getSessionDuration()}
                </div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  active time
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-cyan-400" />
                <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                  System Status
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu size={12} style={{ color: "var(--text-tertiary)" }} />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      CPU Usage
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-24 h-1.5 rounded-full overflow-hidden"
                      style={{ background: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
                    >
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: "23%" }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      23%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive size={12} style={{ color: "var(--text-tertiary)" }} />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Memory
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-24 h-1.5 rounded-full overflow-hidden"
                      style={{ background: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
                    >
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: "45%" }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      45%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi size={12} style={{ color: "var(--text-tertiary)" }} />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Network
                    </span>
                  </div>
                  <span className="text-xs font-medium text-emerald-400">Connected</span>
                </div>
              </div>
            </div>

            {/* Total Projects */}
            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <div className="flex items-center gap-3">
                <Zap size={18} className="text-blue-400" />
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    Total Projects
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    in BlackICE showcase
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-400">{projects.length}</div>
            </div>
          </div>
        </div>
      )}

      {notificationsOpen && (
        <div className="notification-panel">
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Notifications
            </h3>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ color: "var(--text-tertiary)" }}
            >
              <X size={14} />
            </button>
          </div>
          <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3 rounded-lg transition-colors cursor-pointer"
                style={{
                  background: notif.read
                    ? "transparent"
                    : isDarkMode
                      ? "rgba(59, 130, 246, 0.1)"
                      : "rgba(59, 130, 246, 0.05)",
                  borderLeft: notif.read ? "none" : "2px solid var(--os-accent)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {notif.title}
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {notif.time}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  {notif.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="os-taskbar">
        {/* Main App Icons */}
        <div className="taskbar-item" onClick={handleTaskbarSearch} title="Search">
          <Search size={22} style={{ color: isDarkMode ? "#94a3b8" : "#64748b" }} />
        </div>

        <div className="taskbar-item" onClick={() => setSidebarOpen(true)} title="Apps">
          <Star size={22} style={{ color: "#facc15" }} />
        </div>

        <div className="taskbar-item" onClick={() => setDashboardOpen(!dashboardOpen)} title="Dashboard">
          <BarChart3 size={22} style={{ color: isDarkMode ? "#94a3b8" : "#64748b" }} />
        </div>

        <div className="taskbar-divider" />

        {/* System Controls */}
        <div
          className="taskbar-item"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode ? (
            <Sun size={20} style={{ color: "#fbbf24" }} />
          ) : (
            <Moon size={20} style={{ color: "#6366f1" }} />
          )}
        </div>

        <div className="taskbar-item" onClick={() => setStartMenuOpen(!startMenuOpen)} title="Settings">
          <Settings size={20} style={{ color: isDarkMode ? "#94a3b8" : "#64748b" }} />
        </div>

        <div className="taskbar-item" onClick={handleSecurityClick} title="Security">
          <Shield size={20} style={{ color: "#22c55e" }} />
        </div>

        <div
          className="taskbar-item relative"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          title="Notifications"
        >
          <Bell size={20} style={{ color: isDarkMode ? "#94a3b8" : "#64748b" }} />
          {notifications.filter((n) => !n.read).length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              {notifications.filter((n) => !n.read).length}
            </div>
          )}
        </div>

        <div className="taskbar-divider" />

        {/* Widgets Section */}
        {weather && (
          <div className="taskbar-widget">
            {weather.condition === "Clear" && <Sun size={16} className="text-yellow-400" />}
            {weather.condition === "Cloudy" && <Cloud size={16} className="text-slate-400" />}
            {weather.condition === "Rain" && <CloudRain size={16} className="text-blue-400" />}
            {weather.condition === "Storm" && <CloudRain size={16} className="text-purple-400" />}
            <span className="text-xs font-medium" style={{ color: isDarkMode ? "#e2e8f0" : "#334155" }}>
              {weather.temp}°
            </span>
          </div>
        )}

        {news && (
          <div className="taskbar-widget max-w-[180px] overflow-hidden" onClick={() => setNewsExpanded(true)}>
            <Newspaper size={14} className="text-cyan-400 shrink-0" />
            <div className="text-xs font-medium truncate" style={{ color: isDarkMode ? "#94a3b8" : "#64748b" }}>
              {newsList[currentNewsIndex]?.title || news}
            </div>
          </div>
        )}

        {/* Battery & Time */}
        <div className="taskbar-widget">
          {isCharging ? (
            <BatteryCharging
              size={16}
              className={batteryLevel > 60 ? "text-green-400" : batteryLevel > 20 ? "text-yellow-400" : "text-red-400"}
            />
          ) : (
            <Battery
              size={16}
              className={batteryLevel > 60 ? "text-green-400" : batteryLevel > 20 ? "text-yellow-400" : "text-red-400"}
            />
          )}
          <span className="text-xs font-medium" style={{ color: isDarkMode ? "#94a3b8" : "#64748b" }}>
            {batteryLevel}%
          </span>
        </div>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <div className="taskbar-widget">
              <div className="text-right">
                <div className="text-xs font-semibold" style={{ color: isDarkMode ? "#e2e8f0" : "#1e293b" }}>
                  {format(currentTime, "HH:mm")}
                </div>
                <div className="text-[10px]" style={{ color: isDarkMode ? "#64748b" : "#94a3b8" }}>
                  {currentDate}
                </div>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 border-0"
            align="end"
            side="top"
            sideOffset={16}
            style={{
              background: isDarkMode
                ? "linear-gradient(180deg, rgba(30, 30, 40, 0.95) 0%, rgba(20, 20, 28, 0.98) 100%)"
                : "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 1) 100%)",
              backdropFilter: "blur(24px)",
              border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
              borderRadius: "16px",
              boxShadow: isDarkMode ? "0 16px 48px rgba(0, 0, 0, 0.5)" : "0 16px 48px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Calendar
              mode="single"
              selected={currentTime}
              className="p-3"
              classNames={{
                day_selected: "bg-cyan-500 text-white hover:bg-cyan-600",
                day_today: "bg-cyan-500/20 text-cyan-400",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* News Expanded Modal */}
      {newsExpanded && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end p-4 pb-16">
          {/* OS-style window container */}
          <div
            className="w-[420px] max-h-[600px] flex flex-col rounded-xl overflow-hidden shadow-2xl shadow-black/50"
            style={{
              background: isDarkMode
                ? "linear-gradient(180deg, #0d0d12 0%, #0a0a0f 100%)"
                : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
              border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
              animation: "slideUp 0.25s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Window Title Bar */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background: isDarkMode
                  ? "linear-gradient(180deg, #18181f 0%, #13131a 100%)"
                  : "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                borderBottom: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"}`,
              }}
            >
              <div className="flex items-center gap-3">
                {/* App Icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" }}
                >
                  <Newspaper size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    News
                  </h2>
                  <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                    BBC World
                  </p>
                </div>
              </div>
              {/* Window Controls */}
              <div className="flex items-center gap-1">
                <button
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <Minus size={14} />
                </button>
                <button
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <Square size={12} />
                </button>
                <button
                  onClick={() => setNewsExpanded(false)}
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-red-500/20 hover:text-red-400"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Featured Story */}
            {newsList[0] && (
              <a
                href={newsList[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block mx-3 mt-3 rounded-lg overflow-hidden group"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(135deg, #1a1a24 0%, #13131a 100%)"
                    : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-cyan-500/20 text-cyan-400">
                      Top Story
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <h3
                    className="text-sm font-medium leading-relaxed group-hover:text-cyan-400 transition-colors"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {newsList[0].title}
                  </h3>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            )}

            {/* News List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 news-scroll">
              <div className="space-y-1">
                {newsList.slice(1).map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors group"
                    style={{ background: "transparent" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{
                        background: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {idx + 2}
                    </div>
                    <p
                      className="text-xs leading-relaxed flex-1 transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.title}
                    </p>
                    <ChevronRight
                      size={14}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-all text-cyan-400"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-4 py-2 flex items-center justify-between"
              style={{
                background: isDarkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.05)",
                borderTop: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)"}`,
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                  Live updates
                </span>
              </div>
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Security Dialog */}
      <Dialog open={securityDialogOpen} onOpenChange={setSecurityDialogOpen}>
        <DialogContent className="security-dialog-content border-none sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Shield className="text-emerald-400" size={20} />
              System Security
            </DialogTitle>
          </DialogHeader>
          <div
            className="py-6 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden rounded-lg"
            style={{ background: isDarkMode ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.05)" }}
          >
            {securityScanning ? (
              <>
                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                <div className="w-full absolute top-0 scan-line" />
                <Shield size={64} className="text-emerald-500/50 animate-bounce mb-4" />
                <div className="text-emerald-400 font-mono text-sm animate-pulse">SCANNING SYSTEM FILES...</div>
                <div className="text-xs mt-2 font-mono" style={{ color: "var(--text-tertiary)" }}>
                  Checking integrity...
                </div>
              </>
            ) : securitySecure ? (
              <>
                <div className="absolute inset-0 bg-emerald-500/10" />
                <div className="relative z-10 bg-emerald-500/20 p-4 rounded-full mb-4">
                  <CheckCircle size={48} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-emerald-400 mb-1">System Secure</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  No threats detected
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 w-full px-8">
                  <div
                    className="p-3 rounded text-center"
                    style={{
                      background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                    }}
                  >
                    <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-tertiary)" }}>
                      Firewall
                    </div>
                    <div className="text-emerald-400 text-sm font-medium">Active</div>
                  </div>
                  <div
                    className="p-3 rounded text-center"
                    style={{
                      background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                    }}
                  >
                    <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-tertiary)" }}>
                      Protection
                    </div>
                    <div className="text-emerald-400 text-sm font-medium">Real-time</div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BlackIceShowcase
