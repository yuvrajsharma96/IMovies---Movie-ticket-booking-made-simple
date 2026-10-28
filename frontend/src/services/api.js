import axios from 'axios';
import {
  mockMovies,
  mockTheatres,
  generateMockShows,
  generateMockMatrix,
} from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

// Interceptor to inject JWT Bearer token into outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('imovies_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// In-Memory / LocalStorage Mock Engine for Demo Deployments (GitHub Pages / Vercel)
const getStoredBookings = () => {
  const saved = localStorage.getItem('imovies_demo_bookings');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return [
    {
      _id: 'book_sample_01',
      bookingId: 'IMV-DEMO01',
      showId: {
        movieId: mockMovies[0],
        theatreId: mockTheatres[0],
        screenName: 'Audi 1 - IMAX',
        screenType: 'IMAX 2D',
        showDate: new Date().toISOString().split('T')[0],
        showTime: '07:30 PM',
      },
      seats: [
        { seatNumber: 'C6', category: 'Premium', price: 320 },
        { seatNumber: 'C7', category: 'Premium', price: 320 },
      ],
      subtotal: 640,
      convenienceFee: 45,
      tax: 18,
      totalAmount: 703,
      bookingStatus: 'confirmed',
      bookingDate: new Date().toISOString(),
      paymentMethod: 'UPI',
      paymentId: 'PAY-UPI89213',
      qrCodeData: 'https://imovies.app/verify/IMV-DEMO01',
    },
  ];
};

