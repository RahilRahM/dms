import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: [
    { 
      id: 1, 
      name: 'Sample Document.pdf',
      type: 'PDF',
      size: 1024 * 1024,
      lastModified: new Date().getTime(),
      folderId: null 
    }
  ],
  folders: [
    { id: 1, name: 'Documents', parent: null },
    { id: 2, name: 'Projects', parent: null },
    { id: 3, name: 'Personal', parent: null }
  ],
  currentFolder: null,
  favorites: []
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addDocument: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.documents.push(...action.payload.map(doc => ({
          ...doc,
          folderId: state.currentFolder?.id || null
        })));
      } else {
        state.documents.push({
          ...action.payload,
          folderId: state.currentFolder?.id || null
        });
      }
    },
    addFolder: (state, action) => {
      state.folders.push(action.payload);
    },
    setCurrentFolder: (state, action) => {
      // Ensure we always have a valid action payload
      const folder = action.payload || {
        id: null,
        name: 'Root',
        parent: null,
        type: 'folder'
      };

      state.currentFolder = {
        id: folder.id,
        name: folder.name,
        parent: folder.parent,
        type: 'folder'
      };
    },
    toggleFavorite: (state, action) => {
      const docId = action.payload;
      const index = state.favorites.indexOf(docId);
      if (index === -1) {
        state.favorites.push(docId);
      } else {
        state.favorites.splice(index, 1);
      }
    },
    uploadFiles: (state, action) => {
      state.documents.push(...action.payload);
    },
    updateFileMetadata: (state, action) => {
      const { id, metadata } = action.payload;
      const file = state.documents.find(doc => doc.id === id);
      if (file) {
        file.metadata = { ...file.metadata, ...metadata };
      }
    },
    deleteFolder: (state, action) => {
      state.folders = state.folders.filter(folder => folder.id !== action.payload);
    },
    deleteFile: (state, action) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload);
    },
    deleteItem: (state, action) => {
      const { id, type } = action.payload;
      if (type === 'folder') {
        state.folders = state.folders.filter(folder => folder.id !== id);
      } else {
        state.documents = state.documents.filter(doc => doc.id !== id);
      }
    }
  }
});

export const { 
  addDocument, 
  addFolder, 
  setCurrentFolder, 
  toggleFavorite,
  uploadFiles,
  updateFileMetadata,
  deleteItem 
} = documentsSlice.actions;
export default documentsSlice.reducer;
