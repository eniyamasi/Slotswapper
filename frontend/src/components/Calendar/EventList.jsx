import { useState, useEffect } from 'react';
import { eventsAPI } from '../../services/api';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    status: 'BUSY'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await eventsAPI.create(formData);
      setFormData({ title: '', startTime: '', endTime: '', status: 'BUSY' });
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create event');
    }
  };

  const handleToggleSwappable = async (event) => {
    try {
      const newStatus = event.status === 'BUSY' ? 'SWAPPABLE' : 'BUSY';
      await eventsAPI.update(event._id, { status: newStatus });
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update event');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsAPI.delete(id);
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete event');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="loading">Loading...</div>;

  const getStatusBadge = (status) => {
    const badges = {
      BUSY: { text: '🔴 Busy', color: '#f44336', bg: '#ffebee' },
      SWAPPABLE: { text: '🟢 Swappable', color: '#4caf50', bg: '#e8f5e9' },
      SWAP_PENDING: { text: '🟡 Swap Pending', color: '#ff9800', bg: '#fff3e0' }
    };
    const badge = badges[status] || badges.BUSY;
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: badge.color,
        background: badge.bg
      }}>
        {badge.text}
      </span>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ 
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          📅 My Calendar
        </h2>
        <button onClick={() => setShowForm(!showForm)} className={showForm ? 'secondary' : ''}>
          {showForm ? '❌ Cancel' : '➕ New Event'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>✨ Create New Event</h3>
          <form onSubmit={handleCreateEvent}>
            <div style={{ marginBottom: '20px' }}>
              <label>📝 Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Team Meeting, Focus Block"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>🕐 Start Time</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>🕑 End Time</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
            <button type="submit">Create Event</button>
          </form>
        </div>
      )}

      <div>
        {events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📆</div>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No events yet</h3>
            <p style={{ color: '#999' }}>Create your first event to get started!</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <h3 style={{ color: '#333', fontSize: '20px', marginBottom: '10px' }}>
                  {event.title}
                </h3>
                {getStatusBadge(event.status)}
              </div>
              <div style={{ marginBottom: '15px', color: '#666' }}>
                <p style={{ marginBottom: '8px' }}>🕐 <strong>Start:</strong> {formatDate(event.startTime)}</p>
                <p>🕑 <strong>End:</strong> {formatDate(event.endTime)}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {event.status === 'BUSY' && (
                  <button onClick={() => handleToggleSwappable(event)} className="success">
                    ✅ Make Swappable
                  </button>
                )}
                {event.status === 'SWAPPABLE' && (
                  <button onClick={() => handleToggleSwappable(event)} className="secondary">
                    🔒 Make Busy
                  </button>
                )}
                <button onClick={() => handleDelete(event._id)} className="danger">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;

