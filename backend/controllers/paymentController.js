// @desc    Process simulated payment transaction
// @route   POST /api/payments/process
// @access  Private
exports.processPayment = async (req, res, next) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid transaction amount is required.',
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required (Card, UPI, Net Banking).',
      });
    }

    // Simulate realistic gateway authorization delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulated test failure condition (if test amount is 99999 or card ends in 0000)
    if (paymentDetails && paymentDetails.cardNumber && paymentDetails.cardNumber.endsWith('0000')) {
      return res.status(400).json({
        success: false,
        message: 'Transaction declined by issuer: Insufficient test funds or invalid card.',
      });
    }

    const transactionId = 'TXN_' + Math.random().toString(36).substring(2, 12).toUpperCase();
    const bankAuthCode = 'AUTH_' + Math.floor(100000 + Math.random() * 900000);

    res.status(200).json({
      success: true,
      status: 'COMPLETED',
      message: 'Payment authorized and processed successfully.',
      paymentData: {
        transactionId,
        bankAuthCode,
        amount,
        currency: 'INR',
        paymentMethod,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};
