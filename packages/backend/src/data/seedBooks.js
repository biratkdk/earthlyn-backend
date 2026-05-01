const seedBooks = [
  {
    book_id: 1,
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    genre: 'Dystopian',
    shelf_location: 'Shelf B, Row 2',
    tags: ['dystopia', 'classic']
  },
  {
    book_id: 2,
    title: 'Brave New World',
    author: 'Aldous Huxley',
    isbn: '9780060850524',
    genre: 'Dystopian',
    shelf_location: 'Shelf B, Row 2',
    tags: ['dystopia', 'science fiction']
  },
  {
    book_id: 3,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    genre: 'Classic',
    shelf_location: 'Shelf A, Row 3',
    tags: ['justice', 'classic']
  },
  {
    book_id: 4,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780547928227',
    genre: 'Fantasy',
    shelf_location: 'Shelf C, Row 1',
    tags: ['fantasy', 'adventure']
  },
  {
    book_id: 5,
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '9780441172719',
    genre: 'Science Fiction',
    shelf_location: 'Shelf D, Row 2',
    tags: ['desert', 'epic']
  },
  {
    book_id: 6,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    isbn: '9780062316110',
    genre: 'Nonfiction',
    shelf_location: 'Shelf E, Row 1',
    tags: ['history', 'civilization']
  },
  {
    book_id: 7,
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '9780735211292',
    genre: 'Self-Help',
    shelf_location: 'Shelf E, Row 3',
    tags: ['habits', 'productivity']
  },
  {
    book_id: 8,
    title: "The Handmaid's Tale",
    author: 'Margaret Atwood',
    isbn: '9780385490818',
    genre: 'Dystopian',
    shelf_location: 'Shelf B, Row 3',
    tags: ['dystopia', 'classic']
  },
  {
    book_id: 9,
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    isbn: '9780593135204',
    genre: 'Science Fiction',
    shelf_location: 'Shelf D, Row 4',
    tags: ['space', 'problem-solving', 'survival']
  },
  {
    book_id: 10,
    title: 'Circe',
    author: 'Madeline Miller',
    isbn: '9780316556347',
    genre: 'Fantasy',
    shelf_location: 'Shelf C, Row 2',
    tags: ['mythology', 'literary', 'retelling']
  },
  {
    book_id: 11,
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    isbn: '9780062060624',
    genre: 'Historical Fiction',
    shelf_location: 'Shelf C, Row 2',
    tags: ['mythology', 'romance', 'retelling']
  },
  {
    book_id: 12,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    isbn: '9780525559474',
    genre: 'Literary Fiction',
    shelf_location: 'Shelf A, Row 2',
    tags: ['speculative', 'life choices', 'accessible']
  },
  {
    book_id: 13,
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    isbn: '9780593318171',
    genre: 'Science Fiction',
    shelf_location: 'Shelf D, Row 3',
    tags: ['literary', 'ai', 'quiet']
  },
  {
    book_id: 14,
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    isbn: '9781501161933',
    genre: 'Historical Fiction',
    shelf_location: 'Shelf A, Row 4',
    tags: ['celebrity', 'romance', 'book club']
  },
  {
    book_id: 15,
    title: 'A Gentleman in Moscow',
    author: 'Amor Towles',
    isbn: '9780143110439',
    genre: 'Historical Fiction',
    shelf_location: 'Shelf A, Row 5',
    tags: ['historical', 'character', 'elegant']
  },
  {
    book_id: 16,
    title: 'The Thursday Murder Club',
    author: 'Richard Osman',
    isbn: '9781984880963',
    genre: 'Mystery',
    shelf_location: 'Shelf F, Row 1',
    tags: ['cozy mystery', 'humor', 'series']
  },
  {
    book_id: 17,
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    isbn: '9780307588371',
    genre: 'Thriller',
    shelf_location: 'Shelf F, Row 2',
    tags: ['psychological', 'twist', 'crime']
  },
  {
    book_id: 18,
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    isbn: '9781250301697',
    genre: 'Thriller',
    shelf_location: 'Shelf F, Row 2',
    tags: ['psychological', 'twist', 'fast read']
  },
  {
    book_id: 19,
    title: 'Educated',
    author: 'Tara Westover',
    isbn: '9780399590504',
    genre: 'Memoir',
    shelf_location: 'Shelf E, Row 2',
    tags: ['memoir', 'education', 'resilience']
  },
  {
    book_id: 20,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    isbn: '9780857197689',
    genre: 'Nonfiction',
    shelf_location: 'Shelf E, Row 3',
    tags: ['money', 'behavior', 'essays']
  },
  {
    book_id: 21,
    title: 'Deep Work',
    author: 'Cal Newport',
    isbn: '9781455586691',
    genre: 'Self-Help',
    shelf_location: 'Shelf E, Row 3',
    tags: ['focus', 'productivity', 'work']
  },
  {
    book_id: 22,
    title: 'The Night Circus',
    author: 'Erin Morgenstern',
    isbn: '9780307744432',
    genre: 'Fantasy',
    shelf_location: 'Shelf C, Row 3',
    tags: ['magical realism', 'romance', 'atmospheric']
  },
  {
    book_id: 23,
    title: 'Pachinko',
    author: 'Min Jin Lee',
    isbn: '9781455563937',
    genre: 'Historical Fiction',
    shelf_location: 'Shelf A, Row 5',
    tags: ['family saga', 'korea', 'literary']
  },
  {
    book_id: 24,
    title: 'The Martian',
    author: 'Andy Weir',
    isbn: '9780553418026',
    genre: 'Science Fiction',
    shelf_location: 'Shelf D, Row 4',
    tags: ['space', 'survival', 'humor']
  }
];

module.exports = { seedBooks };
