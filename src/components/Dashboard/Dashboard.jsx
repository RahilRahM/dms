import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { sampleDocuments } from '../../data/sampleDocuments';
import DocumentView from './DocumentView.jsx';
import DocList from './DocList.jsx';
import '../../styles/Dashboard.css';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

function Dashboard() {
  const [documents] = useState(sampleDocuments);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
    setEditMode(false);
  };

  const handleUpdateDocument = (updatedDoc) => {
    const newDocs = documents.map(doc => 
      doc.id === updatedDoc.id ? updatedDoc : doc
    );
    setSelectedDocument(updatedDoc);
    setEditMode(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="dashboard-container">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Document Management System
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box className="dashboard-content">
        <DocList 
          documents={documents}
          selectedDocument={selectedDocument}
          onDocumentSelect={handleDocumentClick}
        />
        <Box className="document-viewer">
          {selectedDocument ? (
            <DocumentView
              document={selectedDocument}
              editMode={editMode}
              onEdit={() => setEditMode(true)}
              onSave={handleUpdateDocument}
              onCancel={() => setEditMode(false)}
            />
          ) : (
            <Typography 
              variant="body1" 
              color="textSecondary" 
              sx={{ textAlign: 'center', mt: 4 }}
            >
              Select a document to view details
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Dashboard;