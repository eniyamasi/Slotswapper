import { useState, useEffect } from 'react';
import { swapsAPI } from '../../services/api';

const SwapRequests = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [incomingRes, outgoingRes] = await Promise.all([
        swapsAPI.getIncomingRequests(),
        swapsAPI.getOutgoingRequests()
      ]);
      setIncoming(incomingRes.data);
      setOutgoing(outgoingRes.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId, accepted) => {
    try {
      await swapsAPI.respondToSwap(requestId, accepted);
      alert(accepted ? 'Swap accepted!' : 'Swap rejected');
      fetchRequests();
      // Refresh the page to update calendar
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to process response');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="loading">Loading...</div>;

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { text: '🟡 Pending', color: '#ff9800', bg: '#fff3e0' },
      ACCEPTED: { text: '✅ Accepted', color: '#4caf50', bg: '#e8f5e9' },
      REJECTED: { text: '❌ Rejected', color: '#f44336', bg: '#ffebee' }
    };
    const badge = badges[status] || badges.PENDING;
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
      <h2 style={{ 
        color: 'white',
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '30px',
        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        🔔 Swap Requests
      </h2>

      <div style={{ marginBottom: '50px' }}>
        <h3 style={{ 
          color: 'white', 
          fontSize: '24px', 
          marginBottom: '20px',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          📥 Incoming Requests
        </h3>
        {incoming.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📭</div>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No incoming requests</h3>
            <p style={{ color: '#999' }}>You'll see swap requests here when others want to swap with you!</p>
          </div>
        ) : (
          incoming.map((request) => (
            <div key={request._id} className="card" style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '600', color: '#333' }}>
                  👤 From: {request.requesterId.name}
                </p>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '15px' }}>📧 {request.requesterId.email}</p>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{ 
                  padding: '15px', 
                  background: '#f0f7ff', 
                  borderRadius: '8px',
                  border: '2px solid #667eea'
                }}>
                  <p style={{ fontWeight: '600', marginBottom: '8px', color: '#667eea' }}>They're Offering:</p>
                  <p style={{ marginBottom: '5px', color: '#333' }}>{request.requesterSlotId.title}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    🕐 {formatDate(request.requesterSlotId.startTime)}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    🕑 {formatDate(request.requesterSlotId.endTime)}
                  </p>
                </div>
                <div style={{ 
                  padding: '15px', 
                  background: '#fff3e0', 
                  borderRadius: '8px',
                  border: '2px solid #ff9800'
                }}>
                  <p style={{ fontWeight: '600', marginBottom: '8px', color: '#ff9800' }}>For Your Slot:</p>
                  <p style={{ marginBottom: '5px', color: '#333' }}>{request.responderSlotId.title}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    🕐 {formatDate(request.responderSlotId.startTime)}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    🕑 {formatDate(request.responderSlotId.endTime)}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleResponse(request._id, true)} className="success" style={{ flex: 1 }}>
                  ✅ Accept
                </button>
                <button onClick={() => handleResponse(request._id, false)} className="danger" style={{ flex: 1 }}>
                  ❌ Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div>
        <h3 style={{ 
          color: 'white', 
          fontSize: '24px', 
          marginBottom: '20px',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          📤 Outgoing Requests
        </h3>
        {outgoing.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📤</div>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No outgoing requests</h3>
            <p style={{ color: '#999' }}>Your swap requests will appear here!</p>
          </div>
        ) : (
          outgoing.map((request) => (
            <div key={request._id} className="card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <p style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '600', color: '#333' }}>
                    👤 To: {request.responderId.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#999' }}>📧 {request.responderId.email}</p>
                </div>
                {getStatusBadge(request.status)}
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '15px'
              }}>
                <div style={{ 
                  padding: '15px', 
                  background: '#f0f7ff', 
                  borderRadius: '8px',
                  border: '2px solid #667eea'
                }}>
                  <p style={{ fontWeight: '600', marginBottom: '8px', color: '#667eea' }}>You're Offering:</p>
                  <p style={{ marginBottom: '5px', color: '#333' }}>{request.requesterSlotId.title}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    🕐 {formatDate(request.requesterSlotId.startTime)}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    🕑 {formatDate(request.requesterSlotId.endTime)}
                  </p>
                </div>
                <div style={{ 
                  padding: '15px', 
                  background: '#fff3e0', 
                  borderRadius: '8px',
                  border: '2px solid #ff9800'
                }}>
                  <p style={{ fontWeight: '600', marginBottom: '8px', color: '#ff9800' }}>Requesting:</p>
                  <p style={{ marginBottom: '5px', color: '#333' }}>{request.responderSlotId.title}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    🕐 {formatDate(request.responderSlotId.startTime)}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    🕑 {formatDate(request.responderSlotId.endTime)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SwapRequests;

