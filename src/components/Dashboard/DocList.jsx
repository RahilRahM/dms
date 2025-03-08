import { Paper, Typography, List, ListItemButton, ListItemText, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function DocList({ documents, selectedDocument, onDocumentSelect, searchQuery, onSearchChange }) {
  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  return (
    <Paper elevation={3} className="document-list">
      <Typography variant="h6" className="document-list-header">
        Documents
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search documents..."
        value={searchQuery}
        onChange={onSearchChange}
        sx={{ px: 2, py: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <List className="document-list-content">
        {filteredDocs.map(doc => (
          <ListItemButton
            key={doc.id}
            selected={selectedDocument?.id === doc.id}
            onClick={() => onDocumentSelect(doc)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#e3f2fd',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                }
              }
            }}
          >
            <ListItemText 
              primary={doc.title}
              secondary={`Type: ${doc.type}`}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}

export default DocList;
