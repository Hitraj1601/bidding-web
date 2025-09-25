import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Store active connections
const activeConnections = new Map();

// Authenticate socket connection
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password -refreshTokens');
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};

export const setupSocket = (io) => {
  // Authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.username} (${socket.id})`);
    
    // Store user connection
    activeConnections.set(socket.user._id.toString(), {
      socketId: socket.id,
      user: socket.user,
      connectedAt: new Date()
    });

    // Join user to their personal room for notifications
    socket.join(`user_${socket.user._id}`);
    
    // Join auction rooms based on user's interests
    socket.on('join_auction', (auctionId) => {
      console.log(`👤 ${socket.user.username} joined auction: ${auctionId}`);
      socket.join(`auction_${auctionId}`);
      
      // Notify others in the auction
      socket.to(`auction_${auctionId}`).emit('user_joined_auction', {
        username: socket.user.username,
        avatar: socket.user.avatar
      });
    });

    // Leave auction room
    socket.on('leave_auction', (auctionId) => {
      console.log(`👤 ${socket.user.username} left auction: ${auctionId}`);
      socket.leave(`auction_${auctionId}`);
      
      // Notify others in the auction
      socket.to(`auction_${auctionId}`).emit('user_left_auction', {
        username: socket.user.username
      });
    });

    // Join item-specific room for bidding
    socket.on('watch_item', (itemId) => {
      console.log(`👀 ${socket.user.username} watching item: ${itemId}`);
      socket.join(`item_${itemId}`);
      
      // Send current item status
      socket.emit('item_status', {
        itemId,
        watchers: getItemWatchers(itemId)
      });
    });

    // Stop watching item
    socket.on('unwatch_item', (itemId) => {
      console.log(`👀 ${socket.user.username} stopped watching item: ${itemId}`);
      socket.leave(`item_${itemId}`);
    });

    // Handle real-time bidding
    socket.on('place_bid', async (bidData) => {
      try {
        const { itemId, amount, type = 'standard', maxBid } = bidData;
        
        console.log(`🎯 Bid attempt: ${socket.user.username} - $${amount} on item ${itemId}`);
        
        // Emit bid attempt to all watchers
        io.to(`item_${itemId}`).emit('bid_attempt', {
          itemId,
          bidder: {
            id: socket.user._id,
            username: socket.user.username,
            avatar: socket.user.avatar
          },
          amount,
          timestamp: new Date()
        });

        // The actual bid processing will be handled by the REST API
        // This socket event is just for real-time updates
        
      } catch (error) {
        console.error('Bid error:', error);
        socket.emit('bid_error', {
          message: 'Failed to process bid',
          error: error.message
        });
      }
    });

    // Handle chat messages in auction rooms
    socket.on('auction_message', (data) => {
      const { auctionId, message, type = 'text' } = data;
      
      if (!message.trim()) return;
      
      const messageData = {
        id: generateMessageId(),
        user: {
          id: socket.user._id,
          username: socket.user.username,
          avatar: socket.user.avatar,
          badges: socket.user.badges
        },
        message: message.trim(),
        type,
        timestamp: new Date(),
        auctionId
      };
      
      // Broadcast to all users in the auction room
      io.to(`auction_${auctionId}`).emit('auction_message', messageData);
      
      // Store message in database (optional)
      // You could implement a Message model for persistence
    });

    // Handle private messages between collectors
    socket.on('private_message', (data) => {
      const { recipientId, message, type = 'text' } = data;
      
      if (!message.trim()) return;
      
      const messageData = {
        id: generateMessageId(),
        sender: {
          id: socket.user._id,
          username: socket.user.username,
          avatar: socket.user.avatar
        },
        message: message.trim(),
        type,
        timestamp: new Date()
      };
      
      // Send to recipient
      io.to(`user_${recipientId}`).emit('private_message', messageData);
      
      // Send confirmation to sender
      socket.emit('message_sent', messageData);
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { auctionId, itemId } = data;
      
      if (auctionId) {
        socket.to(`auction_${auctionId}`).emit('user_typing', {
          username: socket.user.username,
          auctionId
        });
      }
    });

    socket.on('typing_stop', (data) => {
      const { auctionId, itemId } = data;
      
      if (auctionId) {
        socket.to(`auction_${auctionId}`).emit('user_stopped_typing', {
          username: socket.user.username,
          auctionId
        });
      }
    });

    // Handle user status updates
    socket.on('update_status', (status) => {
      socket.user.status = status;
      
      // Broadcast status update to followers
      // This would require implementing a followers system
      socket.broadcast.emit('user_status_update', {
        userId: socket.user._id,
        username: socket.user.username,
        status
      });
    });

    // Handle auction following
    socket.on('follow_auction', (auctionId) => {
      socket.join(`auction_followers_${auctionId}`);
      console.log(`📌 ${socket.user.username} following auction: ${auctionId}`);
    });

    socket.on('unfollow_auction', (auctionId) => {
      socket.leave(`auction_followers_${auctionId}`);
      console.log(`📌 ${socket.user.username} unfollowed auction: ${auctionId}`);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`🔌 User disconnected: ${socket.user.username} - Reason: ${reason}`);
      
      // Remove from active connections
      activeConnections.delete(socket.user._id.toString());
      
      // Notify auction rooms that user left
      // This would require tracking which rooms the user was in
    });

    // Handle connection errors
    socket.on('error', (error) => {
      console.error(`❌ Socket error for ${socket.user.username}:`, error);
    });
  });

  // Global socket events (can be called from REST API routes)
  io.broadcastBidUpdate = (itemId, bidData) => {
    io.to(`item_${itemId}`).emit('bid_update', {
      itemId,
      currentBid: bidData.amount,
      bidder: bidData.bidder,
      totalBids: bidData.totalBids,
      timeRemaining: bidData.timeRemaining,
      timestamp: new Date()
    });
  };

  io.broadcastAuctionUpdate = (auctionId, updateData) => {
    io.to(`auction_${auctionId}`).emit('auction_update', {
      auctionId,
      ...updateData,
      timestamp: new Date()
    });
  };

  io.sendUserNotification = (userId, notification) => {
    io.to(`user_${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date()
    });
  };

  io.broadcastAuctionEnd = (auctionId, results) => {
    io.to(`auction_${auctionId}`).emit('auction_ended', {
      auctionId,
      results,
      timestamp: new Date()
    });
  };

  io.broadcastNewAuction = (auctionData) => {
    io.emit('new_auction', {
      ...auctionData,
      timestamp: new Date()
    });
  };

  // Utility functions
  const getItemWatchers = (itemId) => {
    const room = io.sockets.adapter.rooms.get(`item_${itemId}`);
    return room ? room.size : 0;
  };

  const getAuctionParticipants = (auctionId) => {
    const room = io.sockets.adapter.rooms.get(`auction_${auctionId}`);
    return room ? room.size : 0;
  };

  const generateMessageId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Periodic cleanup of inactive connections
  setInterval(() => {
    const now = new Date();
    for (const [userId, connection] of activeConnections.entries()) {
      const timeDiff = now - connection.connectedAt;
      // Remove connections older than 24 hours
      if (timeDiff > 24 * 60 * 60 * 1000) {
        activeConnections.delete(userId);
      }
    }
  }, 60 * 60 * 1000); // Run every hour

  console.log('🚀 Socket.io server setup complete');
};

// Export utility functions for use in routes
export const getActiveConnections = () => activeConnections;

export const isUserOnline = (userId) => {
  return activeConnections.has(userId.toString());
};

export const getOnlineUsers = () => {
  return Array.from(activeConnections.values()).map(conn => ({
    id: conn.user._id,
    username: conn.user.username,
    avatar: conn.user.avatar,
    connectedAt: conn.connectedAt
  }));
};