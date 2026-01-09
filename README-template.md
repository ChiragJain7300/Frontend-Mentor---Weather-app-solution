import { createContext, ReactNode } from "react";

export const WeatherContext = createContext({});

export function ThemeProvider({ children }) {
return <WeatherContext.Provider value={}>{children}</WeatherContext.Provider>;
}
