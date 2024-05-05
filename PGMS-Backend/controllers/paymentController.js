const Payment = require('../models/payment');
const Tenant = require("../models/tenantModel");
const setToPaymentRecords = (io) => async (req, res) => {
  try {
    console.log("Attempting to create a new payment record");
    const { tenantId, amount } = req.body;

    const newPayment = new Payment({
      tenantId,
      mode: 'cash',
      amount,
      status: 'pending',
    });

    console.log("New payment:", newPayment);

    await newPayment.save(); // This line might be causing the error

    // Emit a Socket.IO event to notify the owner of a new cash payment request
    io.emit('new_cash_payment', newPayment);

    res.status(201).json({ message: 'Payment request created', payment: newPayment });
  } catch (error) {
    console.error("Error in setToPaymentRecords:", error); // Log detailed error information
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};


const approveCashPayment = (io) => async (req, res) => {
  try {
    console.log("Aagya")
    const { paymentId } = req.body;
    console.log(paymentId)
    const payment = await Payment.findOne({paymentId: paymentId});

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = 'paid';
    await payment.save();

    // Emit a Socket.IO event to update the tenant about the payment approval
    io.emit('cash_payment_approved', payment);

    res.status(200).json({ message: 'Payment approved', payment });
  } catch (error) {
    console.error("hhh")
    console.error("Error in approving payment:", error); // Log detailed error information
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

const getPendingCashPayments = async (req, res) => {
  try {
    const pendingPayments = await Payment.find({ status: 'pending' }); // or other condition to find pending payments
    res.status(200).json(pendingPayments);
  } catch (error) {
    console.error("Error fetching pending cash payments:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getTenantTransactions = async (req, res) => {
  try {
    const { tenantId } = req.params; // Assuming tenantId is passed as a URL parameter

    // Fetch all payments associated with the given tenant ID
    const tenantPayments = await Payment.find({ tenantId });

    // Return the results as a JSON response
    res.status(200).json({
      message: `Transactions for tenant with ID: ${tenantId}`,
      transactions: tenantPayments,
    });
  } catch (error) {
    console.error("Error fetching tenant transactions:", error); // Log detailed error information
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

//getting total expected rent
const getTotalExpectedRent = async (req, res) => {
  const { pgId } = req.params;

  try {
    // Find all tenants with the given pgId who are registered with the PG
    const registeredTenants = await Tenant.Tenant.find({
      pgId: pgId,
      isRegisteredWithPg: true,
    });

    const tenantCount = registeredTenants.length;

    // Calculate the total expected rent
    let totalRent = 0;
    registeredTenants.forEach((tenant) => {
      const rent = parseFloat(tenant.monthlyRent) || 0;
      totalRent += rent;
    });

    // Respond with the total expected rent
    res.status(200).json({
      pgId: pgId,
      totalRent: totalRent,
      totalTenants: tenantCount
    });
  }catch (err) {
    console.error('Error calculating total expected rent:', err);
    res.status(500).json({
      message: 'An error occurred while calculating total expected rent',
      error: err.message,
    });
  }
};

const getPaidRentInfo = async (req, res) => {
  const { pgId } = req.params;
  const { particularMonth } = req.query; // Assuming month-year is provided via query parameter

  try {
    // Find all paid payments with the given pgId and the specified month
    const paidPayments = await Payment.find({
      pgId: pgId,
      status: 'paid',
      rentMonth: particularMonth,
    });

    // Calculate the total paid rent for the specified month and PG
    let totalPaidRent = 0;
    const tenantCount = paidPayments.length;

    paidPayments.forEach((payment) => {
      totalPaidRent += payment.amount;
    });

    // Respond with the total paid rent and the total number of tenants
    res.status(200).json({
      pgId: pgId,
      month: particularMonth,
      totalPaidRent: totalPaidRent,
      totalTenants: tenantCount,
    });
  } catch (error) {
    console.error('Error fetching paid rent info:', error); // Log detailed error information
    res.status(500).json({
      message: 'Internal Server Error',
      error,
    });
  }
};




module.exports = {
  setToPaymentRecords,
  approveCashPayment,
  getPendingCashPayments,
  getTenantTransactions,
  getTotalExpectedRent,
  getPaidRentInfo
};
