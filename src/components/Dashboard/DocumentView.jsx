import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { hasPermission } from '../../features/auth/authSlice';
import '../../styles/DocumentView.css';

function DocumentView({ document, editMode, onEdit, onSave, onCancel }) {
  const canWrite = useSelector(state => hasPermission(state, 'write'));
  const [editedDoc, setEditedDoc] = useState(document);

  useEffect(() => {
    setEditedDoc(document);
  }, [document]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDoc(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedDoc);
  };

  if (!document) return null;

  return (
    <div className="document-view">
      <h2>Document Details</h2>
      
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              name="title"
              value={editedDoc.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={editedDoc.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Tags (comma-separated):</label>
            <input
              name="tags"
              value={editedDoc.tags.join(', ')}
              onChange={(e) => setEditedDoc(prev => ({
                ...prev,
                tags: e.target.value.split(',').map(tag => tag.trim())
              }))}
            />
          </div>
          <div className="button-group">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="document-info">
          <p><strong>Title:</strong> {document.title}</p>
          <p><strong>Type:</strong> {document.type}</p>
          <p><strong>Created:</strong> {document.createdDate}</p>
          <p><strong>Last Modified:</strong> {document.lastModified}</p>
          <p><strong>Description:</strong> {document.description}</p>
          <p><strong>Tags:</strong> {document.tags.join(', ')}</p>
          {canWrite && <button onClick={onEdit}>Edit</button>}
        </div> 
      )}
    </div>
  );
}

export default DocumentView;
