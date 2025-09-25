import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

let socket = null;

export const initializeSocket = () => {
  if (socket) return socket;

  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  socket = io('http://localhost:5001', {
    auth: {
      token: token
    },
    transports: ['websocket', 'polling']
  });

  // Connection events
  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    toast.error('Connection failed');
  });

  // Auction events
  socket.on('new_bid', (data) => {
    // Handle new bid notification
    if (window.location.pathname.includes('/auctions/')) {
      // Update bid list if on auction page
      window.dispatchEvent(new CustomEvent('new_bid', { detail: data }));
    } else {
      // Show toast notification
      toast.success(`New bid of $${data.amount} on ${data.itemTitle}`);
    }
  });

  socket.on('auction_started', (data) => {
    toast.success(`Auction started: ${data.title}`);
    window.dispatchEvent(new CustomEvent('auction_started', { detail: data }));
  });

  socket.on('auction_ending_soon', (data) => {
    toast.warning(`Auction ending in 5 minutes: ${data.title}`, {
      duration: 6000
    });
    window.dispatchEvent(new CustomEvent('auction_ending_soon', { detail: data }));
  });

  socket.on('auction_ended', (data) => {
    toast.info(`Auction ended: ${data.title}`);
    window.dispatchEvent(new CustomEvent('auction_ended', { detail: data }));
  });

  socket.on('outbid', (data) => {
    toast.error(`You've been outbid on ${data.itemTitle}! Current bid: $${data.currentBid}`);
    window.dispatchEvent(new CustomEvent('outbid', { detail: data }));
  });

  // Chat events
  socket.on('new_message', (data) => {
    window.dispatchEvent(new CustomEvent('new_message', { detail: data }));
  });

  socket.on('user_typing', (data) => {
    window.dispatchEvent(new CustomEvent('user_typing', { detail: data }));
  });

  // Notification events
  socket.on('notification', (data) => {
    switch (data.type) {
      case 'follow':
        toast.success(`${data.from} started following you!`);
        break;
      case 'badge':
        toast.success(`🏆 You earned a new badge: ${data.badge}!`);
        break;
      case 'item_liked':
        toast.info(`${data.from} liked your item: ${data.itemTitle}`);
        break;
      case 'fraud_alert':
        toast.error(`⚠️ Fraud Alert: ${data.message}`);
        break;
      default:
        toast.info(data.message);
    }
    window.dispatchEvent(new CustomEvent('notification', { detail: data }));
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Auction-specific socket functions
export const joinAuction = (auctionId) => {
  if (socket) {
    socket.emit('join_auction', auctionId);
  }
};

export const leaveAuction = (auctionId) => {
  if (socket) {
    socket.emit('leave_auction', auctionId);
  }
};

export const placeBid = (bidData) => {
  if (socket) {
    socket.emit('place_bid', bidData);
  }
};

// Chat functions
export const joinChat = (roomId) => {
  if (socket) {
    socket.emit('join_chat', roomId);
  }
};

export const leaveChat = (roomId) => {
  if (socket) {
    socket.emit('leave_chat', roomId);
  }
};

export const sendMessage = (messageData) => {
  if (socket) {
    socket.emit('send_message', messageData);
  }
};

export const startTyping = (roomId) => {
  if (socket) {
    socket.emit('typing_start', roomId);
  }
};

export const stopTyping = (roomId) => {
  if (socket) {
    socket.emit('typing_stop', roomId);
  }
};

// Utility function to check if socket is connected
export const isSocketConnected = () => {
  return socket && socket.connected;
};