import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 페이지 로드 시 인증 상태 확인
    const token = localStorage.getItem('admin_token');
    if (token) {
      // 실제로는 서버에서 토큰 유효성 검증해야 함
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    // 실제로는 서버 API 호출해야 함
    // 여기서는 간단한 하드코딩된 인증
    if (username === 'admin' && password === 'admin123!') {
      const token = 'fake-jwt-token-' + Date.now();
      localStorage.setItem('admin_token', token);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};