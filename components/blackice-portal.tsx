'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronDown, Sparkles } from 'lucide-react'

interface SearchEngine {
  name: string
  url: string
  aiUrl: string
  domain: string
}

const searchEngines: SearchEngine[] = [
  {
    name: 'Brave',
    url: 'https://search.brave.com/search?q=%s',
    aiUrl: 'https://search.brave.com/ask?q=%s',
    domain: 'search.brave.com',
  },
  {
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/?q=%s',
    aiUrl: '',
    domain: 'perplexity.ai',
  },
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=%s',
    aiUrl: 'https://duck.ai/chat?q=%s',
    domain: 'duckduckgo.com',
  },
]

export default function BlackICEPortal() {
  const [selectedEngine, setSelectedEngine] = useState(0)
  const [query, setQuery] = useState("")
  const [showAiBtn, setShowAiBtn] = useState(true)
  const [favicon, setFavicon] = useState("")

  useEffect(() => {
    updateUI()
  }, [selectedEngine])

  const updateUI = () => {
    const engine = searchEngines[selectedEngine]
    setShowAiBtn(engine.aiUrl !== "")
    setFavicon(`https://www.google.com/s2/favicons?domain=${engine.domain}&sz=32`)
  }

  const handleSearch = (type: "standard" | "ai") => {
    if (!query.trim()) return

    const engine = searchEngines[selectedEngine]
    let urlTemplate = type === "ai" ? engine.aiUrl || engine.url : engine.url
    const finalUrl = urlTemplate.replace("%s", encodeURIComponent(query))

    window.open(finalUrl, "_blank")
  }

  const features = [
    {
      title: "AI Core",
      description: "Focus enhancement, health tracking, and automated intelligence workflows.",
    },
    {
      title: "Productivity",
      description: "Task management, habit tracking, and advanced planning systems.",
    },
    {
      title: "Creation",
      description: "Docs, slides, whiteboards, and mind maps in one unified interface.",
    },
    {
      title: "Dev Tools",
      description: "HTML viewers, Git utilities, and minimal developer environments.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] bg-gradient-to-br from-[#1a1a1e] to-[#09090b] overflow-x-hidden relative">
      {/* Ambient Glow */}
      <div
        className="fixed w-[600px] h-[600px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-[900px] mx-auto px-5 py-20 gap-[60px] animate-in fade-in slide-in-from-bottom-5 duration-1200">
        {/* Hero Section */}
        <main className="w-full flex flex-col items-center text-center">
          <h1
            className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-tight mb-5 bg-gradient-to-b from-white to-[#a1a1aa] bg-clip-text text-transparent cursor-pointer transition-all duration-300 hover:opacity-90 hover:scale-[1.01]"
            style={{
              textShadow: "0 0 40px rgba(255, 255, 255, 0.1)",
            }}
            onClick={() => window.open("/test/dev.html", "_blank")}
          >
            BlackICE Portal
          </h1>

          <p className="text-[1.125rem] text-[#a1a1aa] max-w-[500px] leading-relaxed font-light">
            The operating system for your web productivity.
            <br />
            Seamlessly integrated AI, Utilities, and Workspace tools.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-[560px] mt-[35px]">
            <div
              className="flex items-center gap-1.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-full p-1.5 transition-all duration-300 hover:border-[#3b82f6] hover:bg-[rgba(255,255,255,0.06)]"
              style={{
                boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Engine Selector */}
              <div className="relative flex items-center justify-center px-3.5 h-10 border-r border-[rgba(255,255,255,0.1)] cursor-pointer group">
                <select
                  value={selectedEngine}
                  onChange={(e) => setSelectedEngine(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                >
                  {searchEngines.map((engine, idx) => (
                    <option key={idx} value={idx}>
                      {engine.name}
                    </option>
                  ))}
                </select>

                {favicon && (
                  <img
                    src={favicon}
                    alt="Search Engine"
                    className="w-5 h-5 rounded transition-transform duration-200 group-hover:scale-110"
                  />
                )}

                <ChevronDown size={12} className="ml-2 text-[#a1a1aa]" />
              </div>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search the web..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch("standard")
                }}
                className="flex-1 bg-transparent border-none outline-none text-white text-sm font-normal px-4 py-0 placeholder-[#a1a1aa] placeholder-opacity-70"
              />

              {/* Search Buttons */}
              <div className="flex items-center gap-2 pl-1">
                <button
                  onClick={() => handleSearch("standard")}
                  title="Standard Search"
                  className="w-10 h-10 flex items-center justify-center bg-[#3b82f6] rounded-full cursor-pointer transition-all duration-200 text-white hover:bg-[#2563eb] hover:scale-105 active:scale-95"
                >
                  <Search size={18} strokeWidth={2.5} />
                </button>

                {showAiBtn && (
                  <button
                    onClick={() => handleSearch("ai")}
                    title="AI Search / Chat"
                    className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-full cursor-pointer transition-all duration-300 text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95"
                  >
                    <Sparkles size={18} strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Hint Box */}
          <div
            className="flex items-center justify-center px-6 py-3 mt-5 bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.08)] rounded-full backdrop-blur-[10px]"
            style={{
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <p className="text-[0.85rem] font-medium text-[rgba(255,255,255,0.8)]">
              Click the button toggle at left bottom to open projects
            </p>
          </div>
        </main>

        {/* Features Section */}
        <section
          className="w-full bg-[rgba(9,9,11,0.65)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-3xl p-10 text-center"
          style={{
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 20px 40px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <span className="text-xs uppercase tracking-[0.1em] text-[#3b82f6] mb-6 block font-semibold">
            System Capabilities
          </span>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 text-left mt-5">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] transition-all duration-200 hover:bg-[rgba(255,255,255,0.06)] hover:-translate-y-0.5"
              >
                <h3 className="text-sm font-medium text-white mb-1.5">{feature.title}</h3>
                <p className="text-[0.85rem] text-[#a1a1aa] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
