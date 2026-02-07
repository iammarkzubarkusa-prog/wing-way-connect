// Mock data for WACC website

export const cities = {
  canada: [
    { value: "toronto", label: "Toronto, ON", code: "YYZ" },
    { value: "montreal", label: "Montreal, QC", code: "YUL" },
    { value: "vancouver", label: "Vancouver, BC", code: "YVR" },
    { value: "calgary", label: "Calgary, AB", code: "YYC" },
    { value: "ottawa", label: "Ottawa, ON", code: "YOW" },
    { value: "mississauga", label: "Mississauga, ON", code: "" },
  ],
  bangladesh: [
    { value: "dhaka", label: "Dhaka", code: "DAC" },
    { value: "chittagong", label: "Chittagong", code: "CGP" },
    { value: "sylhet", label: "Sylhet", code: "ZYL" },
    { value: "khulna", label: "Khulna", code: "" },
    { value: "rajshahi", label: "Rajshahi", code: "" },
    { value: "barisal", label: "Barisal", code: "" },
  ],
};

export const cargoTypes = [
  { value: "document", label: "Document/Envelope" },
  { value: "personal", label: "Personal Package/Gift" },
  { value: "commercial", label: "Commercial Goods" },
  { value: "heavy", label: "Heavy Cargo" },
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing/Textiles" },
  { value: "food", label: "Food Items (non-perishable)" },
  { value: "other", label: "Other" },
];

export const serviceTypes = [
  { value: "standard", label: "Standard Shipping", days: "5-7 days", multiplier: 1 },
  { value: "express", label: "Express Shipping", days: "3-4 days", multiplier: 1.5 },
  { value: "priority", label: "Priority Shipping", days: "2-3 days", multiplier: 2 },
];

// Pricing per kg based on route
export const shippingRates = {
  "bd-to-ca": { base: 15, perKg: 12 },
  "ca-to-bd": { base: 12, perKg: 10 },
};

export const calculateShippingCost = (
  weight: number,
  route: "bd-to-ca" | "ca-to-bd",
  serviceType: "standard" | "express" | "priority",
  insurance: boolean = false,
  fragile: boolean = false
): { base: number; weight: number; service: number; insurance: number; fragile: number; total: number } => {
  const rates = shippingRates[route];
  const service = serviceTypes.find((s) => s.value === serviceType);
  const multiplier = service?.multiplier || 1;

  const baseCost = rates.base;
  const weightCost = weight * rates.perKg;
  const serviceCost = (baseCost + weightCost) * (multiplier - 1);
  const insuranceCost = insurance ? Math.max(10, (baseCost + weightCost) * 0.05) : 0;
  const fragileCost = fragile ? 8 : 0;

  return {
    base: baseCost,
    weight: weightCost,
    service: serviceCost,
    insurance: insuranceCost,
    fragile: fragileCost,
    total: baseCost + weightCost + serviceCost + insuranceCost + fragileCost,
  };
};

export interface TrackingEvent {
  status: string;
  label: string;
  date?: string;
  location?: string;
  description?: string;
  completed: boolean;
  current?: boolean;
}

export interface CargoTracking {
  type: "cargo";
  trackingId: string;
  cargoType: string;
  weight: string;
  packages: number;
  from: string;
  to: string;
  bookedDate: string;
  estimatedDelivery: string;
  deliveredDate?: string;
  sender: string;
  receiver: string;
  contact: string;
  amount: string;
  currentStatus: string;
  timeline: TrackingEvent[];
}

export interface FlightTracking {
  type: "flight";
  bookingRef: string;
  pnr: string;
  status: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  class: string;
  passengers: { name: string; ticketNo: string }[];
  totalAmount: string;
}

export type TrackingData = CargoTracking | FlightTracking;

