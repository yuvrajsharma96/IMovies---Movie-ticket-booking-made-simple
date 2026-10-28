const mongoose = require('mongoose');
const dotenv = require('dotenv');
const QRCode = require('qrcode');
const { movies, theatres } = require('./seedData');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

dotenv.config({ path: __dirname + '/../.env' });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies');
    console.log('[Seeder] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();
    console.log('[Seeder] Cleared previous database collections.');

    // 1. Create Users (User model has pre-save hook to hash passwords)
    const adminUser = await User.create({
      name: 'Yuvraj Sharma (Admin)',
      email: 'admin@imovies.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });

    const demoUser = await User.create({
      name: 'Alex Johnson',
      email: 'user@imovies.com',
      password: 'user123',
      role: 'user',
      phone: '+91 98123 45678',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    });

    console.log('[Seeder] Created default Admin (admin@imovies.com) and User (user@imovies.com).');

    // 2. Insert Movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`[Seeder] Seeded ${createdMovies.length} movies.`);

    // 3. Insert Theatres
    const createdTheatres = await Theatre.insertMany(theatres);
    console.log(`[Seeder] Seeded ${createdTheatres.length} theatres.`);

    // 4. Generate Shows
    // Dates: Today, Tomorrow, +2 days
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const showTimes = ['10:15 AM', '01:45 PM', '05:30 PM', '09:00 PM'];
    const showDocs = [];

    // Schedule shows for top movies in theatres
    for (let mIdx = 0; mIdx < createdMovies.length; mIdx++) {
      const movie = createdMovies[mIdx];
      for (let tIdx = 0; tIdx < createdTheatres.length; tIdx++) {
        const theatre = createdTheatres[tIdx];

        // Schedule for each date
        for (const dateStr of dates) {
          // Select 2 time slots per theatre per movie
          const timeSlot = showTimes[(mIdx + tIdx) % showTimes.length];
          const secondSlot = showTimes[(mIdx + tIdx + 2) % showTimes.length];

          [timeSlot, secondSlot].forEach((time) => {
            const matrix = Show.generateDefaultMatrix({
              vip: 450,
              premium: 320,
              standard: 220,
            });

            // Mark a few random seats as already booked for realism
            const sampleBooked = ['A4', 'A5', 'C6', 'C7', 'E3', 'E4'];
            matrix.forEach((seat) => {
              if (sampleBooked.includes(seat.seatNumber)) {
                seat.status = 'booked';
              }
            });

            showDocs.push({
              movieId: movie._id,
              theatreId: theatre._id,
              screenName: `Screen ${((tIdx + 1) % 3) + 1} - ${theatre.screenType[0]}`,
              screenType: theatre.screenType[0],
              showDate: dateStr,
              showTime: time,
              ticketPrice: { vip: 450, premium: 320, standard: 220 },
              seatMatrix: matrix,
            });
          });
        }
      }
    }

    const createdShows = await Show.insertMany(showDocs);
    console.log(`[Seeder] Seeded ${createdShows.length} scheduled shows.`);

    // 5. Create a sample initial booking for demo user
    const firstShow = createdShows[0];
    const bookedSeats = [
      { seatNumber: 'C6', category: 'Premium', price: 320 },
      { seatNumber: 'C7', category: 'Premium', price: 320 },
    ];
    const subtotal = 640;
    const fee = 45;
    const tax = 18;
    const total = subtotal + fee + tax;
    const bookingRef = 'IMV-INIT01';

    const qrPayload = JSON.stringify({
      bookingId: bookingRef,
      movie: createdMovies[0].title,
      theatre: createdTheatres[0].name,
      date: firstShow.showDate,
      time: firstShow.showTime,
      seats: ['C6', 'C7'],
      user: demoUser.email,
      total,
    });

    const qrCodeData = await QRCode.toDataURL(qrPayload);

    const sampleBooking = await Booking.create({
      bookingId: bookingRef,
      userId: demoUser._id,
      showId: firstShow._id,
      seats: bookedSeats,
      subtotal,
      convenienceFee: fee,
      tax,
      totalAmount: total,
      paymentStatus: 'completed',
      paymentMethod: 'UPI',
      paymentId: 'PAY-UPI982348',
      bookingStatus: 'confirmed',
      bookingDate: new Date(),
      qrCodeData,
    });

    await User.findByIdAndUpdate(demoUser._id, {
      $push: { bookingHistory: sampleBooking._id },
    });

    console.log('[Seeder] Created initial sample booking for Alex Johnson.');
    console.log('[Seeder] Database seeding successfully completed! 🎉');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

const destroyDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies');
    await User.deleteMany();
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();
    console.log('[Seeder] All database records deleted.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyDB();
} else {
  seedDB();
}
