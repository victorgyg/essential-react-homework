import { createContext, useState, useContext, ReactNode } from 'react';

interface LotteryModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const LotteryModalContext = createContext<LotteryModalContextValue | undefined>(
  undefined,
);

export function LotteryModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <LotteryModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </LotteryModalContext.Provider>
  );
}

export function useLotteryModalContext() {
  const context = useContext(LotteryModalContext);
  if (!context) {
    throw new Error(
      'useLotteryModalContext must be used within LotteryModalProvider',
    );
  }
  return context;
}
