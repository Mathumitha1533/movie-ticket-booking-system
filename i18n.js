(function () {
  const TRANSLATIONS = {
    en: {
      'common.home': 'Home', 'common.movies': 'Movies', 'common.login': 'Login', 'common.register': 'Register',
      'common.logout': 'Logout', 'common.myBookings': 'My Bookings', 'common.myProfile': 'My Profile', 'common.back': 'Back',
      
      'home.badge': '🎟️ Now Booking — All Theatres',
      'home.heroTitle1': 'Book Your',
      'home.heroTitleGradient': 'Movie Tickets',
      'home.heroTitle2': 'Quick. Easy. Secure.',
      'home.heroSubtitle': 'Skip the queue. Pick your seats. Watch your favourite blockbusters — from the comfort of your phone.',
      'home.browseMovies': '🎬 Browse Movies',
      'home.createAccount': 'Create Account',
      'home.statMovies': 'Movies', 'home.statTheatres': 'Theatres', 'home.statSecure': 'Secure',
      'home.genreHeading': 'Browse by', 'home.genreHeadingGradient': 'Genre',
      'home.genreSubtitle': 'Find the perfect mood for your movie night',
      'home.nowShowingHeading': 'Now', 'home.nowShowingGradient': 'Showing',
      'home.nowShowingSubtitle': 'Top picks playing in theatres right now',
      'home.seeAll': 'See All Movies →',
      'home.whyHeading': 'Why', 'home.whyHeadingGradient': 'MovieTix', 'home.whyHeadingSuffix': '?',
      'home.whySubtitle': 'Built for the way you watch movies',
      'home.why1Title': 'Instant Booking', 'home.why1Text': 'Pick your movie, seat, and pay in under 60 seconds.',
      'home.why2Title': 'Secure Payments', 'home.why2Text': 'UPI, cards, and net banking with bank-grade encryption.',
      'home.why3Title': 'QR E-Tickets', 'home.why3Text': 'No paper. Just scan the QR code at the entrance.',
      'home.why4Title': 'Easy Refunds', 'home.why4Text': 'Cancel anytime. Get up to 100% back automatically.',
      'home.why5Title': 'Live Seat Map', 'home.why5Text': 'See exactly which seats are free — no guesswork.',
      'home.why6Title': 'Real Reviews', 'home.why6Text': 'Read genuine ratings from verified ticket holders.',
      'home.ctaHeading': 'Ready for the show?',
      'home.ctaSubtitle': 'Join thousands of movie lovers booking with MovieTix every day.',
      'home.ctaButton': '🎬 Start Booking',
      'home.footer': '© 2026 Movie Ticket Booking System. All rights reserved.',

      'auth.loginTitle': 'Welcome Back', 'auth.loginSubtitle': 'Login to book your movie tickets',
      'auth.email': 'Email', 'auth.password': 'Password', 'auth.confirmPassword': 'Confirm Password',
      'auth.fullName': 'Full Name', 'auth.phone': 'Phone Number',
      'auth.loginBtn': 'Login', 'auth.registerBtn': 'Register',
      'auth.noAccount': "Don't have an account?", 'auth.haveAccount': 'Already have an account?',
      'auth.registerHere': 'Register here', 'auth.loginHere': 'Login here',
      'auth.registerTitle': 'Create Account', 'auth.registerSubtitle': 'Register to start booking tickets',

      'movies.title': 'Now Showing 🎥', 'movies.subtitle': 'Browse and book your favourite movies',
      'movies.searchPlaceholder': '🔍 Search movies by title...',
      'movies.allGenres': 'All Genres', 'movies.allLanguages': 'All Languages',
      'movies.bookNow': 'Book Now', 'movies.noResults': '😕 No movies match your search.',

      'details.backToMovies': '← Back to Movies List', 'details.selectDate': 'Select Date & Show Time',
      'details.today': 'Today', 'details.tomorrow': 'Tomorrow', 'details.more': 'More', 'details.dates': 'Dates',
      'details.continueToSeats': 'Continue to Seat Selection →', 'details.noShowSelected': 'No show selected yet',
      'details.reviewsHeading': 'User Reviews ⭐', 'details.noReviews': '💬 No reviews yet. Be the first to review after watching!',

      'seat.available': 'Available', 'seat.recommended': 'Recommended', 'seat.selected': 'Selected', 'seat.booked': 'Booked',
      'seat.noSeats': 'No seats selected', 'seat.total': 'Total:', 'seat.proceed': 'Proceed to Payment →',
      'seat.howMany': 'How many tickets?', 'seat.recommendSubtitle': "We'll recommend the best seats for you",
      'seat.findBest': 'Find Best Seats', 'seat.cancel': 'Cancel', 'seat.selectBest': '✨ Select Best Seats',

      'payment.title': 'Complete Your Payment', 'payment.subtitle': 'Your seats are locked for 5 minutes.',
      'payment.summary': 'Booking Summary', 'payment.movie': 'Movie:', 'payment.theater': 'Theater:',
      'payment.screenTime': 'Screen & Time:', 'payment.seats': 'Seats:', 'payment.subtotal': 'Subtotal:',
      'payment.discount': 'Discount', 'payment.total': 'Total Amount:',
      'payment.availableCoupons': '🎁 Available Coupons', 'payment.clickToApply': 'Click any coupon to auto-apply',
      'payment.haveCoupon': 'Have a coupon code?', 'payment.enterCode': 'Enter code e.g. FIRST50',
      'payment.apply': 'Apply', 'payment.method': 'Payment Method',
      'payment.card': 'Credit / Debit Card', 'payment.upi': 'UPI', 'payment.netbanking': 'Net Banking',
      'payment.payNow': 'Pay Now', 'payment.cardNumber': 'Card Number', 'payment.expiry': 'Expiry Date',
      'payment.cvv': 'CVV', 'payment.cardName': 'Name on Card', 'payment.upiId': 'UPI ID', 'payment.bank': 'Select Bank',

      'confirm.print': '🖨️ Print Ticket', 'confirm.bookAnother': '🎬 Book Another Movie',

      'history.title': 'My Bookings 🎟️', 'history.subtitle': 'All your movie ticket bookings in one place',
      'history.totalBookings': 'Total Bookings', 'history.ticketsBooked': 'Tickets Booked', 'history.totalSpent': 'Total Spent',
      'history.empty': 'No Bookings Yet', 'history.emptySubtitle': "You haven't booked any movie tickets yet.",
      'history.browseMovies': 'Browse Movies', 'history.viewTicket': 'View Ticket', 'history.rateMovie': '⭐ Rate Movie',
      'history.reviewed': '✅ Reviewed', 'history.cancel': '✕ Cancel', 'history.refund': '💸 Refund',

      'profile.title': 'My Profile 👤', 'profile.subtitle': 'Manage your account information', 'profile.memberSince': 'Member since',
      'profile.personalInfo': 'Personal Information', 'profile.saveChanges': 'Save Changes',
      'profile.password': '🔒 Password & Security', 'profile.passwordHint': 'Change your password if you think it may be compromised.',
      'profile.changePassword': 'Change Password', 'profile.updatePassword': 'Update Password', 'profile.cancel': 'Cancel',
      'profile.currentPassword': 'Current Password', 'profile.newPassword': 'New Password', 'profile.confirmNewPassword': 'Confirm New Password'
    },

    ta: {
      'common.home': 'முகப்பு', 'common.movies': 'திரைப்படங்கள்', 'common.login': 'உள்நுழை', 'common.register': 'பதிவு',
      'common.logout': 'வெளியேறு', 'common.myBookings': 'எனது பதிவுகள்', 'common.myProfile': 'எனது சுயவிவரம்', 'common.back': 'முகப்புக்குத் திரும்பு',
      
      'home.badge': '🎟️ இப்போது முன்பதிவு — அனைத்து அரங்குகள்',
      'home.heroTitle1': 'உங்கள்', 'home.heroTitleGradient': 'திரைப்பட டிக்கெட்டுகளை', 'home.heroTitle2': 'விரைவாக. எளிதாக. பாதுகாப்பாக.',
      'home.heroSubtitle': 'வரிசையைத் தவிர்க்கவும். உங்கள் இருக்கைகளைத் தேர்ந்தெடுக்கவும்.',
      'home.browseMovies': '🎬 திரைப்படங்களை பார்க்க', 'home.createAccount': 'கணக்கு உருவாக்கு',
      'home.statMovies': 'திரைப்படங்கள்', 'home.statTheatres': 'திரையரங்குகள்', 'home.statSecure': 'பாதுகாப்பு',
      'home.genreHeading': 'வகைப்படி', 'home.genreHeadingGradient': 'உலாவு',
      'home.genreSubtitle': 'உங்கள் திரைப்பட இரவுக்கு ஏற்றதைத் தேர்ந்தெடுங்கள்',
      'home.nowShowingHeading': 'இப்போது', 'home.nowShowingGradient': 'ஓடுகிறது',
      'home.nowShowingSubtitle': 'தற்போது திரையரங்குகளில் ஓடும் சிறந்த படங்கள்',
      'home.seeAll': 'அனைத்து படங்களையும் பார்க்க →',
      'home.whyHeading': 'ஏன்', 'home.whyHeadingGradient': 'MovieTix', 'home.whyHeadingSuffix': '?',
      'home.whySubtitle': 'நீங்கள் திரைப்படம் பார்க்கும் விதத்திற்காக உருவாக்கப்பட்டது',
      'home.why1Title': 'உடனடி முன்பதிவு', 'home.why1Text': '60 வினாடிகளில் திரைப்படம், இருக்கை, கட்டணம்.',
      'home.why2Title': 'பாதுகாப்பான கட்டணம்', 'home.why2Text': 'UPI, அட்டைகள், நெட் பேங்கிங் வங்கி-தர பாதுகாப்புடன்.',
      'home.why3Title': 'QR மின்-டிக்கெட்டுகள்', 'home.why3Text': 'காகிதம் இல்லை. நுழைவில் QR குறியீட்டை ஸ்கேன் செய்யுங்கள்.',
      'home.why4Title': 'எளிதான பணத் திருப்பம்', 'home.why4Text': 'எப்போது வேண்டுமானாலும் ரத்து செய்யுங்கள். 100% வரை திரும்பப் பெறுங்கள்.',
      'home.why5Title': 'நேரடி இருக்கை வரைபடம்', 'home.why5Text': 'எந்த இருக்கைகள் காலியாக உள்ளன என்பதைப் பாருங்கள்.',
      'home.why6Title': 'உண்மையான விமர்சனங்கள்', 'home.why6Text': 'சரிபார்க்கப்பட்ட டிக்கெட் வைத்திருப்பவர்களின் மதிப்பீடுகள்.',
      'home.ctaHeading': 'நிகழ்ச்சிக்குத் தயாரா?', 'home.ctaSubtitle': 'ஆயிரக்கணக்கான திரைப்பட விரும்பிகள் MovieTix உடன் முன்பதிவு செய்கிறார்கள்.',
      'home.ctaButton': '🎬 முன்பதிவு தொடங்கு', 'home.footer': '© 2026 திரைப்பட டிக்கெட் முன்பதிவு அமைப்பு.',

      'auth.loginTitle': 'மீண்டும் வருக', 'auth.loginSubtitle': 'டிக்கெட்டுகளை முன்பதிவு செய்ய உள்நுழையவும்',
      'auth.email': 'மின்னஞ்சல்', 'auth.password': 'கடவுச்சொல்', 'auth.confirmPassword': 'கடவுச்சொல்லை உறுதிப்படுத்து',
      'auth.fullName': 'முழு பெயர்', 'auth.phone': 'தொலைபேசி எண்',
      'auth.loginBtn': 'உள்நுழை', 'auth.registerBtn': 'பதிவு',
      'auth.noAccount': 'கணக்கு இல்லையா?', 'auth.haveAccount': 'ஏற்கனவே கணக்கு உள்ளதா?',
      'auth.registerHere': 'இங்கே பதிவு செய்யுங்கள்', 'auth.loginHere': 'இங்கே உள்நுழையுங்கள்',
      'auth.registerTitle': 'கணக்கு உருவாக்கு', 'auth.registerSubtitle': 'டிக்கெட்டுகளை முன்பதிவு செய்ய பதிவு செய்யுங்கள்',

      'movies.title': 'இப்போது ஓடுகிறது 🎥', 'movies.subtitle': 'உங்கள் விருப்பமான திரைப்படங்களைப் பார்த்து முன்பதிவு செய்யுங்கள்',
      'movies.searchPlaceholder': '🔍 தலைப்பின் மூலம் தேடுங்கள்...', 'movies.allGenres': 'அனைத்து வகைகள்',
      'movies.allLanguages': 'அனைத்து மொழிகள்', 'movies.bookNow': 'இப்போது முன்பதிவு', 'movies.noResults': '😕 எந்த திரைப்படமும் பொருந்தவில்லை.',

      'details.backToMovies': '← திரைப்படப் பட்டியலுக்குத் திரும்பு', 'details.selectDate': 'தேதி மற்றும் நேரத்தைத் தேர்ந்தெடுக்கவும்',
      'details.today': 'இன்று', 'details.tomorrow': 'நாளை', 'details.more': 'மேலும்', 'details.dates': 'தேதிகள்',
      'details.continueToSeats': 'இருக்கை தேர்வுக்குத் தொடரவும் →', 'details.noShowSelected': 'எந்த நிகழ்ச்சியும் தேர்ந்தெடுக்கப்படவில்லை',
      'details.reviewsHeading': 'பயனர் விமர்சனங்கள் ⭐', 'details.noReviews': '💬 இன்னும் விமர்சனங்கள் இல்லை!',

      'seat.available': 'கிடைக்கிறது', 'seat.recommended': 'பரிந்துரை', 'seat.selected': 'தேர்ந்தெடுக்கப்பட்டது', 'seat.booked': 'முன்பதிவு',
      'seat.noSeats': 'இருக்கைகள் தேர்ந்தெடுக்கப்படவில்லை', 'seat.total': 'மொத்தம்:', 'seat.proceed': 'கட்டணத்திற்குச் செல்லவும் →',
      'seat.howMany': 'எத்தனை டிக்கெட்டுகள்?', 'seat.recommendSubtitle': 'சிறந்த இருக்கைகளைப் பரிந்துரைக்கிறோம்',
      'seat.findBest': 'சிறந்த இருக்கைகளைக் கண்டுபிடி', 'seat.cancel': 'ரத்து', 'seat.selectBest': '✨ சிறந்த இருக்கைகளைத் தேர்ந்தெடு',

      'payment.title': 'உங்கள் கட்டணத்தை முடிக்கவும்', 'payment.subtitle': 'உங்கள் இருக்கைகள் 5 நிமிடங்களுக்கு பூட்டப்பட்டுள்ளன.',
      'payment.summary': 'முன்பதிவு சுருக்கம்', 'payment.movie': 'திரைப்படம்:', 'payment.theater': 'திரையரங்கம்:',
      'payment.screenTime': 'திரை & நேரம்:', 'payment.seats': 'இருக்கைகள்:', 'payment.subtotal': 'துணைத் தொகை:',
      'payment.discount': 'தள்ளுபடி', 'payment.total': 'மொத்த தொகை:',
      'payment.availableCoupons': '🎁 கிடைக்கும் கூப்பன்கள்', 'payment.clickToApply': 'விண்ணப்பிக்க எந்த கூப்பனையும் கிளிக் செய்யவும்',
      'payment.haveCoupon': 'கூப்பன் குறியீடு உள்ளதா?', 'payment.enterCode': 'குறியீட்டை உள்ளிடவும்',
      'payment.apply': 'பயன்படுத்து', 'payment.method': 'கட்டண முறை',
      'payment.card': 'கிரெடிட் / டெபிட் அட்டை', 'payment.upi': 'UPI', 'payment.netbanking': 'நெட் பேங்கிங்',
      'payment.payNow': 'இப்போது செலுத்து', 'payment.cardNumber': 'அட்டை எண்', 'payment.expiry': 'காலாவதி தேதி',
      'payment.cvv': 'CVV', 'payment.cardName': 'அட்டையில் உள்ள பெயர்', 'payment.upiId': 'UPI ஐடி', 'payment.bank': 'வங்கியைத் தேர்ந்தெடுக்கவும்',

      'confirm.print': '🖨️ டிக்கெட்டை அச்சிடு', 'confirm.bookAnother': '🎬 இன்னொரு படத்தை முன்பதிவு செய்',

      'history.title': 'எனது முன்பதிவுகள் 🎟️', 'history.subtitle': 'உங்கள் அனைத்து முன்பதிவுகளும் ஒரே இடத்தில்',
      'history.totalBookings': 'மொத்த முன்பதிவுகள்', 'history.ticketsBooked': 'டிக்கெட்டுகள்', 'history.totalSpent': 'மொத்த செலவு',
      'history.empty': 'முன்பதிவுகள் இல்லை', 'history.emptySubtitle': 'இன்னும் எந்த டிக்கெட்டையும் முன்பதிவு செய்யவில்லை!',
      'history.browseMovies': 'திரைப்படங்களைப் பார்க்க', 'history.viewTicket': 'டிக்கெட்டைப் பார்', 'history.rateMovie': '⭐ மதிப்பிடு',
      'history.reviewed': '✅ மதிப்பிடப்பட்டது', 'history.cancel': '✕ ரத்து', 'history.refund': '💸 பணம் திரும்ப',

      'profile.title': 'எனது சுயவிவரம் 👤', 'profile.subtitle': 'உங்கள் கணக்கு தகவலை நிர்வகிக்கவும்', 'profile.memberSince': 'உறுப்பினர்',
      'profile.personalInfo': 'தனிப்பட்ட தகவல்', 'profile.saveChanges': 'மாற்றங்களைச் சேமி',
      'profile.password': '🔒 கடவுச்சொல் & பாதுகாப்பு', 'profile.passwordHint': 'உங்கள் கடவுச்சொல் பாதிக்கப்பட்டதாக நினைத்தால் மாற்றவும்.',
      'profile.changePassword': 'கடவுச்சொல்லை மாற்று', 'profile.updatePassword': 'கடவுச்சொல்லை புதுப்பி', 'profile.cancel': 'ரத்து',
      'profile.currentPassword': 'தற்போதைய கடவுச்சொல்', 'profile.newPassword': 'புதிய கடவுச்சொல்', 'profile.confirmNewPassword': 'புதிய கடவுச்சொல்லை உறுதிப்படுத்து'
    },

    hi: {
      'common.home': 'होम', 'common.movies': 'फ़िल्में', 'common.login': 'लॉगिन', 'common.register': 'रजिस्टर',
      'common.logout': 'लॉग आउट', 'common.myBookings': 'मेरी बुकिंग', 'common.myProfile': 'मेरी प्रोफ़ाइल', 'common.back': 'होम पर वापस',
      
      'home.badge': '🎟️ अभी बुकिंग — सभी थिएटर',
      'home.heroTitle1': 'अपनी', 'home.heroTitleGradient': 'मूवी टिकट बुक करें', 'home.heroTitle2': 'तेज़. आसान. सुरक्षित.',
      'home.heroSubtitle': 'लाइन छोड़ें। अपनी सीट चुनें। अपने पसंदीदा ब्लॉकबस्टर अपने फ़ोन से देखें।',
      'home.browseMovies': '🎬 फ़िल्में देखें', 'home.createAccount': 'अकाउंट बनाएं',
      'home.statMovies': 'फ़िल्में', 'home.statTheatres': 'थिएटर', 'home.statSecure': 'सुरक्षित',
      'home.genreHeading': 'शैली से', 'home.genreHeadingGradient': 'ब्राउज़ करें',
      'home.genreSubtitle': 'अपनी मूवी नाइट के लिए सही मूड खोजें',
      'home.nowShowingHeading': 'अभी', 'home.nowShowingGradient': 'चल रही हैं',
      'home.nowShowingSubtitle': 'अभी थिएटर में चल रही टॉप फ़िल्में',
      'home.seeAll': 'सभी फ़िल्में देखें →',
      'home.whyHeading': 'क्यों', 'home.whyHeadingGradient': 'MovieTix', 'home.whyHeadingSuffix': '?',
      'home.whySubtitle': 'आप जिस तरह मूवी देखते हैं उसके लिए बनाया गया',
      'home.why1Title': 'तुरंत बुकिंग', 'home.why1Text': '60 सेकंड में मूवी, सीट, और भुगतान।',
      'home.why2Title': 'सुरक्षित भुगतान', 'home.why2Text': 'UPI, कार्ड, और नेट बैंकिंग सुरक्षित एन्क्रिप्शन के साथ।',
      'home.why3Title': 'QR ई-टिकट', 'home.why3Text': 'कोई कागज़ नहीं। प्रवेश द्वार पर QR स्कैन करें।',
      'home.why4Title': 'आसान रिफंड', 'home.why4Text': 'कभी भी रद्द करें। 100% तक वापस पाएं।',
      'home.why5Title': 'लाइव सीट मैप', 'home.why5Text': 'देखें कौन सी सीट खाली है।',
      'home.why6Title': 'असली समीक्षाएँ', 'home.why6Text': 'सत्यापित टिकट धारकों से असली रेटिंग।',
      'home.ctaHeading': 'शो के लिए तैयार?', 'home.ctaSubtitle': 'हर दिन हज़ारों मूवी प्रेमी MovieTix से बुक करते हैं।',
      'home.ctaButton': '🎬 बुकिंग शुरू करें', 'home.footer': '© 2026 मूवी टिकट बुकिंग सिस्टम।',

      'auth.loginTitle': 'वापस स्वागत है', 'auth.loginSubtitle': 'टिकट बुक करने के लिए लॉगिन करें',
      'auth.email': 'ईमेल', 'auth.password': 'पासवर्ड', 'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
      'auth.fullName': 'पूरा नाम', 'auth.phone': 'फ़ोन नंबर',
      'auth.loginBtn': 'लॉगिन', 'auth.registerBtn': 'रजिस्टर',
      'auth.noAccount': 'अकाउंट नहीं है?', 'auth.haveAccount': 'पहले से अकाउंट है?',
      'auth.registerHere': 'यहाँ रजिस्टर करें', 'auth.loginHere': 'यहाँ लॉगिन करें',
      'auth.registerTitle': 'अकाउंट बनाएं', 'auth.registerSubtitle': 'टिकट बुक करना शुरू करने के लिए रजिस्टर करें',

      'movies.title': 'अभी दिखाई जा रही हैं 🎥', 'movies.subtitle': 'अपनी पसंदीदा फ़िल्में ब्राउज़ करें और बुक करें',
      'movies.searchPlaceholder': '🔍 शीर्षक से खोजें...', 'movies.allGenres': 'सभी शैलियाँ',
      'movies.allLanguages': 'सभी भाषाएँ', 'movies.bookNow': 'अभी बुक करें', 'movies.noResults': '😕 कोई फ़िल्म मेल नहीं खाती।',

      'details.backToMovies': '← फ़िल्म सूची पर वापस', 'details.selectDate': 'तारीख और शो का समय चुनें',
      'details.today': 'आज', 'details.tomorrow': 'कल', 'details.more': 'अधिक', 'details.dates': 'तारीखें',
      'details.continueToSeats': 'सीट चयन पर जाएं →', 'details.noShowSelected': 'कोई शो चयनित नहीं',
      'details.reviewsHeading': 'उपयोगकर्ता समीक्षाएँ ⭐', 'details.noReviews': '💬 अभी कोई समीक्षा नहीं!',

      'seat.available': 'उपलब्ध', 'seat.recommended': 'अनुशंसित', 'seat.selected': 'चयनित', 'seat.booked': 'बुक',
      'seat.noSeats': 'कोई सीट चयनित नहीं', 'seat.total': 'कुल:', 'seat.proceed': 'भुगतान पर जाएं →',
      'seat.howMany': 'कितने टिकट?', 'seat.recommendSubtitle': 'हम आपके लिए सर्वोत्तम सीटें सुझाएंगे',
      'seat.findBest': 'सर्वोत्तम सीटें खोजें', 'seat.cancel': 'रद्द करें', 'seat.selectBest': '✨ सर्वोत्तम सीटें चुनें',

      'payment.title': 'अपना भुगतान पूरा करें', 'payment.subtitle': 'आपकी सीटें 5 मिनट के लिए लॉक हैं।',
      'payment.summary': 'बुकिंग सारांश', 'payment.movie': 'फ़िल्म:', 'payment.theater': 'थिएटर:',
      'payment.screenTime': 'स्क्रीन और समय:', 'payment.seats': 'सीटें:', 'payment.subtotal': 'उप-योग:',
      'payment.discount': 'छूट', 'payment.total': 'कुल राशि:',
      'payment.availableCoupons': '🎁 उपलब्ध कूपन', 'payment.clickToApply': 'लागू करने के लिए कोई भी कूपन क्लिक करें',
      'payment.haveCoupon': 'कूपन कोड है?', 'payment.enterCode': 'कोड दर्ज करें',
      'payment.apply': 'लागू करें', 'payment.method': 'भुगतान विधि',
      'payment.card': 'क्रेडिट / डेबिट कार्ड', 'payment.upi': 'UPI', 'payment.netbanking': 'नेट बैंकिंग',
      'payment.payNow': 'अभी भुगतान करें', 'payment.cardNumber': 'कार्ड नंबर', 'payment.expiry': 'समाप्ति तिथि',
      'payment.cvv': 'CVV', 'payment.cardName': 'कार्ड पर नाम', 'payment.upiId': 'UPI आईडी', 'payment.bank': 'बैंक चुनें',

      'confirm.print': '🖨️ टिकट प्रिंट करें', 'confirm.bookAnother': '🎬 और फ़िल्म बुक करें',

      'history.title': 'मेरी बुकिंग 🎟️', 'history.subtitle': 'आपकी सभी मूवी बुकिंग एक जगह',
      'history.totalBookings': 'कुल बुकिंग', 'history.ticketsBooked': 'टिकट', 'history.totalSpent': 'कुल खर्च',
      'history.empty': 'अभी कोई बुकिंग नहीं', 'history.emptySubtitle': 'आपने अभी तक कोई टिकट बुक नहीं किया है!',
      'history.browseMovies': 'फ़िल्में देखें', 'history.viewTicket': 'टिकट देखें', 'history.rateMovie': '⭐ रेट करें',
      'history.reviewed': '✅ समीक्षित', 'history.cancel': '✕ रद्द करें', 'history.refund': '💸 रिफंड',

      'profile.title': 'मेरी प्रोफ़ाइल 👤', 'profile.subtitle': 'अपनी खाता जानकारी प्रबंधित करें', 'profile.memberSince': 'सदस्य',
      'profile.personalInfo': 'व्यक्तिगत जानकारी', 'profile.saveChanges': 'परिवर्तन सहेजें',
      'profile.password': '🔒 पासवर्ड और सुरक्षा', 'profile.passwordHint': 'यदि पासवर्ड से समझौता हुआ है तो इसे बदलें।',
      'profile.changePassword': 'पासवर्ड बदलें', 'profile.updatePassword': 'पासवर्ड अपडेट करें', 'profile.cancel': 'रद्द करें',
      'profile.currentPassword': 'वर्तमान पासवर्ड', 'profile.newPassword': 'नया पासवर्ड', 'profile.confirmNewPassword': 'नए पासवर्ड की पुष्टि करें'
    }
  };

  const LANGUAGES = [
    { code: 'en', short: 'EN', label: 'English' },
    { code: 'ta', short: 'த',  label: 'தமிழ்' },
    { code: 'hi', short: 'हि', label: 'हिन्दी' }
  ];

  function getCurrentLang() {
    return localStorage.getItem('movietix_lang') || 'en';
  }

  function t(key) {
    const lang = getCurrentLang();
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  function applyTranslations() {
    const lang = getCurrentLang();

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const translated = t(key);
      if (el.hasAttribute('data-i18n-placeholder')) {
        el.setAttribute('placeholder', translated);
      } else {
        el.textContent = translated;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(key));
    });

    document.documentElement.setAttribute('lang', lang);

    const switcher = document.getElementById('langSwitcher');
    if (switcher) {
      switcher.querySelectorAll('.lang-option').forEach((opt) => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
      });
      const current = LANGUAGES.find((l) => l.code === lang);
      const labelEl = switcher.querySelector('.lang-current-label');
      if (labelEl && current) labelEl.textContent = current.short;
    }
  }

  function setCurrentLang(code) {
    if (!TRANSLATIONS[code]) return;
    localStorage.setItem('movietix_lang', code);
    applyTranslations();
    setTimeout(applyTranslations, 100);
    setTimeout(applyTranslations, 300);
  }

  window.i18n = {
    t: t,
    setLang: setCurrentLang,
    getLang: getCurrentLang,
    languages: LANGUAGES,
    apply: applyTranslations
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTranslations);
  } else {
    applyTranslations();
  }

  window.addEventListener('load', applyTranslations);

})();