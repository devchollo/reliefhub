// scripts/seedDatabase.js
// Run with: node scripts/seedDatabase.js

const mongoose = require('mongoose');
const User = require('../models/User');
const Request = require('../models/Request');
const Donation = require('../models/Donation');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data (BE CAREFUL IN PRODUCTION!)
    await User.deleteMany({});
    await Request.deleteMany({});
    await Donation.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@reliefhub.com',
      phone: '+639123456789',
      password: 'Admin123!',
      userType: 'individual',
      isEmailVerified: true,
      isPhoneVerified: true,
      isAdmin: true,
      totalDonations: 0,
      totalDonationAmount: 0
    });
    console.log('👤 Created admin user');

    // Create Sample Users
    const users = await User.create([
      {
        name: 'Maria Garcia',
        email: 'maria@example.com',
        phone: '+639111111111',
        password: 'Password123!',
        userType: 'individual',
        isEmailVerified: true,
        isPhoneVerified: true,
        totalDonations: 23,
        totalDonationAmount: 45000,
        badges: [
          { name: 'Helper', earnedAt: new Date(), type: 'helper' },
          { name: 'Bronze Supporter', earnedAt: new Date(), type: 'bronze' }
        ]
      },
      {
        name: 'Tacloban Lions Club',
        email: 'lions@example.com',
        phone: '+639222222222',
        password: 'Password123!',
        userType: 'organization',
        isEmailVerified: true,
        isPhoneVerified: true,
        totalDonations: 15,
        totalDonationAmount: 125000,
        badges: [
          { name: 'Helper', earnedAt: new Date(), type: 'helper' },
          { name: 'Platinum Supporter', earnedAt: new Date(), type: 'platinum' }
        ]
      },
      {
        name: 'SM Savemore',
        email: 'sm@example.com',
        phone: '+639333333333',
        password: 'Password123!',
        userType: 'company',
        isEmailVerified: true,
        isPhoneVerified: true,
        totalDonations: 5,
        totalDonationAmount: 150000,
        badges: [
          { name: 'Platinum Supporter', earnedAt: new Date(), type: 'platinum' }
        ]
      },
      {
        name: 'Barangay 54 LGU',
        email: 'brgy54@example.com',
        phone: '+639444444444',
        password: 'Password123!',
        userType: 'government',
        isEmailVerified: true,
        isPhoneVerified: true,
        totalDonations: 8,
        totalDonationAmount: 89000,
        badges: [
          { name: 'Helper', earnedAt: new Date(), type: 'helper' },
          { name: 'Gold Supporter', earnedAt: new Date(), type: 'gold' }
        ]
      }
    ]);
    console.log(`👥 Created ${users.length} sample users`);

    // Create Sample Requests
    const requests = await Request.create([
      {
        name: 'Maria Santos',
        phone: '+639555555555',
        email: 'maria.santos@example.com',
        type: 'food',
        message: 'Family of 5 needs food supplies. Lost everything in the recent typhoon. Any help would be greatly appreciated.',
        location: {
          type: 'Point',
          coordinates: [125.0040, 11.2440] // Tacloban area
        },
        address: 'Barangay 60, Tacloban City',
        status: 'pending',
        priority: 'high',
        isVerified: true,
        verifiedBy: admin._id,
        verifiedAt: new Date()
      },
      {
        name: 'Juan Dela Cruz',
        phone: '+639666666666',
        email: 'juan@example.com',
        type: 'medical',
        message: 'Urgent: Need medicine for elderly mother with diabetes and hypertension. Unable to access pharmacy due to flooding.',
        location: {
          type: 'Point',
          coordinates: [125.0100, 11.2500]
        },
        address: 'Barangay 77, Tacloban City',
        status: 'in-progress',
        priority: 'urgent',
        isVerified: true,
        verifiedBy: admin._id,
        verifiedAt: new Date(),
        helpers: [
          {
            user: users[0]._id,
            helpedAt: new Date(),
            notes: 'Delivered basic medicines'
          }
        ]
      },
      {
        name: 'Rodriguez Family',
        phone: '+639777777777',
        type: 'shelter',
        message: 'House destroyed by typhoon. Need temporary shelter for 7 people including 3 children. Currently staying at evacuation center.',
        location: {
          type: 'Point',
          coordinates: [124.9980, 11.2380]
        },
        address: 'Barangay 88, Tacloban City',
        status: 'pending',
        priority: 'high',
        isVerified: true,
        verifiedBy: admin._id,
        verifiedAt: new Date()
      },
      {
        name: 'Ana Reyes',
        phone: '+639888888888',
        email: 'ana@example.com',
        type: 'money',
        message: 'Need financial help to rebuild small sari-sari store that was destroyed. This is our only source of income.',
        location: {
          type: 'Point',
          coordinates: [125.0060, 11.2460]
        },
        address: 'Barangay 45, Tacloban City',
        status: 'pending',
        priority: 'medium',
        isVerified: true,
        verifiedBy: admin._id,
        verifiedAt: new Date(),
        gcashNumber: '+639888888888',
        gcashVerified: true,
        totalReceived: 15000,
        donationGoal: 50000
      },
      {
        name: 'Pedro Martinez',
        phone: '+639999999999',
        type: 'water',
        message: 'Community water source contaminated. Need clean drinking water for approximately 50 families.',
        location: {
          type: 'Point',
          coordinates: [125.0020, 11.2420]
        },
        address: 'Barangay 33, Tacloban City',
        status: 'pending',
        priority: 'urgent',
        isVerified: true,
        verifiedBy: admin._id,
        verifiedAt: new Date()
      },
      {
        name: 'Santos Family',
        phone: '+639101010101',
        type: 'clothing',
        message: 'Family of 6 lost all belongings. Need clothes especially for children ages 5, 7, and 10.',
        location: {
          type: 'Point',
          coordinates: [125.0080, 11.2480]
        },
        address: 'Barangay 22, Tacloban City',
        status: 'in-progress',
        priority: 'medium',
        isVerified: true,
        verifiedBy: admin._id,
        verifiedAt: new Date(),
        helpers: [
          {
            user: users[1]._id,
            helpedAt: new Date(),
            notes: 'Donated clothes for children'
          }
        ]
      },
      {
        name: 'Community Center',
        phone: '+639202020202',
        email: 'center@example.com',
        type: 'other',
        message: 'Evacuation center needs basic supplies: mats, blankets, toiletries for 100+ evacuees.',
        location: {
          type: 'Point',
          coordinates: [125.0050, 11.2450]
        },
        address: 'Barangay 15 Covered Court, Tacloban City',
        status: 'pending',
        priority: 'high',
        isVerified: true,
        verifiedBy: admin._id,
        verifiedAt: new Date()
      },
      {
        name: 'Elderly Care Home',
        phone: '+639303030303',
        type: 'medical',
        message: 'Senior citizens home needs medications and medical supplies for 30 residents.',
        location: {
          type: 'Point',
          coordinates: [125.0030, 11.2430]
        },
        address: 'Barangay 50, Tacloban City',
        status: 'fulfilled',
        priority: 'high',
        isVerified: true,
        verifiedBy: admin._id,
        verifiedAt: new Date(),
        helpers: [
          {
            user: users[2]._id,
            helpedAt: new Date(),
            notes: 'Delivered medical supplies and medicines'
          },
          {
            user: users[3]._id,
            helpedAt: new Date(),
            notes: 'Provided additional first aid kits'
          }
        ]
      }
    ]);
    console.log(`📍 Created ${requests.length} sample requests`);

    // Create Sample Donations
    const donations = await Donation.create([
      {
        donor: users[0]._id,
        request: requests[3]._id, // Ana Reyes money request
        amount: 5000,
        paymentMethod: 'gcash',
        paymentStatus: 'completed',
        transactionId: 'GC123456789',
        gcashReferenceNumber: 'GC123456789',
        processingFee: 125,
        platformFee: 125,
        netAmount: 4750,
        isRecurring: false
      },
      {
        donor: users[1]._id,
        request: requests[3]._id,
        amount: 10000,
        paymentMethod: 'stripe',
        paymentStatus: 'completed',
        transactionId: 'pi_123456789',
        stripePaymentIntentId: 'pi_123456789',
        processingFee: 250,
        platformFee: 250,
        netAmount: 9500,
        isRecurring: false
      },
      {
        donor: users[2]._id,
        request: requests[3]._id,
        amount: 25000,
        paymentMethod: 'stripe',
        paymentStatus: 'completed',
        transactionId: 'pi_987654321',
        stripePaymentIntentId: 'pi_987654321',
        processingFee: 625,
        platformFee: 625,
        netAmount: 23750,
        isRecurring: false
      },
      {
        donor: users[0]._id,
        request: requests[1]._id, // Juan medical
        amount: 2000,
        paymentMethod: 'gcash',
        paymentStatus: 'completed',
        transactionId: 'GC987654321',
        gcashReferenceNumber: 'GC987654321',
        processingFee: 50,
        platformFee: 50,
        netAmount: 1900,
        isRecurring: false
      },
      {
        donor: users[3]._id,
        request: requests[0]._id, // Maria food
        amount: 3000,
        paymentMethod: 'stripe',
        paymentStatus: 'completed',
        transactionId: 'pi_555555555',
        stripePaymentIntentId: 'pi_555555555',
        processingFee: 75,
        platformFee: 75,
        netAmount: 2850,
        isRecurring: false,
        notes: 'For food supplies'
      }
    ]);
    console.log(`💰 Created ${donations.length} sample donations`);

    // Update request totals
    await Request.findByIdAndUpdate(requests[3]._id, {
      totalReceived: 5000 + 10000 + 25000
    });

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Admin user: admin@reliefhub.com (password: Admin123!)`);
    console.log(`   - Sample users: ${users.length}`);
    console.log(`   - Relief requests: ${requests.length}`);
    console.log(`   - Donations: ${donations.length}`);
    console.log('\n🔐 Test Accounts:');
    console.log('   Email: maria@example.com | Password: Password123!');
    console.log('   Email: lions@example.com | Password: Password123!');
    console.log('   Email: sm@example.com | Password: Password123!');
    console.log('   Email: brgy54@example.com | Password: Password123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();