import { createContext, useContext, useEffect } from "react"

// Theme is permanently locked to dark — no toggle
type ThemeProviderState = {
  theme: "dark"
  setTheme: (theme: "dark") => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) {
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light")
    root.classList.add("dark")
    // Persist so any local-storage-based reader also sees dark
    localStorage.setItem("gfg-theme", "dark")
  }, [])

  return (
    <ThemeProviderContext.Provider {...props} value={{ theme: "dark", setTheme: () => null }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
