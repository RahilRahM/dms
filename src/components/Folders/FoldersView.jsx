import { useState } from 'react';
import { 
  Paper, Typography, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Button, Dialog, TextField, Breadcrumbs, Link,
  Box, Menu, MenuItem, Tooltip 
} from '@mui/material';
import { 
  Folder as FolderIcon, 
  CreateNewFolder as CreateNewFolderIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  Description as FileIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addFolder, addDocument, setCurrentFolder } from '../../features/documents/documentsSlice';

function FoldersView() {
  const dispatch = useDispatch();
  const { folders, currentFolder: reduxCurrentFolder } = useSelector(state => state.documents);
  
  const [currentFolder, setCurrentFolder] = useState(null);
  const [path, setPath] = useState([{ id: null, name: 'Root' }]);
  const [newFolderDialog, setNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [files, setFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const getCurrentFolders = () => 
    folders.filter(f => f.parent === currentFolder?.id);

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setPath([...path, folder]);
  };

  const handleBackClick = () => {
    const newPath = [...path];
    newPath.pop();
    setPath(newPath);
    setCurrentFolder(newPath[newPath.length - 1]);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now(),
        name: newFolderName,
        parent: currentFolder?.id || null
      };
      dispatch(addFolder(newFolder));
      setNewFolderName('');
      setNewFolderDialog(false);
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      parent: currentFolder?.id || null,
      metadata: {
        createdAt: new Date().toISOString(),
        type: file.type,
        size: file.size
      }
    }));
    dispatch(addDocument(uploadedFiles));
    setAnchorEl(null);
  };

  return (
    <Paper sx={{ width: '100%', p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBackClick} disabled={currentFolder === null}>
            <ArrowBackIcon />
          </IconButton>
          <Breadcrumbs sx={{ ml: 2 }}>
            {path.map((item, index) => (
              <Link
                key={item.id}
                component="button"
                onClick={() => {
                  setPath(path.slice(0, index + 1));
                  setCurrentFolder(item);
                }}
                sx={{ cursor: 'pointer' }}
              >
                {item.name}
              </Link>
            ))}
          </Breadcrumbs>
        </div>
        
        <div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ mr: 1 }}
          >
            New
          </Button>
        </div>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          setNewFolderDialog(true);
          setAnchorEl(null);
        }}>
          <ListItemIcon>
            <CreateNewFolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>New Folder</ListItemText>
        </MenuItem>
        <MenuItem component="label">
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload File</ListItemText>
          <input
            type="file"
            hidden
            multiple
            onChange={handleFileUpload}
          />
        </MenuItem>
      </Menu>

      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {getCurrentFolders().map((folder) => (
          <ListItem
            key={folder.id}
            button
            onClick={() => handleFolderClick(folder)}
          >
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary={folder.name} />
          </ListItem>
        ))}
        {files
          .filter(file => file.parent === currentFolder?.id)
          .map(file => (
            <ListItem key={file.id}>
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText 
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(2)} KB • ${new Date(file.lastModified).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
      </List>

      <Dialog open={newFolderDialog} onClose={() => setNewFolderDialog(false)}>
        <Typography variant="h6" sx={{ p: 2 }}>Create New Folder</Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Folder Name"
          fullWidth
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          sx={{ px: 2, pb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button onClick={() => setNewFolderDialog(false)} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleCreateFolder} variant="contained">
            Create
          </Button>
        </Box>
      </Dialog>
    </Paper>
  );
}

export default FoldersView;
