import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";

const AuthContext = createContext(null);

const ROLES = {
    BUYER: "BUYER",
    SELLER: "SELLER",
    INSPECTOR: "INSPECTOR",
    ADMIN: "ADMIN",
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔹 load session
    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            if (stored && token) {
                setUser(JSON.parse(stored));
            }
        } catch {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }

        setLoading(false);
    }, []);

    /**
     * ============================================================
     * LOGIN → CALL API.JS
     * ============================================================
     */
    const login = async (credentials) => {
        const res = await api.login(credentials);

        if (!res.success) {
            throw new Error(res.message || "Login failed");
        }

        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);

        return res.user;
    };

    /**
     * ============================================================
     * REGISTER → CALL API.JS
     * ============================================================
     */
    const register = async (data) => {
        const res = await api.register(data);

        if (!res.success) {
            throw new Error(res.message || "Register failed");
        }

        return res;
    };

    /**
     * ============================================================
     * LOGOUT
     * ============================================================
     */
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    /**
     * ============================================================
     * UPDATE USER LOCAL
     * ============================================================
     */
    const updateUser = (updates) => {
        const next = { ...user, ...updates };
        localStorage.setItem("user", JSON.stringify(next));
        setUser(next);
    };

    /**
     * ============================================================
     * ROLE HELPERS (GIỮ NGUYÊN)
     * ============================================================
     */
    const hasRole = (role) => user?.roles?.includes(role) ?? false;
    const isBuyer = () => hasRole(ROLES.BUYER);
    const isSeller = () => hasRole(ROLES.SELLER);
    const isInspector = () => hasRole(ROLES.INSPECTOR);
    const isAdmin = () => hasRole(ROLES.ADMIN);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                updateUser,
                ROLES,
                hasRole,
                isBuyer,
                isSeller,
                isInspector,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}