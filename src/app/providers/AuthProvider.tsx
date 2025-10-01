// Provides authentication context for the app

import { ReactNode, createContext, useContext } from "react";

// Define shape of auth context (to be expanded later)
export type AuthContextType = {
    status: "loading" | "unauthenticated" | "authenticated";
};

const initialAuthContext: AuthContextType = {
    status: "loading",
};

// Create context with a safe default value
const AuthContext = createContext<AuthContextType>(initialAuthContext);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    // TODO: wire up supabase session + state here

    // return context wrapper
    return (
        <AuthContext.Provider value={initialAuthContext}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook for accessing auth context
export function useAuth() {
    return useContext(AuthContext);
}
