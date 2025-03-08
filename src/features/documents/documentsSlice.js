import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: [],
  folders: [],
  currentFolder: null,
  favorites: []
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addDocument: (state, action) => {
      state.documents.push(action.payload);
    },
    addFolder: (state, action) => {
      state.folders.push(action.payload);
    },
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
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
    }
  }
});

export const { 
  addDocument, 
  addFolder, 
  setCurrentFolder, 
  toggleFavorite,
  uploadFiles,
  updateFileMetadata 
} = documentsSlice.actions;
export default documentsSlice.reducer;
