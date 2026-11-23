document.addEventListener('DOMContentLoaded', () => {
  const bookingDetails = JSON.parse(localStorage.getItem('movietix_bookingDetails'));
  if (!bookingDetails) { alert('No booking details found. Please select seats first.'); window.location.href = 'movies.html'; return; }

  const AVAILABLE_COUPONS = [
    { code: 'FIRST50', title: '50% OFF on your first booking', description: 'New users only. Max discount ₹150.', percent: 50, maxDiscount: 150, minAmount: 0 },
    { code: 'MOVIE20', title: '20% OFF on all movies', description: 'No minimum. Max discount ₹100.', percent: 20, maxDiscount: 100, minAmount: 0 },
    { code: 'WEEKEND100', title: 'Flat ₹100 OFF', description: 'Valid on bookings above ₹400.', percent: 100, maxDiscount: 100, minAmount: 400, isFlat: true, flatAmount: 100 },
    { code: 'UPI10', title: '10% OFF when you pay via UPI', description: 'Pay using UPI and save up to ₹80.', percent: 10, maxDiscount: 80, minAmount: 0 }
  ];

  let appliedCoupon = null; 
  let discount = 0; 
  let parkingCost = 0;
  let snacksCost = 0;
  let parkingSelected = false;
  let snacksSelected = [];

  const baseSubtotal = bookingDetails.totalAmount;

  function updateTotals() {
    // 1. Calculate Extras
    parkingCost = document.getElementById('parkingCheckbox').checked ? 100 : 0;
    parkingSelected = document.getElementById('parkingCheckbox').checked;

    snacksCost = 0;
    snacksSelected = [];
    document.querySelectorAll('.snack-qty').forEach(input => {
      const qty = parseInt(input.value, 10) || 0;
      if (qty > 0) {
        const price = parseInt(input.dataset.price, 10);
        snacksCost += (qty * price);
        snacksSelected.push({ name: input.dataset.name, qty: qty, price: price });
      }
    });

    // 2. Update Summary UI
    const currentSubtotal = baseSubtotal + parkingCost + snacksCost;
    document.getElementById('summarySubtotal').textContent = `₹${currentSubtotal}`;
    
    if (parkingSelected) document.getElementById('parkingSummaryRow').style.display = 'flex';
    else document.getElementById('parkingSummaryRow').style.display = 'none';

    if (snacksCost > 0) {
      document.getElementById('snacksSummaryRow').style.display = 'flex';
      document.getElementById('summarySnacks').textContent = `₹${snacksCost}`;
    } else {
      document.getElementById('snacksSummaryRow').style.display = 'none';
    }

    // 3. Apply Coupon if exists
    if (appliedCoupon) {
      const result = calculateDiscount(appliedCoupon, currentSubtotal);
      if (result.ok) {
        discount = result.amount;
        document.getElementById('summaryDiscount').textContent = `-₹${discount}`;
        document.getElementById('summaryTotal').textContent = `₹${currentSubtotal - discount}`;
      } else {
        document.getElementById('summaryTotal').textContent = `₹${currentSubtotal - discount}`;
      }
    } else {
      document.getElementById('summaryTotal').textContent = `₹${currentSubtotal}`;
    }
  }

  document.getElementById('parkingCheckbox').addEventListener('change', updateTotals);
  document.querySelectorAll('.snack-qty').forEach(input => { input.addEventListener('input', updateTotals); });

  document.getElementById('summaryMovie').textContent = bookingDetails.movieTitle;
  document.getElementById('summaryTheater').textContent = bookingDetails.theaterName;
  document.getElementById('summaryScreenTime').textContent = `${bookingDetails.screenName} • ${bookingDetails.time}`;
  document.getElementById('summarySeats').textContent = bookingDetails.seats.join(', ');
  
  const couponsList = document.getElementById('couponsList');
  AVAILABLE_COUPONS.forEach((coupon) => {
    const card = document.createElement('div'); card.className = 'coupon-tile'; card.dataset.code = coupon.code;
    card.innerHTML = `
      <div class="coupon-left"><div class="coupon-code">${coupon.code}</div><div class="coupon-percent">${coupon.isFlat ? `₹${coupon.flatAmount} OFF` : `${coupon.percent}% OFF`}</div></div>
      <div class="coupon-right"><div class="coupon-title">${coupon.title}</div><div class="coupon-desc">${coupon.description}</div></div>
      <div class="coupon-arrow">→</div>
    `;
    card.addEventListener('click', () => { document.getElementById('couponInput').value = coupon.code; applyCoupon(coupon.code); });
    couponsList.appendChild(card);
  });

  const couponInput = document.getElementById('couponInput');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponMessage = document.getElementById('couponMessage');
  const discountRow = document.getElementById('discountRow');

  function findCoupon(code) { return AVAILABLE_COUPONS.find((c) => c.code === code.trim().toUpperCase()); }
  function calculateDiscount(coupon, currentSubtotal) {
    if (currentSubtotal < coupon.minAmount) return { ok: false, reason: `Minimum order ₹${coupon.minAmount} required.` };
    let amt = 0;
    if (coupon.isFlat) amt = coupon.flatAmount;
    else { amt = Math.round((currentSubtotal * coupon.percent) / 100); if (amt > coupon.maxDiscount) amt = coupon.maxDiscount; }
    return { ok: true, amount: amt };
  }

  function applyCoupon(code) {
    const coupon = findCoupon(code);
    if (!coupon) { couponMessage.textContent = '❌ Invalid coupon code.'; couponMessage.className = 'coupon-message error'; return; }
    const currentSubtotal = baseSubtotal + parkingCost + snacksCost;
    const result = calculateDiscount(coupon, currentSubtotal);
    if (!result.ok) { couponMessage.textContent = `⚠️ ${result.reason}`; couponMessage.className = 'coupon-message warning'; return; }
    appliedCoupon = coupon; discount = result.amount;
    couponMessage.textContent = `✅ ${coupon.code} applied — you save ₹${discount}`;
    couponMessage.className = 'coupon-message success';
    discountRow.style.display = 'flex'; 
    document.querySelectorAll('.coupon-tile').forEach((t) => t.classList.remove('applied'));
    const tile = document.querySelector(`.coupon-tile[data-code="${coupon.code}"]`); if (tile) tile.classList.add('applied');
    updateTotals();
  }

  applyCouponBtn.addEventListener('click', () => { const code = couponInput.value.trim(); if (!code) { couponMessage.textContent = '⚠️ Please enter a coupon code.'; couponMessage.className = 'coupon-message warning'; return; } applyCoupon(code); });
  couponInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); applyCouponBtn.click(); } });

  const methodRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const cardDetails = document.getElementById('cardDetails');
  const upiDetails = document.getElementById('upiDetails');
  const netbankingDetails = document.getElementById('netbankingDetails');
  methodRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      cardDetails.style.display = 'none'; upiDetails.style.display = 'none'; netbankingDetails.style.display = 'none';
      if (radio.value === 'card') cardDetails.style.display = 'block';
      if (radio.value === 'upi') upiDetails.style.display = 'block';
      if (radio.value === 'netbanking') netbankingDetails.style.display = 'block';
    });
  });

  const paymentForm = document.getElementById('paymentForm');
  const payBtn = document.getElementById('payBtn');
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    if (selectedMethod === 'card') { const cardNumber = document.getElementById('cardNumber').value.trim(); if (cardNumber.length < 16) { alert('Please enter a valid 16-digit card number.'); return; } }
    else if (selectedMethod === 'upi') { const upiId = document.getElementById('upiId').value.trim(); if (!upiId.includes('@')) { alert('Please enter a valid UPI ID.'); return; } }
    else if (selectedMethod === 'netbanking') { const bank = document.getElementById('bankSelect').value; if (!bank) { alert('Please select a bank.'); return; } }

    payBtn.textContent = 'Processing Payment...'; payBtn.disabled = true;
    setTimeout(() => {
      const bookingId = 'B' + Date.now().toString().slice(-8);
      const currentUser = JSON.parse(localStorage.getItem('movietix_currentUser'));
      const currentSubtotal = baseSubtotal + parkingCost + snacksCost;

      const finalBooking = {
        ...bookingDetails, 
        userEmail: currentUser ? currentUser.email : null, 
        userName: currentUser ? currentUser.name : null,
        bookingId: bookingId, 
        paymentMethod: selectedMethod, 
        bookingStatus: 'Confirmed', 
        bookedAt: new Date().toISOString(),
        subtotal: currentSubtotal, 
        couponCode: appliedCoupon ? appliedCoupon.code : null, 
        discountAmount: discount, 
        totalAmount: currentSubtotal - discount,
        parking: parkingSelected,
        parkingCost: parkingCost,
        snacks: snacksSelected,
        snacksCost: snacksCost
      };

      const existingBookings = JSON.parse(localStorage.getItem('movietix_bookings')) || [];
      existingBookings.push(finalBooking); localStorage.setItem('movietix_bookings', JSON.stringify(existingBookings));

      const showKey = bookingDetails.showKey;
      if (showKey) {
        const bookedMap = JSON.parse(localStorage.getItem('movietix_bookedSeats')) || {};
        const existing = new Set(bookedMap[showKey] || []);
        bookingDetails.seats.forEach((s) => existing.add(s));
        bookedMap[showKey] = Array.from(existing); localStorage.setItem('movietix_bookedSeats', JSON.stringify(bookedMap));
      }
      localStorage.removeItem('movietix_selectedShow'); localStorage.removeItem('movietix_bookingDetails');
      window.location.href = `booking-confirmation.html?id=${bookingId}`;
    }, 2000);
  });
  
  updateTotals();
});