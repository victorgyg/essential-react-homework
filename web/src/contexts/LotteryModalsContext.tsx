import { createContext, useContext, useState, type ReactNode } from 'react';

/**
 * Context for managing modal open/close states.
 * Handles both Add Lottery and Register modals.
 */
interface LotteryModalsContextValue {
  // Add Lottery Modal
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;

  // Register Modal
  isRegisterModalOpen: boolean;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
}

const LotteryModalsContext = createContext<
  LotteryModalsContextValue | undefined
>(undefined);

export function LotteryModalsProvider({ children }: { children: ReactNode }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  return (
    <LotteryModalsContext.Provider
      value={{
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        isRegisterModalOpen,
        openRegisterModal,
        closeRegisterModal,
      }}
    >
      {children}
    </LotteryModalsContext.Provider>
  );
}

export function useLotteryModalsContext() {
  const context = useContext(LotteryModalsContext);
  if (!context) {
    throw new Error(
      'useLotteryModalsContext must be used within LotteryModalsProvider',
    );
  }
  return context;
}
