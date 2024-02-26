import React, { useContext, useEffect, useState } from 'react';
import Toast from '../components/Toast';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';

type ToastMessage = {
  message: string;
  type: 'SUCCESS' | 'ERROR';
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoogedIn: boolean) => void;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const { isError, isSuccess } = useQuery('validateToken', apiClient.validateToken, {
    retry: false,
    onSuccess: () => setIsLoggedIn(true),
    onError: () => setIsLoggedIn(false),
    cacheTime: 0,
  });

  useEffect(() => {
    if (isSuccess) {
      setIsLoggedIn(true);
    } else if (isError) {
      setIsLoggedIn(false);
    }
  }, [isError, isSuccess]);

  return (
    <AppContext.Provider
      value={{
        showToast: toastMessage => {
          setToast(toastMessage);
        },

        isLoggedIn,
        setIsLoggedIn: (value: boolean) => setIsLoggedIn(value),
      }}
    >
      {children}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(undefined)} />}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
