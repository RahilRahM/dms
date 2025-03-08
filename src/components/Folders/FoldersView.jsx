import { useState } from 'react';
import { 
  Paper, Typography, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Button, Dialog, TextField, Breadcrumbs, Link,
  Box, Menu, MenuItem, Tooltip, Checkbox, ListItemSecondaryAction,
  DialogActions, DialogContent, DialogContentText
} from '@mui/material';
import { 
  Folder as FolderIcon, 
  CreateNewFolder as CreateNewFolderIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  Description as FileIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as FileCopyIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addFolder, addDocument, setCurrentFolder, deleteItem } from '../../features/documents/documentsSlice';

function FoldersView() {
  const dispatch = useDispatch();
  const { folders, documents, currentFolder: reduxCurrentFolder } = useSelector(state => state.documents);
  
  const [currentFolder, setCurrentFolder] = useState(null);
  const [path, setPath] = useState([{ id: null, name: 'Root' }]);
  const [newFolderDialog, setNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [files, setFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [contextMenu, setContextMenu] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null);  // Add this state

  const handleFolderClick = (folder) => {
    try {
      const folderData = folder ? {
        id: folder.id,
        name: folder.name,
        parent: folder.parent,
        type: 'folder',
        itemType: 'folder'  // Add this to ensure consistency
      } : {
        id: null,
        name: 'Root',
        parent: null,
        type: 'folder',
        itemType: 'folder'
      };

      // Update Redux state
      dispatch(setCurrentFolder(folderData));
      
      // Update local state
      setCurrentFolder(folderData);

      // Update path
      if (!folder || folder.id === null) {
        setPath([{ id: null, name: 'Root' }]);
      } else {
        setPath(prev => [...prev, folderData]);
      }

    } catch (error) {
      console.error('Error in handleFolderClick:', error);
    }
  };

  const handleBreadcrumbClick = (item, index) => {
    try {
      const newPath = path.slice(0, index + 1);
      setPath(newPath);
      const folderToSet = newPath[newPath.length - 1];
      handleFolderClick(folderToSet);
    } catch (error) {
      console.error('Error in handleBreadcrumbClick:', error);
    }
  };

  const handleBackClick = () => {
    const newPath = [...path];
    const previousFolder = newPath[newPath.length - 2] || null;
    newPath.pop();
    setPath(newPath);
    handleFolderClick(previousFolder);
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
      folderId: currentFolder?.id || null,
      metadata: {
        createdAt: new Date().toISOString(),
        type: file.type,
        size: file.size
      }
    }));
    dispatch(addDocument(uploadedFiles));
    setAnchorEl(null);
  };

  const handleRightClick = (event, item) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      item
    });
  };

  const handleDelete = (item) => {
    dispatch(deleteItem({
      id: item.id,
      type: item.itemType || item.type
    }));
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getCurrentFolders = () => 
    folders.filter(f => f.parent === (currentFolder?.id ?? null));

  const getCurrentDocuments = () =>
    documents.filter(doc => doc.folderId === (currentFolder?.id ?? null));

  const sortedItems = [
    ...getCurrentFolders().map(f => ({ ...f, itemType: 'folder' })),
    ...getCurrentDocuments().map(d => ({ ...d, itemType: 'file' }))
  ].sort((a, b) => {
    if (a.itemType !== b.itemType) {
      return a.itemType === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const handleFileClick = (file) => {
    // Handle file click
    console.log('File clicked:', file);
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
                key={item.id ?? 'root'}
                component="button"
                onClick={() => handleBreadcrumbClick(item, index)}
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

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          size="small"
          startIcon={<SortIcon />}
          onClick={(e) => setSortMenuAnchorEl(e.currentTarget)}  // Changed this
        >
          Sort By {sortBy === 'name' ? '(Name)' : '(Date)'}
        </Button>
        {selectedItems.length > 0 && (
          <>
            <Button
              size="small"
              startIcon={<FileCopyIcon />}
              onClick={() => handleCopySelected()}
            >
              Copy {selectedItems.length} items
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => {
                setItemToDelete({ type: 'multiple', ids: selectedItems });
                setDeleteConfirmOpen(true);
              }}
            >
              Delete {selectedItems.length} items
            </Button>
          </>
        )}
      </Box>

      {/* Add new Sort Menu */}
      <Menu
        anchorEl={sortMenuAnchorEl}
        open={Boolean(sortMenuAnchorEl)}
        onClose={() => setSortMenuAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          handleSort('name');
          setSortMenuAnchorEl(null);
        }}>
          <ListItemText>Sort by Name</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleSort('date');
          setSortMenuAnchorEl(null);
        }}>
          <ListItemText>Sort by Date</ListItemText>
        </MenuItem>
      </Menu>

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
        {sortedItems.map((item) => (
          <ListItem
            key={`${item.itemType}-${item.id}`}
            onClick={() => item.itemType === 'folder' ? handleFolderClick(item) : handleFileClick(item)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <Checkbox
              edge="start"
              checked={selectedItems.includes(item.id)}
              onChange={(e) => {
                e.stopPropagation();
                setSelectedItems(prev =>
                  prev.includes(item.id)
                    ? prev.filter(id => id !== item.id)
                    : [...prev, item.id]
                );
              }}
            />
            <ListItemIcon>
              {item.itemType === 'folder' ? <FolderIcon color="primary" /> : <FileIcon />}
            </ListItemIcon>
            <ListItemText 
              primary={item.name}
              secondary={item.itemType === 'file' && (
                `${(item.size / 1024).toFixed(2)} KB • Last modified: ${new Date(item.lastModified).toLocaleDateString()}`
              )}
            />
            <ListItemSecondaryAction>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  setItemToDelete(item);
                  setDeleteConfirmOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
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

      <Menu
        open={Boolean(contextMenu)}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => {/* Handle rename */}}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          setItemToDelete(contextMenu.item);
          setDeleteConfirmOpen(true);
          setContextMenu(null);
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogContent>
          <DialogContentText>
            {itemToDelete?.type === 'multiple'
              ? `Are you sure you want to delete ${selectedItems.length} items?`
              : `Are you sure you want to delete "${itemToDelete?.name}"?`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={() => handleDelete(itemToDelete)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default FoldersView;
