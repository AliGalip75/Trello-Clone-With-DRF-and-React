import { create } from 'zustand';

interface UIState {
  // Modal açık mı?
  isCardModalOpen: boolean;
  isCreateBoardModalOpen: boolean;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Hangi kartın detayı açık? (ID'sini tutuyoruz)
  activeCardId: string | null;

  // Aksiyonlar
  openCardModal: (cardId: string) => void;
  closeCardModal: () => void;
  toggleCreateBoardModal: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCardModalOpen: false,
  isCreateBoardModalOpen: false,
  activeCardId: null,
  isSidebarOpen: true,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openCardModal: (cardId) => set({ isCardModalOpen: true, activeCardId: cardId }),
  closeCardModal: () => set({ isCardModalOpen: false, activeCardId: null }),
  toggleCreateBoardModal: (isOpen) => set({ isCreateBoardModalOpen: isOpen }),
}));
