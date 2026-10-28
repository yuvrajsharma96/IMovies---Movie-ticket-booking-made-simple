export const mockMovies = [
  {
    _id: 'mov_oppenheimer',
    title: 'Oppenheimer',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    releaseDate: '2023-07-21',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    rating: 8.9,
    votes: 35000,
    certificate: 'A',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Emily Blunt', role: 'Katherine Oppenheimer', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
      { name: 'Matt Damon', role: 'Leslie Groves', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Robert Downey Jr.', role: 'Lewis Strauss', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
    ],
    isActive: true,
  },
  {
    _id: 'mov_dune2',
    title: 'Dune: Part Two',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    language: 'English',
    duration: 166,
    releaseDate: '2024-03-01',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    rating: 8.7,
    votes: 42000,
    certificate: 'UA',
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
      { name: 'Zendaya', role: 'Chani', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80' },
    ],
    isActive: true,
  },
  {
    _id: 'mov_interstellar',
    title: 'Interstellar',
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    language: 'English',
    duration: 169,
    releaseDate: '2014-11-07',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    description: 'When Earth becomes uninhabitable, an ex-pilot is tasked with traveling through a wormhole to find humanity a new home.',
    rating: 8.8,
    votes: 56000,
    certificate: 'UA',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Matthew McConaughey', role: 'Cooper', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Anne Hathaway', role: 'Brand', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    ],
    isActive: true,
  },
  {
    _id: 'mov_spiderman',
    title: 'Spider-Man: Across the Spider-Verse',
    genre: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    duration: 140,
    releaseDate: '2023-06-02',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg',
    description: 'Miles Morales catapults across the Multiverse to protect its very existence alongside Spider-People from other dimensions.',
    rating: 8.7,
    votes: 29000,
    certificate: 'U',
    director: 'Joaquim Dos Santos',
    cast: [
      { name: 'Shameik Moore', role: 'Miles Morales (voice)', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
      { name: 'Hailee Steinfeld', role: 'Gwen Stacy (voice)', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    ],
    isActive: true,
  },
  {
    _id: 'mov_darkknight',
    title: 'The Dark Knight',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 152,
    releaseDate: '2008-07-18',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
    description: 'Batman must accept one of the greatest psychological tests of his ability to fight injustice against the Joker.',
    rating: 9.0,
    votes: 68000,
    certificate: 'UA',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne / Batman', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Heath Ledger', role: 'Joker', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
    ],
    isActive: true,
  },
  {
    _id: 'mov_inception',
    title: 'Inception',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    language: 'English',
    duration: 148,
    releaseDate: '2010-07-16',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
    description: 'A thief who steals corporate secrets through dream-sharing technology is tasked with planting an idea into a mind.',
    rating: 8.8,
    votes: 52000,
    certificate: 'UA',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Leonardo DiCaprio', role: 'Cobb', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    ],
    isActive: true,
  },
];

export const mockTheatres = [
  {
    _id: 'theatre_mumbai_pvr',
    name: 'PVR IMAX: Palladium High Street',
    location: { city: 'Mumbai', state: 'Maharashtra' },
    address: '462, Senapati Bapat Marg, Lower Parel, Mumbai',
    totalSeats: 84,
    screenType: ['IMAX 2D', '4DX', 'Dolby Atmos'],
    facilities: ['Recliner Seats', 'Gourmet In-seat Dining', 'Valet Parking'],
  },
  {
    _id: 'theatre_mumbai_inox',
    name: 'INOX Megaplex: Inorbit Mall',
    location: { city: 'Mumbai', state: 'Maharashtra' },
    address: 'Link Road, Malad West, Mumbai',
    totalSeats: 84,
    screenType: ['INSIGNIA', 'Dolby Atmos 7.1'],
    facilities: ['Luxury Lounges', 'Live Kitchen'],
  },
  {
    _id: 'theatre_delhi_pvr',
    name: 'PVR Director’s Cut: Ambience Mall',
    location: { city: 'Delhi-NCR', state: 'Delhi' },
    address: 'Ambience Island, NH 8, Gurugram, Delhi-NCR',
    totalSeats: 84,
    screenType: ['IMAX with Laser', 'Dolby Atmos'],
    facilities: ['VIP Concierge', 'Plush Recliners'],
  },
  {
    _id: 'theatre_blr_cinepolis',
    name: 'Cinepolis IMAX: Forum Mall',
    location: { city: 'Bengaluru', state: 'Karnataka' },
    address: 'Hosur Road, Koramangala, Bengaluru',
    totalSeats: 84,
    screenType: ['IMAX 3D', '4DX'],
    facilities: ['Dolby Atmos', 'Premium Snack Bar'],
  },
  {
    _id: 'theatre_hyd_prasad',
    name: 'Prasad Multiplex & IMAX',
    location: { city: 'Hyderabad', state: 'Telangana' },
    address: 'NTR Gardens, Necklace Road, Hyderabad',
    totalSeats: 84,
    screenType: ['Dual Laser IMAX', 'Dolby Atmos'],
    facilities: ['Massive Screen', 'Cafeteria'],
  },
];

export const generateMockMatrix = (prices = { vip: 450, premium: 320, standard: 220 }) => {
  const rows = [
    { row: 'A', category: 'VIP', price: prices.vip },
    { row: 'B', category: 'VIP', price: prices.vip },
    { row: 'C', category: 'Premium', price: prices.premium },
    { row: 'D', category: 'Premium', price: prices.premium },
    { row: 'E', category: 'Standard', price: prices.standard },
    { row: 'F', category: 'Standard', price: prices.standard },
    { row: 'G', category: 'Standard', price: prices.standard },
  ];

  const colsPerRow = 12;
  const matrix = [];
  const sampleBooked = ['A4', 'A5', 'C6', 'C7', 'E3', 'E4'];

  rows.forEach((r) => {
    for (let c = 1; c <= colsPerRow; c++) {
      const seatNum = `${r.row}${c}`;
      matrix.push({
        seatNumber: seatNum,
        row: r.row,
        col: c,
        category: r.category,
        price: r.price,
        status: sampleBooked.includes(seatNum) ? 'booked' : 'available',
        lockedBy: null,
        lockedAt: null,
      });
    }
  });

  return matrix;
};

// Generate initial mock shows for demo
export const generateMockShows = () => {
  const shows = [];
  const showTimes = ['10:15 AM', '01:45 PM', '05:30 PM', '09:00 PM'];
  const today = new Date();
  const dates = [];

  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }

  mockMovies.forEach((m, mIdx) => {
    mockTheatres.forEach((t, tIdx) => {
      dates.forEach((d) => {
        showTimes.forEach((time, sIdx) => {
          shows.push({
            _id: `show_${m._id}_${t._id}_${d}_${sIdx}`,
            movieId: m,
            theatreId: t,
            screenName: `Audi ${(tIdx % 3) + 1} - ${t.screenType[0]}`,
            screenType: t.screenType[0],
            showDate: d,
            showTime: time,
            ticketPrice: { vip: 450, premium: 320, standard: 220 },
            seatMatrix: generateMockMatrix(),
          });
        });
      });
    });
  });

  return shows;
};
