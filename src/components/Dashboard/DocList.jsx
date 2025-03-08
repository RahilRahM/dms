import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Paper, Typography, List, ListItemButton, ListItemText, TextField, 
  InputAdornment, Box, IconButton, Select, MenuItem, Pagination,
  FormControl, InputLabel
} from '@mui/material';
import { Search as SearchIcon, Star, StarBorder } from '@mui/icons-material';
import { toggleFavorite } from '../../features/documents/documentsSlice';

function DocList({ documents, selectedDocument, onDocumentSelect, searchQuery, onSearchChange }) {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.documents.favorites);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
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
    </Paper>
  );
}

export default DocList;
