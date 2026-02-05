const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const News = require('./models/News');
const Comment = require('./models/Comment');

const sampleNews = [
  {
    title: 'Tech Giants Announce Revolutionary AI Features for 2026',
    content: `<p>Major technology companies unveiled their latest artificial intelligence innovations at the annual tech summit this week, promising to reshape how we interact with digital devices.</p>
    <p>The announcements include advanced natural language processing capabilities, improved image recognition, and predictive algorithms that aim to anticipate user needs before they even arise.</p>
    <p>"This represents a quantum leap in AI technology," said industry analyst Sarah Chen. "We're seeing capabilities that were theoretical just a few years ago becoming practical reality."</p>
    <p>The new features are expected to roll out gradually throughout the year, with some available as early as next month.</p>`,
    summary: 'Major tech companies reveal groundbreaking AI innovations that promise to transform digital interactions.',
    category: 'technology',
    tags: ['AI', 'technology', 'innovation', 'machine learning'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    status: 'published',
    isFeatured: true,
    views: 1250
  },
  {
    title: 'Global Markets Rally After Economic Policy Announcement',
    content: `<p>Stock markets around the world surged today following a coordinated economic policy announcement from major central banks.</p>
    <p>The S&P 500 rose 2.3%, while European and Asian markets saw similar gains. Analysts attribute the rally to increased confidence in economic stability measures.</p>
    <p>"Investors are responding positively to the clear communication and coordinated approach," noted financial expert Mark Thompson.</p>
    <p>The policy changes include new liquidity measures and revised interest rate guidance for the coming year.</p>`,
    summary: 'Stock markets worldwide see significant gains following coordinated central bank policy announcements.',
    category: 'business',
    tags: ['markets', 'economy', 'stocks', 'finance'],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    status: 'published',
    isFeatured: true,
    views: 890
  },
  {
    title: 'Scientists Discover New Method for Clean Energy Production',
    content: `<p>A team of researchers at MIT has announced a breakthrough in clean energy production that could revolutionize the renewable energy sector.</p>
    <p>The new method involves a novel approach to solar energy conversion that achieves efficiency rates previously thought impossible.</p>
    <p>Dr. Emily Roberts, lead researcher on the project, explained: "Our technique captures a broader spectrum of light than traditional solar panels, dramatically increasing energy output."</p>
    <p>Industry experts are calling this discovery a potential game-changer for addressing climate change.</p>`,
    summary: 'MIT researchers announce breakthrough in solar energy conversion with unprecedented efficiency rates.',
    category: 'science',
    tags: ['science', 'energy', 'solar', 'climate', 'research'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    status: 'published',
    isFeatured: true,
    views: 2100
  },
  {
    title: 'Championship Finals Draw Record Viewership',
    content: `<p>The championship finals attracted a record-breaking audience of 150 million viewers worldwide, making it the most-watched sporting event of the decade.</p>
    <p>The thrilling match went into overtime, with the winning team securing victory in the final seconds.</p>
    <p>"This was everything fans hoped for and more," said sports commentator James Wilson. "The level of competition was extraordinary."</p>
    <p>Social media platforms reported unprecedented engagement, with the event trending globally for over 12 hours.</p>`,
    summary: 'Championship finals break viewership records with 150 million global audience.',
    category: 'sports',
    tags: ['sports', 'championship', 'finals', 'records'],
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    status: 'published',
    isFeatured: false,
    views: 3500
  },
  {
    title: 'New Healthcare Initiative Aims to Improve Rural Access',
    content: `<p>The government announced a comprehensive healthcare initiative today designed to dramatically improve medical access in rural communities.</p>
    <p>The program includes mobile health clinics, telemedicine expansion, and incentives for healthcare workers to serve in underserved areas.</p>
    <p>"No one should have to travel hours to see a doctor," said Health Minister Patricia Adams. "This initiative will bring quality healthcare to every corner of the country."</p>
    <p>The five-year program has been allocated $2.5 billion in funding.</p>`,
    summary: 'Government launches $2.5 billion initiative to expand healthcare access in rural areas.',
    category: 'health',
    tags: ['health', 'healthcare', 'rural', 'government', 'policy'],
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80',
    status: 'published',
    isFeatured: false,
    views: 670
  },
  {
    title: 'Award-Winning Director Announces Upcoming Film Project',
    content: `<p>Oscar-winning director Christopher Nolan has announced his next ambitious project, a historical epic spanning three centuries.</p>
    <p>The film will feature an ensemble cast including several A-list actors and is set to begin production later this year.</p>
    <p>"This is a story I've wanted to tell for over a decade," Nolan shared in an exclusive interview. "The scope and scale will be unlike anything I've attempted before."</p>
    <p>The project has already generated significant buzz in Hollywood, with early predictions for awards season recognition.</p>`,
    summary: 'Christopher Nolan reveals his most ambitious film project yet, a three-century historical epic.',
    category: 'entertainment',
    tags: ['movies', 'Hollywood', 'director', 'film'],
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    status: 'published',
    isFeatured: false,
    views: 1800
  },
  {
    title: 'International Summit Addresses Climate Change Goals',
    content: `<p>World leaders gathered this week for a crucial international summit focused on accelerating climate change mitigation efforts.</p>
    <p>The summit resulted in new commitments from 50 nations to reduce carbon emissions by 40% by 2035.</p>
    <p>"We are at a critical juncture," stated UN Secretary-General. "The agreements reached here represent significant progress, but more work remains."</p>
    <p>Environmental groups have cautiously welcomed the outcomes while calling for stronger implementation mechanisms.</p>`,
    summary: '50 nations commit to 40% carbon emission reduction by 2035 at international climate summit.',
    category: 'world',
    tags: ['climate', 'environment', 'summit', 'international', 'policy'],
    image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80',
    status: 'published',
    isFeatured: false,
    views: 980
  },
  {
    title: 'Local Community Garden Project Transforms Urban Neighborhood',
    content: `<p>A volunteer-driven community garden initiative has transformed a previously vacant lot into a thriving green space that's bringing neighbors together.</p>
    <p>The project, started just two years ago, now features over 50 individual garden plots, a children's education area, and weekly farmer's markets.</p>
    <p>"This garden has become the heart of our community," said project coordinator Maria Santos. "It's about so much more than just growing vegetables."</p>
    <p>The initiative has inspired similar projects in neighboring communities.</p>`,
    summary: 'Volunteer community garden transforms vacant lot into thriving neighborhood gathering space.',
    category: 'local',
    tags: ['community', 'garden', 'local', 'volunteer'],
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    status: 'published',
    isFeatured: false,
    views: 450
  },
  {
    title: 'New Political Alliance Forms Ahead of Elections',
    content: `<p>Three major political parties announced the formation of a new alliance today, reshaping the political landscape ahead of upcoming elections.</p>
    <p>The coalition brings together parties with traditionally different platforms, united by common goals on economic reform and infrastructure development.</p>
    <p>"This alliance represents a new way forward," declared coalition spokesperson David Chen. "Voters are tired of partisan gridlock."</p>
    <p>Political analysts are divided on the potential impact, with some predicting significant electoral gains.</p>`,
    summary: 'Major political parties form unprecedented alliance focused on economic reform ahead of elections.',
    category: 'politics',
    tags: ['politics', 'elections', 'alliance', 'government'],
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    status: 'published',
    isFeatured: false,
    views: 1200
  },
  {
    title: 'Draft: Upcoming Product Launch Preview',
    content: `<p>This article previews the upcoming product launch scheduled for next month.</p>
    <p>Details about features and pricing to be added.</p>`,
    summary: 'Preview of upcoming product launch - draft article.',
    category: 'technology',
    tags: ['product', 'launch', 'preview'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    status: 'draft',
    isFeatured: false,
    views: 0
  }
];

const sampleComments = [
  { content: 'Great article! Very informative and well-written.', newsIndex: 0 },
  { content: 'This is exactly the kind of innovation we need.', newsIndex: 0 },
  { content: 'Interesting perspective on the market trends.', newsIndex: 1 },
  { content: 'Amazing discovery! Hope to see this implemented soon.', newsIndex: 2 },
  { content: 'What a game! Best finals I\'ve ever watched.', newsIndex: 3 },
  { content: 'This healthcare initiative is long overdue.', newsIndex: 4 }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data (except admin user)
    console.log('Clearing existing news and comments...');
    await News.deleteMany({});
    await Comment.deleteMany({});

    // Get or create admin user
    let admin = await User.findOne({ email: 'admin@news.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: 'admin@news.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    }

    // Create a test user for comments
    let testUser = await User.findOne({ email: 'user@news.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'John Doe',
        email: 'user@news.com',
        password: 'user123',
        role: 'user'
      });
      console.log('✅ Test user created');
    }

    // Create news articles
    console.log('Creating news articles...');
    const createdNews = [];
    for (const newsItem of sampleNews) {
      const news = await News.create({
        ...newsItem,
        author: admin._id,
        publishedAt: newsItem.status === 'published' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        likes: newsItem.status === 'published' ? [testUser._id] : [],
        likesCount: newsItem.status === 'published' ? 1 : 0
      });
      createdNews.push(news);
    }
    console.log(`✅ Created ${createdNews.length} news articles`);

    // Create comments
    console.log('Creating comments...');
    for (const commentData of sampleComments) {
      await Comment.create({
        content: commentData.content,
        news: createdNews[commentData.newsIndex]._id,
        user: testUser._id
      });
    }
    console.log(`✅ Created ${sampleComments.length} comments`);

    // Add some favorites for test user
    testUser.favorites = createdNews.slice(0, 3).map(n => n._id);
    await testUser.save();
    console.log('✅ Added favorites for test user');

    console.log('\n========================================');
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('========================================\n');
    console.log('Admin Login:');
    console.log('  Email: admin@news.com');
    console.log('  Password: admin123\n');
    console.log('Test User Login:');
    console.log('  Email: user@news.com');
    console.log('  Password: user123\n');
    console.log(`Created: ${createdNews.filter(n => n.status === 'published').length} published articles`);
    console.log(`Created: ${createdNews.filter(n => n.status === 'draft').length} draft articles`);
    console.log(`Created: ${sampleComments.length} comments`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
