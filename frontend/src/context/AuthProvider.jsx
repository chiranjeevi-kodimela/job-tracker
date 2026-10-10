import { useCallback, useEffect, useMemo, useState } from "react";

import {
  clearToken,
  getCurrentUser,
  getToken,
  setToken as storeToken,
  setUnauthorizedHandler,
} from "../services/api";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(null);

  const loading = Boolean(token) && !user;

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUser(null);
  }, []);

  const login = useCallback((newToken, newUser = null) => {
    storeToken(newToken);
    setTokenState(newToken);
    setUser(newUser);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    if (!token || user) return undefined;

    let cancelled = false;

    getCurrentUser()
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {

        if (!cancelled) logout();
      });

    return () => {
      cancelled = true;
    };
  }, [token, user, logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
      updateUser: setUser,
    }),
    [token, user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