const handleMockFallback = (config) => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  // Auth: Login
  if (url.includes('/auth/login') && method === 'post') {
    const body = JSON.parse(config.data || '{}');
    const isAdmin = body.email === 'admin@imovies.com';
    const user = {
      _id: isAdmin ? 'usr_admin_demo' : 'usr_customer_demo',
      name: isAdmin ? 'Yuvraj Sharma (Admin)' : 'Alex Johnson',
      email: body.email,
      role: isAdmin ? 'admin' : 'user',
      avatar: isAdmin
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    };
    return { data: { success: true, token: 'demo_jwt_token_' + Date.now(), user } };
  }

  // Auth: Register
  if (url.includes('/auth/register') && method === 'post') {
    const body = JSON.parse(config.data || '{}');
    const user = {
      _id: 'usr_' + Date.now(),
      name: body.name || 'New Customer',
      email: body.email,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
    return { data: { success: true, token: 'demo_jwt_token_' + Date.now(), user } };
  }

  // Auth: Profile
  if (url.includes('/auth/profile')) {
    const saved = localStorage.getItem('imovies_user');
    const user = saved ? JSON.parse(saved) : {
      _id: 'usr_customer_demo',
      name: 'Alex Johnson',
      email: 'user@imovies.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    };
    return { data: { success: true, user } };
  }

  // Movies: Single Movie
  if (url.match(/\/movies\/([a-zA-Z0-9_-]+)/) && method === 'get') {
    const match = url.match(/\/movies\/([a-zA-Z0-9_-]+)/);
    const mId = match[1];
    const movie = mockMovies.find((m) => m._id === mId) || mockMovies[0];
    return { data: { success: true, movie } };
  }

  // Movies: List
  if (url.includes('/movies') && method === 'get') {
    let movies = [...mockMovies];
    return { data: { success: true, count: movies.length, movies } };
  }

  // Movies: Create
  if (url.includes('/movies') && method === 'post') {
    const newMovie = JSON.parse(config.data || '{}');
    newMovie._id = 'mov_' + Date.now();
    mockMovies.push(newMovie);
    return { data: { success: true, movie: newMovie } };
  }

  // Theatres: List
  if (url.includes('/theatres') && method === 'get') {
    return { data: { success: true, count: mockTheatres.length, theatres: mockTheatres } };
  }

  // Shows: Single Show
  if (url.match(/\/shows\/([a-zA-Z0-9_-]+)/) && method === 'get') {
    const match = url.match(/\/shows\/([a-zA-Z0-9_-]+)/);
    const sId = match[1];
    const mockShows = generateMockShows();
    let found = mockShows.find((s) => s._id === sId);
    if (!found) {
      found = {
        _id: sId,
        movieId: mockMovies[0],
        theatreId: mockTheatres[0],
        screenName: 'Audi 1 - IMAX',
        screenType: 'IMAX 2D',
        showDate: new Date().toISOString().split('T')[0],
        showTime: '07:30 PM',
        ticketPrice: { vip: 450, premium: 320, standard: 220 },
        seatMatrix: generateMockMatrix(),
      };
    }
    return { data: { success: true, show: found } };
  }

  // Shows: List
  if (url.includes('/shows') && method === 'get') {
    const mockShows = generateMockShows();
    return { data: { success: true, count: mockShows.length, shows: mockShows } };
  }

  // Shows: Create Show
  if (url.includes('/shows') && method === 'post') {
    const body = JSON.parse(config.data || '{}');
    const createdShow = {
      _id: 'show_' + Date.now(),
      movieId: mockMovies.find((m) => m._id === body.movieId) || mockMovies[0],
      theatreId: mockTheatres.find((t) => t._id === body.theatreId) || mockTheatres[0],
      screenName: body.screenName || 'Audi 1',
      screenType: body.screenType || 'IMAX 2D',
      showDate: body.showDate || new Date().toISOString().split('T')[0],
      showTime: body.showTime || '07:30 PM',
      ticketPrice: body.ticketPrice || { vip: 450, premium: 320, standard: 220 },
      seatMatrix: generateMockMatrix(body.ticketPrice),
    };
    return { data: { success: true, show: createdShow } };
  }

  // Bookings: Lock Seats
  if (url.includes('/bookings/lock-seats')) {
    return { data: { success: true, message: 'Seats locked successfully.' } };
  }

  // Bookings: Unlock Seats
  if (url.includes('/bookings/unlock-seats')) {
    return { data: { success: true, message: 'Seats unlocked.' } };
  }

  // Payments: Process
  if (url.includes('/payments/process')) {
    const body = JSON.parse(config.data || '{}');
    return {
      data: {
        success: true,
        status: 'COMPLETED',
        paymentData: {
          transactionId: 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          amount: body.amount,
        },
      },
    };
  }

  // Bookings: Create Confirm
  if (url.includes('/bookings') && method === 'post') {
    const body = JSON.parse(config.data || '{}');
    const bookingRef = 'IMV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newBooking = {
      _id: 'book_' + Date.now(),
      bookingId: bookingRef,
      showId: {
        movieId: body.show?.movieId || mockMovies[0],
        theatreId: body.show?.theatreId || mockTheatres[0],
        screenName: body.show?.screenName || 'Audi 1 - IMAX',
        screenType: body.show?.screenType || 'IMAX 2D',
        showDate: body.show?.showDate || new Date().toISOString().split('T')[0],
        showTime: body.show?.showTime || '07:30 PM',
      },
      seats: body.seats || [{ seatNumber: 'C6', category: 'Premium', price: 320 }],
      subtotal: body.subtotal || 640,
      convenienceFee: body.convenienceFee || 45,
      tax: body.tax || 18,
      totalAmount: body.totalAmount || 703,
      bookingStatus: 'confirmed',
      bookingDate: new Date().toISOString(),
      paymentMethod: body.paymentMethod || 'UPI',
      paymentId: body.paymentId || 'PAY-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      qrCodeData: `https://imovies.app/verify/${bookingRef}`,
    };

    const bookings = getStoredBookings();
    bookings.unshift(newBooking);
    localStorage.setItem('imovies_demo_bookings', JSON.stringify(bookings));

    return { data: { success: true, booking: newBooking } };
  }

  // Bookings: My Bookings
  if (url.includes('/bookings/my-bookings')) {
    const bookings = getStoredBookings();
    return { data: { success: true, count: bookings.length, bookings } };
  }

  // Bookings: Single
  if (url.match(/\/bookings\/([a-zA-Z0-9_-]+)/) && method === 'get') {
    const match = url.match(/\/bookings\/([a-zA-Z0-9_-]+)/);
    const bId = match[1];
    const bookings = getStoredBookings();
    const found = bookings.find((b) => b._id === bId || b.bookingId === bId) || bookings[0];
    return { data: { success: true, booking: found } };
  }

  // Bookings: Cancel
  if (url.includes('/cancel')) {
    const bookings = getStoredBookings();
    if (bookings.length > 0) {
      bookings[0].bookingStatus = 'cancelled';
      localStorage.setItem('imovies_demo_bookings', JSON.stringify(bookings));
    }
    return { data: { success: true, message: 'Booking cancelled' } };
  }

  // Bookings: Analytics (Admin)
  if (url.includes('/bookings/analytics')) {
    const bookings = getStoredBookings();
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 142500);
    return {
      data: {
        success: true,
        metrics: {
          totalRevenue,
          totalBookings: bookings.length + 142,
          totalTicketsSold: (bookings.length * 2) + 380,
          totalShows: 28,
        },
        recentBookings: bookings,
      },
    };
  }

  return null;
};

// Response Interceptor: tries real server, seamlessly falls back to mock demo engine on network failure
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend connection fails or returns 404 (e.g. running on GitHub Pages)
    if (!error.response || error.code === 'ERR_NETWORK' || error.response.status === 404) {
      console.info('[IMovies Demo Engine] Server unreachable. Serving via client demo engine.');
      const mockRes = handleMockFallback(error.config);
      if (mockRes) {
        return Promise.resolve(mockRes);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
