export const mockItems = [
  {
    _id: "itm_001",
    createdBy: "usr_002", // Priya Sharma found it
    type: "found",
    title: "Black Leather Men's Bifold Wallet",
    description: "Found a genuine black leather bifold wallet on a study desk. Clean condition, contains several membership and transport cards.",
    category: "accessories",
    locationName: "College Library",
    locationDetails: "2nd floor silent reading room, south desk #14",
    eventDate: "2026-10-28",
    imageUrls: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
    ],
    privateClues: [
      "Initials 'PS' stamped subtly on inner card slot",
      "Contains student ID card",
      "Blue city transit metro pass inside flap"
    ],
    status: "claim_pending",
    isRewardOffered: false,
    rewardDetails: "",
    createdAt: "2026-10-28T14:35:00.000Z",
    updatedAt: "2026-11-01T16:20:00.000Z"
  },
  {
    _id: "itm_002",
    createdBy: "usr_001", // Prem Solanki lost it
    type: "lost",
    title: "Silver Apple MacBook Air M2 (13-inch)",
    description: "Lost my silver MacBook Air M2 in a matte grey protective sleeve. Left behind during lunch hour. Contains urgent project coursework.",
    category: "electronics",
    locationName: "Student Center Cafeteria",
    locationDetails: "Booth table near the juice bar counter",
    eventDate: "2026-10-30",
    imageUrls: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
    ],
    privateClues: [
      "Has a subtle carbon fiber skin on the bottom",
      "Lock screen username 'Prem S.'"
    ],
    status: "open",
    isRewardOffered: true,
    rewardDetails: "$50 cash reward upon safe return",
    createdAt: "2026-10-30T13:10:00.000Z",
    updatedAt: "2026-10-30T13:10:00.000Z"
  },
  {
    _id: "itm_003",
    createdBy: "usr_003", // Alex Chen found it
    type: "found",
    title: "Sony WH-1000XM4 Noise-Cancelling Headphones",
    description: "Found over-ear black Sony noise cancelling headphones in their zippered travel case.",
    category: "electronics",
    locationName: "Main Campus Gym",
    locationDetails: "Locker room bench near locker #42",
    eventDate: "2026-11-01",
    imageUrls: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    ],
    privateClues: [
      "Small white sticker on inside of right cup",
      "Included 3.5mm gold-plated aux cable and airplane adapter"
    ],
    status: "open",
    isRewardOffered: false,
    rewardDetails: "",
    createdAt: "2026-11-01T17:45:00.000Z",
    updatedAt: "2026-11-01T17:45:00.000Z"
  },
  {
    _id: "itm_004",
    createdBy: "usr_004", // Rahul Verma lost it
    type: "lost",
    title: "Car Key Fob with Red Carabiner Keychain",
    description: "Lost Honda smart remote key fob attached to a red aluminium carabiner and house key. Dropped while walking to car.",
    category: "keys",
    locationName: "North Parking Lot near Gate 2",
    locationDetails: "Walkway between Science block and lot B",
    eventDate: "2026-11-02",
    imageUrls: [
      "https://images.unsplash.com/photo-1589824783837-6169889fa20f?auto=format&fit=crop&w=800&q=80"
    ],
    privateClues: [
      "Slight crack near the trunk release button",
      "Gym barcode tag attached with mini ring"
    ],
    status: "open",
    isRewardOffered: true,
    rewardDetails: "$20 coffee card reward",
    createdAt: "2026-11-02T09:15:00.000Z",
    updatedAt: "2026-11-02T09:15:00.000Z"
  },
  {
    _id: "itm_005",
    createdBy: "usr_001", // Prem Solanki found it
    type: "found",
    title: "Navy Blue North Face Backpack",
    description: "Found a water-resistant navy blue North Face daypack. Left under the seat after afternoon lecture.",
    category: "bags",
    locationName: "Engineering Block B Lecture Hall 104",
    locationDetails: "Row 5, seat 12",
    eventDate: "2026-11-02",
    imageUrls: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    privateClues: [
      "Contains university calculus textbook with highlighted notes",
      "Lucky cat keychain inside the smaller zippered compartment"
    ],
    status: "open",
    isRewardOffered: false,
    rewardDetails: "",
    createdAt: "2026-11-02T16:50:00.000Z",
    updatedAt: "2026-11-02T16:50:00.000Z"
  },
  {
    _id: "itm_006",
    createdBy: "usr_002", // Priya lost it
    type: "lost",
    title: "Brown Leather Student Organizer / Notebook",
    description: "Lost a refillable A5 leather journal with brass pen holder and research laboratory notes.",
    category: "documents",
    locationName: "Science Hall Room 302",
    locationDetails: "Organic chemistry lab workbench #3",
    eventDate: "2026-10-25",
    imageUrls: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    ],
    privateClues: [
      "Biochemistry experiment data stamped on page 42",
      "Green ribbon bookmark"
    ],
    status: "open",
    isRewardOffered: false,
    rewardDetails: "",
    createdAt: "2026-10-25T11:00:00.000Z",
    updatedAt: "2026-10-25T11:00:00.000Z"
  },
  {
    _id: "itm_007",
    createdBy: "usr_004", // Rahul found it
    type: "found",
    title: "Ray-Ban Aviator Sunglasses in Black Hard Case",
    description: "Classic gold frame Ray-Ban aviator sunglasses with green lenses found on the coffee table.",
    category: "accessories",
    locationName: "University Bookstore Lobby",
    locationDetails: "Coffee lounge seating area near front window",
    eventDate: "2026-10-26",
    imageUrls: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
    ],
    privateClues: [
      "Tiny serial code RB3025 on left temple",
      "Red microfiber lens cloth with university logo inside case"
    ],
    status: "returned",
    isRewardOffered: false,
    rewardDetails: "",
    createdAt: "2026-10-26T15:20:00.000Z",
    updatedAt: "2026-11-02T17:00:00.000Z"
  },
  {
    _id: "itm_008",
    createdBy: "usr_003", // Alex found it
    type: "found",
    title: "Titan Stainless Steel Wristwatch",
    description: "Silver metal strap analog watch found on the washbasin counter.",
    category: "accessories",
    locationName: "Central Library Restroom",
    locationDetails: "Ground floor east wing restroom counter",
    eventDate: "2026-11-03",
    imageUrls: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
    ],
    privateClues: [
      "Engraving on back case: 'Class of 2024'",
      "Blue dial with roman numerals"
    ],
    status: "open",
    isRewardOffered: false,
    rewardDetails: "",
    createdAt: "2026-11-03T10:15:00.000Z",
    updatedAt: "2026-11-03T10:15:00.000Z"
  }
];

