const mongoose = require('mongoose');
const Booking = require('../models/booking'); // Adjust paths to your schema files
const Inspection = require('../models/inspection');
const Payment = require('../models/payment');

async function insertDummyData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/car_rental_system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to the database");

    // Dummy IDs (replace with actual ObjectIDs from your collections)
    const dummyUserId = new mongoose.Types.ObjectId();
    const dummyCarId = new mongoose.Types.ObjectId();
    const dummyBranchId1 = new mongoose.Types.ObjectId();
    const dummyBranchId2 = new mongoose.Types.ObjectId();
    const dummyBookingId = new mongoose.Types.ObjectId();

    // Insert a Booking
    const booking = await Booking.create({
      customer: dummyUserId,
      car: dummyCarId,
      pickupBranch: dummyBranchId1,
      returnBranch: dummyBranchId2,
      startDate: new Date('2024-12-10'),
      endDate: new Date('2024-12-15'),
      status: 'confirmed',
      totalAmount: 500,
      paymentStatus: 'paid',
      paymentIntent: {
        stripePaymentIntentId: 'pi_dummyStripeId',
        paypalOrderId: 'dummyPaypalId',
        amount: 500,
        status: 'succeeded',
        createdAt: new Date(),
      },
    });

    console.log('Inserted Booking:', booking);

    // Insert an Inspection
    const inspection = await Inspection.create({
      booking: booking._id,
      inspector: dummyUserId,
      type: 'pre-rental',
      condition: {
        exterior: 'Good',
        interior: 'Clean',
        mileage: 12000,
        fuelLevel: 90,
        damages: ['Minor scratch on front bumper'],
      },
      notes: 'Car is in good condition overall.',
      images: ['image1.jpg', 'image2.jpg'],
    });

    console.log('Inserted Inspection:', inspection);

    // Insert a Payment
    const payment = await Payment.create({
      booking: booking._id,
      amount: 500,
      paymentMethod: 'stripe',
      stripePaymentIntentId: 'pi_dummyStripeId',
      currency: 'USD',
      status: 'completed',
      paymentDetails: {
        last4: '1234',
        brand: 'Visa',
        email: 'customer@example.com',
      },
      metadata: {
        customNote: 'First rental payment',
      },
      refundDetails: [],
      paidBy: dummyUserId,
    });

    console.log('Inserted Payment:', payment);
  } catch (error) {
    console.error("Error inserting dummy data:", error);
  } finally {
    mongoose.connection.close();
  }
}

insertDummyData();
