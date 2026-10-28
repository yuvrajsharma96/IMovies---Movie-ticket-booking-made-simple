import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  Building,
  ShieldCheck,
  Lock,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Popcorn,
  Plus,
  Minus,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SNACKS = [
  { id: 'snack1', name: 'Caramel & Salted Gourmet Popcorn Large', price: 290, desc: 'Freshly popped jumbo tub' },
  { id: 'snack2', name: 'Nachos with Warm Cheese Dip', price: 240, desc: 'Crispy corn tortilla chips' },
  { id: 'snack3', name: 'Chilled Pepsi 600ml Combo', price: 180, desc: 'Two fountain beverages' },
];

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const stateData = location.state || {};
  const { show, selectedSeats, subtotal = 0, convenienceFee = 45, tax = 18 } = stateData;

  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Snack add-ons
  const [cartSnacks, setCartSnacks] = useState({});

  // Card form state
  const [cardData, setCardData] = useState({
    name: user?.name || '',
    cardNumber: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '888',
  });

  // UPI state
  const [upiId, setUpiId] = useState(`${user?.email?.split('@')[0] || 'customer'}@okhdfcbank`);

  if (!show || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-gray-400">No active checkout session found.</p>
        <button
          onClick={() => navigate('/movies')}
          className="mt-4 px-4 py-2 rounded-xl bg-gray-800 text-rose-400 text-xs font-semibold"
        >
          Browse Movies
        </button>
      </div>
    );
  }

  const handleSnackQty = (snackId, delta) => {
    setCartSnacks((prev) => {
      const current = prev[snackId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [snackId]: next };
    });
  };

  const snacksTotal = SNACKS.reduce((sum, s) => {
    const qty = cartSnacks[s.id] || 0;
    return sum + s.price * qty;
  }, 0);

  const grandTotal = subtotal + convenienceFee + tax + snacksTotal;

  const handlePayNow = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Process payment authorization
      const payRes = await api.post('/payments/process', {
        amount: grandTotal,
        paymentMethod,
        paymentDetails: {
          cardNumber: cardData.cardNumber,
          upiId,
        },
      });

      if (!payRes.data.success) {
        throw new Error(payRes.data.message || 'Payment authorization failed');
      }

      // 2. Prepare F&B list
      const foodItems = [];
      SNACKS.forEach((s) => {
        if (cartSnacks[s.id] > 0) {
          foodItems.push({
            name: s.name,
            quantity: cartSnacks[s.id],
            price: s.price,
          });
        }
      });

      // 3. Confirm booking
      const bookingRes = await api.post('/bookings', {
        showId: show._id,
        seats: selectedSeats,
        subtotal,
        convenienceFee,
        tax,
        totalAmount: grandTotal,
        paymentMethod,
        paymentId: payRes.data.paymentData?.transactionId,
        foodAndBeverages: foodItems,
      });

      if (bookingRes.data.success) {
        navigate(`/confirmation/${bookingRes.data.booking._id}`, {
          state: { booking: bookingRes.data.booking },
        });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg(
        err.response?.data?.message || err.message || 'Payment processing failed. Please check details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Seat Selection
        </button>

        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
          Order Summary & Payment Gateway
        </h1>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Order Breakdown & Snacks */}
          <div className="lg:col-span-7 space-y-6">
            {/* Show Details Card */}
            <div className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800 space-y-4">
              <div className="flex gap-4">
                <img
                  src={show.movieId?.posterUrl}
                  alt={show.movieId?.title}
                  className="w-20 h-28 rounded-xl object-cover border border-gray-800 shadow"
                />
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-[10px] font-bold text-white uppercase">
                    {show.screenType || 'IMAX'}
                  </span>
                  <h3 className="text-lg font-bold text-white font-heading">
                    {show.movieId?.title}
                  </h3>
                  <p className="text-xs text-gray-400">{show.theatreId?.name}</p>
                  <p className="text-xs text-rose-400 font-medium">
                    {show.showDate} • {show.showTime}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-400">Reserved Seats ({selectedSeats.length}):</span>
                <span className="font-bold text-white">
                  {selectedSeats.map((s) => s.seatNumber).join(', ')}
                </span>
              </div>
            </div>

            {/* Food & Beverage Add-ons */}
            <div className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800 space-y-4">
              <div className="flex items-center gap-2">
                <Popcorn className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Add Gourmet Movie Snacks</h3>
              </div>

              <div className="space-y-3">
                {SNACKS.map((snack) => {
                  const qty = cartSnacks[snack.id] || 0;
                  return (
                    <div
                      key={snack.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 border border-gray-800 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white">{snack.name}</p>
                        <p className="text-[11px] text-gray-400">{snack.desc} • ₹{snack.price}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {qty > 0 && (
                          <button
                            type="button"
                            onClick={() => handleSnackQty(snack.id, -1)}
                            className="w-6 h-6 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        )}
                        {qty > 0 && (
                          <span className="font-bold text-white w-4 text-center">{qty}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSnackQty(snack.id, 1)}
                          className="w-6 h-6 rounded-md bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Itemized Price Summary */}
            <div className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800 space-y-3 text-xs">
              <h3 className="font-bold text-white text-sm pb-2 border-b border-gray-800">
                Payment Breakdown
              </h3>
              <div className="flex justify-between text-gray-400">
                <span>Seat Subtotal ({selectedSeats.length} Tickets)</span>
                <span className="text-white font-medium">₹{subtotal}</span>
              </div>
              {snacksTotal > 0 && (
                <div className="flex justify-between text-gray-400">
                  <span>Food & Beverage Add-ons</span>
                  <span className="text-white font-medium">₹{snacksTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Convenience Fee</span>
                <span className="text-white font-medium">₹{convenienceFee}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Integrated GST (18%)</span>
                <span className="text-white font-medium">₹{tax}</span>
              </div>
              <div className="pt-3 border-t border-gray-800 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Grand Total Amount</span>
                <span className="text-xl font-black text-rose-500">₹{grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Methods & Action */}
          <div className="lg:col-span-5 bg-gray-900/80 rounded-2xl p-6 border border-gray-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Choose Payment Method
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Simulated 256-bit encrypted checkout gateway
              </p>
            </div>

            {/* Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Card', label: 'Card', icon: CreditCard },
                { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                { id: 'Net Banking', label: 'NetBank', icon: Building },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = paymentMethod === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPaymentMethod(tab.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                        : 'bg-gray-950 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Method Form */}
            <form onSubmit={handlePayNow} className="space-y-4">
              {paymentMethod === 'Card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      required
                      className="w-full bg-gray-950 text-xs text-white rounded-xl px-3 py-2.5 border border-gray-800 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      required
                      className="w-full bg-gray-950 text-xs text-white rounded-xl px-3 py-2.5 border border-gray-800 focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        required
                        className="w-full bg-gray-950 text-xs text-white rounded-xl px-3 py-2.5 border border-gray-800 focus:outline-none focus:border-rose-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength="4"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        required
                        className="w-full bg-gray-950 text-xs text-white rounded-xl px-3 py-2.5 border border-gray-800 focus:outline-none focus:border-rose-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Virtual Payment Address (UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                      className="w-full bg-gray-950 text-xs text-white rounded-xl px-3 py-2.5 border border-gray-800 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-center space-y-1">
                    <span className="text-[11px] text-gray-400">Supported Apps:</span>
                    <div className="flex items-center justify-center gap-3 text-xs font-semibold text-gray-300 pt-1">
                      <span className="text-blue-400">Google Pay</span>
                      <span>•</span>
                      <span className="text-purple-400">PhonePe</span>
                      <span>•</span>
                      <span className="text-cyan-400">Paytm</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Net Banking' && (
                <div className="space-y-3">
                  <label className="block text-[11px] font-semibold text-gray-400">
                    Select Bank
                  </label>
                  <select className="w-full bg-gray-950 text-xs text-white rounded-xl px-3 py-2.5 border border-gray-800 focus:outline-none focus:border-rose-500">
                    <option>HDFC Bank Retail</option>
                    <option>ICICI Bank Internet Banking</option>
                    <option>State Bank of India (SBI)</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-950/50 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{grandTotal} & Confirm</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Simulated Sandbox • 100% Secure Checkout</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
