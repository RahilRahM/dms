import { useState, useEffect } from 'react';
import { 
  Paper, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, TextField, Select, MenuItem,
  IconButton, Chip, Box, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ArrowUpward, ArrowDownward } from '@mui/icons-material';

function UserForm({ open, user, onClose, onSave }) {
  const [formData, setFormData] = useState(user || {
    username: '',
    email: '',
    role: 'normal',
    status: 'Active',
    position: ''
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="normal">Normal User</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(formData)}>
          {user ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10
  });

  const statusOptions = [
    'Active',
    'Inactive',
    'On Leave',
    'Probation',
    'Contract'
  ];

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`https://lab4-exo1.vercel.app/api/users?page=${page}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        setUsers(data.data);
        setPagination({
          currentPage: data.pagination.current_page,
          totalPages: data.pagination.total_pages,
          perPage: data.pagination.per_page
        });
        setError(null);
      } else {
        setError('Error loading users');
      }
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (newPage) => {
    fetchUsers(newPage);
  };

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const perPage = 5;

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleSaveUser = (userData) => {
    try {
      if (selectedUser) {
        // Update existing user
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === selectedUser.id 
              ? { ...user, ...userData }
              : user
          )
        );
      } else {
        // Create new user
        const newUser = {
          ...userData,
          id: Date.now(),
          employee_id: Math.floor(100000 + Math.random() * 900000),
          hire_date: new Date().toISOString().split('T')[0]
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
      }
      setFormOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const displayUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? user.status === statusFilter : true)
    )
    .sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const renderTableBody = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">Loading...</TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center" color="error">{error}</TableCell>
        </TableRow>
      );
    }

    if (displayUsers.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">No users found</TableCell>
        </TableRow>
      );
    }

    return displayUsers.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.position}</TableCell>
        <TableCell>
          <Chip 
            label={user.status} 
            color={
              user.status === 'Active' ? 'success' : 
              user.status === 'Inactive' ? 'error' :
              user.status === 'On Leave' ? 'warning' :
              user.status === 'Probation' ? 'secondary' :
              'default'
            }
          />
        </TableCell>
        <TableCell>{user.department}</TableCell>
        <TableCell>
          <IconButton onClick={() => {
            setSelectedUser(user);
            setFormOpen(true);
          }}>
            <EditIcon />
          </IconButton>
          <IconButton 
            onClick={() => handleDeleteUser(user.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Paper sx={{ p: 3, width: '100%', height: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">User Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          Add User
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 200 }}
        />
        <FormControl size="small" sx={{ width: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All Status</MenuItem>
            {statusOptions.map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={handleSort} sx={{ cursor: 'pointer' }}>
                Name {sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableBody()}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button 
          disabled={pagination.currentPage <= 1}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
        >
          Previous
        </Button>
        <Typography sx={{ lineHeight: '40px' }}>
          Page {pagination.currentPage} of {pagination.totalPages}
        </Typography>
        <Button 
          disabled={pagination.currentPage >= pagination.totalPages}
          onClick={() => handlePageChange(pagination.currentPage + 1)}
        >
          Next
        </Button>
      </Box>

      <UserForm
        open={formOpen}
        user={selectedUser}
        onClose={() => {
          setFormOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
      />
    </Paper>
  );
}

export default UserManagement;
