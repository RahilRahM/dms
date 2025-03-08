import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Paper, Typography, List, ListItemButton, ListItemText, TextField, 
  InputAdornment, Box, IconButton, Select, MenuItem, Pagination,
  FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { Search as SearchIcon, Star, StarBorder, Delete as DeleteIcon } from '@mui/icons-material';
import { toggleFavorite } from '../../features/documents/documentsSlice';

function DocumentForm({ open, document, onClose, onSave }) {
  const [formData, setFormData] = useState(document || {
    title: '',
    description: '',
    type: 'PDF',
    tags: []
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{document ? 'Edit Document' : 'Create Document'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            >
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="DOC">DOC</MenuItem>
              <MenuItem value="TXT">TXT</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(formData)}>
          {document ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DocList({ documents, selectedDocument, onDocumentSelect, searchQuery, onSearchChange }) {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.documents.favorites);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const itemsPerPage = 10;

  const filteredDocs = documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery?.toLowerCase() || '');
      const matchesType = typeFilter ? doc.type === typeFilter : true;
      const matchesFavorites = showFavorites ? favorites.includes(doc.id) : true;
      return matchesSearch && matchesType && matchesFavorites;
    });

  const paginatedDocs = filteredDocs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleFavoriteToggle = (docId, event) => {
    event.stopPropagation();
    dispatch(toggleFavorite(docId));
  };

  const handleDelete = (docId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document?')) {
      // Remove from documents list
      const updatedDocs = documents.filter(doc => doc.id !== docId);
      // Remove from favorites if it exists
      dispatch(toggleFavorite(docId));
    }
  };

  const handleSaveDocument = (formData) => {
    // Save document logic here
    setFormOpen(false);
    setSelectedDoc(null);
  };

  return (
    <Paper elevation={3} className="document-list">
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Documents</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="DOC">DOC</MenuItem>
              <MenuItem value="TXT">TXT</MenuItem>
            </Select>
          </FormControl>
          <IconButton 
            onClick={() => setShowFavorites(!showFavorites)}
            color={showFavorites ? "primary" : "default"}
          >
            {showFavorites ? <Star /> : <StarBorder />}
          </IconButton>
        </Box>
      </Box>

      <List sx={{ overflow: 'auto', flex: 1 }}>
        {paginatedDocs.map(doc => (
          <ListItemButton
            key={doc.id}
            selected={selectedDocument?.id === doc.id}
            onClick={() => onDocumentSelect(doc)}
          >
            <ListItemText 
              primary={doc.title}
              secondary={`Type: ${doc.type}`}
            />
            <IconButton 
              onClick={(e) => handleFavoriteToggle(doc.id, e)}
              color={favorites.includes(doc.id) ? "primary" : "default"}
            >
              {favorites.includes(doc.id) ? <Star /> : <StarBorder />}
            </IconButton>
            <IconButton 
              onClick={(e) => handleDelete(doc.id, e)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Pagination
          count={Math.ceil(filteredDocs.length / itemsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          size="small"
        />
      </Box>

      <DocumentForm
        open={formOpen}
        document={selectedDoc}
        onClose={() => {
          setFormOpen(false);
          setSelectedDoc(null);
        }}
        onSave={handleSaveDocument}
      />
    </Paper>
  );
}

export default DocList;
