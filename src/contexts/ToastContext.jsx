import { createContext, useState, useCallback } from 'react';
import ToastContainer from '../components/common/Toast/ToastContainer';

const ToastContext = createContext();

let id = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const newToast = { id: id++, message, type };
    setToasts(prevToasts => [newToast, ...prevToasts]);
    
    setTimeout(() => {
      removeToast(newToast.id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const value = { addToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastContext;