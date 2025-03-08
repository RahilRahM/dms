import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

function DocList({ documents, selectedDocument, onDocumentSelect }) {
  return (
    <Paper elevation={3} className="document-list">
      <Typography variant="h6" className="document-list-header">
        Documents
      </Typography>
      <List className="document-list-content">
        {documents.map(doc => (
          <ListItem 
            key={doc.id}
            sx={{
              cursor: 'pointer',
              '&.Mui-selected': {
                backgroundColor: '#e3f2fd',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                }
              }
            }}
            selected={selectedDocument?.id === doc.id}
            onClick={() => onDocumentSelect(doc)}
          >
            <ListItemText 
              primary={doc.title}
              secondary={`Type: ${doc.type}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default DocList;
