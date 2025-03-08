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
    }
  }
});

export const { addDocument, addFolder, setCurrentFolder, toggleFavorite } = documentsSlice.actions;
export default documentsSlice.reducer;
