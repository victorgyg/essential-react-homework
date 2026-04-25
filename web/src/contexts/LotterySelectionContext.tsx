import { createContext, useContext, useState, type ReactNode } from 'react';

interface LotterySelectionContextValue {
  selectedLotteryIds: string[];
  toggleLottery: (id: string) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
}

const LotterySelectionContext = createContext<
  LotterySelectionContextValue | undefined
>(undefined);

export function LotterySelectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedLotteryIds, setSelectedLotteryIds] = useState<string[]>([]);

  const toggleLottery = (id: string) => {
    setSelectedLotteryIds((prev) =>
      prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id],
    );
  };

  const clearSelection = () => {
    setSelectedLotteryIds([]);
  };

  const isSelected = (id: string) => {
    return selectedLotteryIds.includes(id);
  };

  return (
    <LotterySelectionContext.Provider
      value={{
        selectedLotteryIds,
        toggleLottery,
        clearSelection,
        isSelected,
      }}
    >
      {children}
    </LotterySelectionContext.Provider>
  );
}

export function useLotterySelectionContext() {
  const context = useContext(LotterySelectionContext);
  if (!context) {
    throw new Error(
      'useLotterySelectionContext must be used within LotterySelectionProvider',
    );
  }
  return context;
}
