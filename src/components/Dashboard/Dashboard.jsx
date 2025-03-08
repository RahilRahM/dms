import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Tabs, Tab, Button, TextField, InputAdornment } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import { sampleDocuments } from '../../data/sampleDocuments';
import DocumentView from './DocumentView.jsx';
import DocList from './DocList.jsx';
import '../../styles/Dashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout, hasPermission } from '../../features/auth/authSlice';
import UserManagement from '../Users/UserManagement';

function Dashboard() {
  const [documents] = useState(sampleDocuments);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const isAdmin = user?.role === 'admin';
  const auth = useSelector(state => state.auth);
  const canManageUsers = useSelector(state => hasPermission(state, 'manage_users'));
  const canWrite = useSelector(state => hasPermission(state, 'write'));

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
          {isAdmin && (  // Changed from canManageUsers to isAdmin
            <IconButton 
              color="inherit" 
              onClick={() => setActiveTab('users')}
              sx={{ mr: 2 }}  // Added margin right
            >
              <PersonIcon />
            </IconButton>
          )}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ px: 2 }}>
          <Tab value="documents" label="Documents" />
          {canWrite && <Tab value="folders" label="Folders" />}
          {isAdmin && <Tab value="users" label="Users" />}  // Changed from canManageUsers to isAdmin
        </Tabs>
      </AppBar>
      
      <Box className="dashboard-content">
        {activeTab === 'documents' && (
          <>
            <DocList 
              documents={documents}
              selectedDocument={selectedDocument}
              onDocumentSelect={handleDocumentClick}
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
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
          </>
        )}
        {activeTab === 'folders' && (
          <FoldersView />
        )}
        {activeTab === 'users' && (
          <UserManagement />
        )}
      </Box>
    </div>
  );
}

export default Dashboard;