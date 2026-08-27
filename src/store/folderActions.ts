import { generateId } from '@/utils';

export const folderActions = (set: any, get: any) => ({
  addFolder: (name: string, color?: string) => {
    set((state: any) => ({
      folders: [...state.folders, { id: generateId(), name, color }],
    }));
  },

  updateFolder: (id: string, name: string, color?: string) => {
    set((state: any) => ({
      folders: state.folders.map((f: any) => f.id === id ? { ...f, name, color } : f),
    }));
  },

  deleteFolder: (id: string) => {
    set((state: any) => ({
      folders: state.folders.filter((f: any) => f.id !== id),
      routines: state.routines.map((r: any) => r.folderId === id ? { ...r, folderId: null } : r),
    }));
  },
});
