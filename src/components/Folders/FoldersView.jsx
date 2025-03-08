import { useState } from 'react';
import { 
  Paper, Typography, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Button, Dialog, TextField, Breadcrumbs, Link 
} from '@mui/material';
import { 
  Folder as FolderIcon, 
  CreateNewFolder as CreateNewFolderIcon,
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';

function FoldersView() {
  const [folders, setFolders] = useState([
    { id: 1, name: 'Documents', parent: null },
    { id: 2, name: 'Projects', parent: null },
    { id: 3, name: 'Personal', parent: null }
  ]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [path, setPath] = useState([{ id: null, name: 'Root' }]);

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

  return (
    <Paper sx={{ width: '100%', p: 2 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <IconButton 
          onClick={handleBackClick} 
          disabled={currentFolder === null}
        >
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

      <List>
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
      </List>
    </Paper>
  );
}

export default FoldersView;