export const mockTrackingData: Record<string, TrackingData> = {
  "WC-SH-10245": {
    type: "cargo",
    trackingId: "WC-SH-10245",
    cargoType: "Personal Package",
    weight: "8.5 kg",
    packages: 2,
    from: "Toronto, Canada",
    to: "Dhaka, Bangladesh",
    bookedDate: "Feb 05, 2026 10:00 AM",
    estimatedDelivery: "Feb 12, 2026",
    sender: "Mohammad Ali",
    receiver: "Fatima Begum",
    contact: "+8801XXXXXXXXX",
    amount: "$125",
    currentStatus: "arrived_bangladesh",
    timeline: [
      { status: "booked", label: "Booking Confirmed", date: "Feb 05, 2026 10:00 AM", location: "Online", description: "Your shipment has been booked", completed: true },
      { status: "picked_up", label: "Picked Up", date: "Feb 05, 2026 3:30 PM", location: "Toronto, Canada", description: "Package collected from sender", completed: true },
      { status: "at_facility", label: "At Origin Facility", date: "Feb 05, 2026 6:00 PM", location: "Toronto Warehouse", description: "Package processed and prepared for shipment", completed: true },
      { status: "in_transit", label: "In Transit to Bangladesh", date: "Feb 07, 2026 8:00 AM", description: "Package is on flight to Dhaka", completed: true },
      { status: "arrived_bd", label: "Arrived in Bangladesh", date: "Feb 08, 2026 11:00 PM", location: "Dhaka Airport", description: "Package cleared customs, processing for delivery", current: true, completed: false },
      { status: "out_for_delivery", label: "Out for Delivery", description: "Pending", completed: false },
      { status: "delivered", label: "Delivered", description: "Pending final delivery", completed: false },
    ],
  },
  "WC-SH-20891": {
    type: "cargo",
    trackingId: "WC-SH-20891",
    cargoType: "Documents",
    weight: "2 kg",
    packages: 1,
    from: "Dhaka, Bangladesh",
    to: "Montreal, Canada",
    bookedDate: "Jan 28, 2026",
    estimatedDelivery: "Feb 04, 2026",
    deliveredDate: "Feb 05, 2026 2:30 PM",
    sender: "Rahman Enterprise",
    receiver: "Kamal Hossain",
    contact: "+1 437-XXX-XXXX",
    amount: "$85",
    currentStatus: "delivered",
    timeline: [
      { status: "booked", label: "Booking Confirmed", date: "Jan 28, 2026 9:00 AM", completed: true },
      { status: "picked_up", label: "Picked Up", date: "Jan 28, 2026 2:00 PM", location: "Dhaka", completed: true },
      { status: "at_facility", label: "At Origin Facility", date: "Jan 28, 2026 5:00 PM", completed: true },
      { status: "in_transit", label: "In Transit to Canada", date: "Jan 30, 2026 6:00 AM", completed: true },
      { status: "arrived_canada", label: "Arrived in Canada", date: "Feb 03, 2026 8:00 PM", location: "Montreal Airport", completed: true },
      { status: "out_for_delivery", label: "Out for Delivery", date: "Feb 05, 2026 9:00 AM", completed: true },
      { status: "delivered", label: "Delivered", date: "Feb 05, 2026 2:30 PM", description: "Received by Mr. Kamal", current: true, completed: true },
    ],
  },
  "WC-FL-30567": {
    type: "flight",
    bookingRef: "WC-FL-30567",
    pnr: "ABC123",
    status: "Confirmed",
    airline: "Air Canada",
    flightNumber: "AC 042",
    from: "Toronto (YYZ)",
    to: "Dhaka (DAC)",
    departureDate: "Mar 15, 2026",
    departureTime: "10:30 PM",
    arrivalDate: "Mar 16, 2026",
    arrivalTime: "11:45 PM",
    duration: "20h 15m",
    stops: "1 stop (Dubai)",
    class: "Economy",
    passengers: [
      { name: "Mr. Abdul Rahman", ticketNo: "1234567890123" },
      { name: "Mrs. Nasrin Rahman", ticketNo: "1234567890124" },
    ],
    totalAmount: "$1,850",
  },
};

export const mockFlights = [
  {
    id: "1",
    airline: "Air Canada",
    logo: "AC",
    flightNumber: "AC 042",
    from: "Toronto (YYZ)",
    to: "Dhaka (DAC)",
    departureTime: "10:30 PM",
    arrivalTime: "11:45 PM +1",
    duration: "20h 15m",
    stops: 1,
    stopLocation: "Dubai",
    price: 925,
    class: "Economy",
    baggage: "2 x 23kg",
    cabin: "7kg",
    meal: true,
  },
  {
    id: "2",
    airline: "Emirates",
    logo: "EK",
    flightNumber: "EK 243",
    from: "Toronto (YYZ)",
    to: "Dhaka (DAC)",
    departureTime: "9:00 PM",
    arrivalTime: "8:30 PM +1",
    duration: "18h 30m",
    stops: 1,
    stopLocation: "Dubai",
    price: 1150,
    class: "Economy",
    baggage: "2 x 23kg",
    cabin: "7kg",
    meal: true,
  },
  {
    id: "3",
    airline: "Qatar Airways",
    logo: "QR",
    flightNumber: "QR 765",
    from: "Toronto (YYZ)",
    to: "Dhaka (DAC)",
    departureTime: "11:15 PM",
    arrivalTime: "10:00 PM +1",
    duration: "19h 45m",
    stops: 1,
    stopLocation: "Doha",
    price: 1080,
    class: "Economy",
    baggage: "2 x 30kg",
    cabin: "7kg",
    meal: true,
  },
  {
    id: "4",
    airline: "Turkish Airlines",
    logo: "TK",
    flightNumber: "TK 018",
    from: "Toronto (YYZ)",
    to: "Dhaka (DAC)",
    departureTime: "6:45 PM",
    arrivalTime: "7:30 PM +1",
    duration: "21h 45m",
    stops: 1,
    stopLocation: "Istanbul",
    price: 895,
    class: "Economy",
    baggage: "2 x 23kg",
    cabin: "8kg",
    meal: true,
  },
  {
    id: "5",
    airline: "Biman Bangladesh",
    logo: "BG",
    flightNumber: "BG 208",
    from: "Toronto (YYZ)",
    to: "Dhaka (DAC)",
    departureTime: "8:00 PM",
    arrivalTime: "9:15 PM +1",
    duration: "22h 15m",
    stops: 1,
    stopLocation: "London",
    price: 785,
    class: "Economy",
    baggage: "2 x 32kg",
    cabin: "7kg",
    meal: true,
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Abdul Rahman",
    location: "Toronto, Canada",
    rating: 5,
    text: "Sent gifts to my family in Dhaka. Fast, safe, and affordable. Highly recommend WACC!",
    avatar: "AR",
  },
  {
    id: 2,
    name: "Fatima Khatun",
    location: "Chittagong, Bangladesh",
    rating: 5,
    text: "Booked my flight to Canada through WACC. Great service and best price!",
    avatar: "FK",
  },
  {
    id: 3,
    name: "Kamal Hossain",
    location: "Montreal, Canada",
    rating: 5,
    text: "Used their cargo service to send business samples. Professional and reliable!",
    avatar: "KH",
  },
];

