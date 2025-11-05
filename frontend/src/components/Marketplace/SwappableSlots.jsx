import { useState, useEffect } from 'react';
import { swapsAPI, eventsAPI } from '../../services/api';

const SwappableSlots = () => {
  const [slots, setSlots] = useState([]);
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slotsRes, mySlotsRes] = await Promise.all([
        swapsAPI.getSwappableSlots(),
        eventsAPI.getAll()
      ]);
      setSlots(slotsRes.data);
      setMySwappableSlots(mySlotsRes.data.filter(slot => slot.status === 'SWAPPABLE'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (slot) => {
    if (mySwappableSlots.length === 0) {
      alert('You need at least one swappable slot to request a swap');
      return;
    }
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleConfirmSwap = async (mySlotId) => {
    try {
      await swapsAPI.createSwapRequest({
        mySlotId,
        theirSlotId: selectedSlot._id
      });
      alert('Swap request sent successfully!');
      setShowModal(false);
      setSelectedSlot(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create swap request');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2 style={{ 
        color: 'white',
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '30px',
        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        🛒 Marketplace - Available Slots
      </h2>
      {slots.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>No slots available</h3>
          <p style={{ color: '#999' }}>Check back later for swappable slots!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {slots.map((slot) => (
            <div key={slot._id} className="card">
              <h3 style={{ color: '#333', fontSize: '20px', marginBottom: '15px' }}>
                {slot.title}
              </h3>
              <div style={{ marginBottom: '15px', color: '#666' }}>
                <p style={{ marginBottom: '8px' }}>👤 <strong>Owner:</strong> {slot.userId.name}</p>
                <p style={{ marginBottom: '8px', fontSize: '12px', color: '#999' }}>📧 {slot.userId.email}</p>
                <p style={{ marginBottom: '8px' }}>🕐 <strong>Start:</strong> {formatDate(slot.startTime)}</p>
                <p>🕑 <strong>End:</strong> {formatDate(slot.endTime)}</p>
              </div>
              <button onClick={() => handleRequestSwap(slot)} style={{ width: '100%' }}>
                💫 Request Swap
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }} onClick={() => setShowModal(false)}>
          <div className="card" style={{
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>💫 Select Your Slot to Offer</h3>
            <div style={{ 
              padding: '15px', 
              background: '#f5f5f5', 
              borderRadius: '8px', 
              marginBottom: '20px' 
            }}>
              <p style={{ marginBottom: '5px' }}><strong>📝 Requesting:</strong> {selectedSlot?.title}</p>
              <p style={{ color: '#666' }}><strong>🕐 Time:</strong> {selectedSlot && formatDate(selectedSlot.startTime)}</p>
            </div>
            <div style={{ marginTop: '20px' }}>
              {mySwappableSlots.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>📭</div>
                  <p style={{ color: '#666' }}>You have no swappable slots.</p>
                  <p style={{ color: '#999', fontSize: '14px', marginTop: '5px' }}>Go to your calendar to create one!</p>
                </div>
              ) : (
                <div>
                  <p style={{ marginBottom: '15px', fontWeight: '600', color: '#333' }}>Your Swappable Slots:</p>
                  {mySwappableSlots.map((slot) => (
                    <div key={slot._id} className="card" style={{ 
                      marginBottom: '15px',
                      padding: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
                    }}>
                      <p style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>{slot.title}</p>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                        {formatDate(slot.startTime)} - {formatDate(slot.endTime)}
                      </p>
                      <button onClick={() => handleConfirmSwap(slot._id)} style={{ width: '100%' }}>
                        ✅ Offer This Slot
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setShowModal(false)} className="secondary" style={{ width: '100%', marginTop: '20px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwappableSlots;