export const faqs = [
  {
    category: "general",
    question: "What services does WACC offer?",
    answer: "WACC offers three main services: Cargo & Courier Services (both ways between Canada and Bangladesh), Air Ticket Booking (Canada ↔ Bangladesh flights), and Door-to-Door Delivery. We serve the Bangladeshi community in Canada and facilitate shipping and travel between both countries.",
  },
  {
    category: "general",
    question: "What are your contact numbers?",
    answer: "You can reach us at Canada: +1 437 849 7607 and Bangladesh: +8801715044409. Both numbers are available on WhatsApp. We provide 24/7 customer support.",
  },
  {
    category: "cargo",
    question: "How do I send a package from Canada to Bangladesh?",
    answer: "It's easy: 1) Visit our Cargo & Courier page or call us, 2) Fill out the booking form with package details, 3) Select pickup date and time, 4) We'll collect the package from your address in Canada, 5) Track your shipment online, 6) We deliver to the recipient's address in Bangladesh within 5-7 days.",
  },
  {
    category: "cargo",
    question: "How much does it cost to send cargo?",
    answer: "Pricing depends on weight and size of package, route (Canada to Bangladesh or vice versa), service type (Standard/Express/Priority), and additional services (insurance, fragile handling). Use our quote calculator or call for exact pricing.",
  },
  {
    category: "cargo",
    question: "What items can I send?",
    answer: "You can send documents and papers, personal items and gifts, clothing and textiles, electronics (properly packaged), non-perishable food items, books and media, and business samples. Prohibited items include illegal substances, weapons, perishable foods, live animals, hazardous materials, and liquids (without special arrangement).",
  },
  {
    category: "cargo",
    question: "How long does delivery take?",
    answer: "Delivery times: Standard: 5-7 business days, Express: 3-4 business days, Priority: 2-3 business days. Times may vary based on customs clearance and final delivery location.",
  },
  {
    category: "flight",
    question: "Which airlines do you work with?",
    answer: "We partner with major airlines including Air Canada, Biman Bangladesh Airlines, Emirates, Qatar Airways, Turkish Airlines, Etihad Airways, and more. We compare prices to get you the best deal.",
  },
  {
    category: "flight",
    question: "How do I book a flight?",
    answer: "Booking is simple: 1) Go to our Air Ticket page, 2) Select route (Canada ↔ Bangladesh), 3) Choose dates and number of passengers, 4) Search available flights, 5) Select your preferred flight, 6) Fill in passenger details, 7) Complete payment, 8) Receive e-ticket via email instantly.",
  },
  {
    category: "tracking",
    question: "How do I track my shipment?",
    answer: "Easy tracking: 1) Go to our Track Shipment page, 2) Enter your tracking ID (format: WC-SH-XXXXX), 3) View real-time status and location, 4) See estimated delivery date. You can also track via WhatsApp by sending us your tracking ID.",
  },
  {
    category: "tracking",
    question: "Will I be notified about my shipment status?",
    answer: "Yes! You'll receive SMS updates at major milestones, email notifications, and WhatsApp updates (if opted in). The recipient also gets a delivery notification.",
  },
  {
    category: "payment",
    question: "What payment methods do you accept?",
    answer: "We accept Credit/Debit Cards (Visa, Mastercard), Interac (Canada), bKash, Nagad, Rocket (Bangladesh), Bank Transfer, Cash (at office or pickup), and PayPal.",
  },
  {
    category: "payment",
    question: "Are there any hidden fees?",
    answer: "No hidden fees! All costs are clearly stated: shipping charges (based on weight/distance), optional services (insurance, express, etc.), and customs duties (if applicable, paid by recipient). Final price is confirmed before you book.",
  },
];

export const contactInfo = {
  canada: {
    phone: "+1 437 849 7607",
    email: "canada@wacc.com",
    address: "Toronto, ON, Canada",
    hours: "Mon-Sat: 9 AM - 6 PM EST",
  },
  bangladesh: {
    phone: "+8801715044409",
    email: "bangladesh@wacc.com",
    address: "Dhaka, Bangladesh",
    hours: "7 Days: 9 AM - 8 PM BST",
  },
};
