export const mockClaims = [
  {
    _id: "clm_001",
    itemId: "itm_001", // Black Leather Men's Bifold Wallet (Found by Priya usr_002)
    claimantId: "usr_001", // Prem Solanki claiming it
    answers: [
      {
        question: "What brand or color is the wallet?",
        answer: "It is a black leather Tommy Hilfiger bifold wallet with two currency compartments."
      },
      {
        question: "What identifying cards, markings or initials are inside?",
        answer: "My college student ID card with name Prem Solanki, plus initials 'PS' engraved on the inner card slot."
      },
      {
        question: "Are there any specific items in the rear or hidden pockets?",
        answer: "A blue city transit metro pass card with a slightly worn magnetic stripe."
      }
    ],
    status: "accepted",
    reviewedBy: "usr_002",
    reviewNote: "All verification details match the wallet's contents exactly. Approved for return coordination.",
    createdAt: "2026-10-29T10:15:00.000Z",
    updatedAt: "2026-10-31T14:30:00.000Z"
  },
  {
    _id: "clm_002",
    itemId: "itm_003", // Sony Headphones (Found by Alex usr_003)
    claimantId: "usr_004", // Rahul Verma claiming it
    answers: [
      {
        question: "What brand or color is the item?",
        answer: "Sony WH-1000XM4 matte black finish."
      },
      {
        question: "Are there any distinguishing stickers, markings or case accessories?",
        answer: "There is a small white circular sticker inside the right ear cup and the original 3.5mm cable is inside the case mesh."
      }
    ],
    status: "pending",
    reviewedBy: null,
    reviewNote: "",
    createdAt: "2026-11-02T11:00:00.000Z",
    updatedAt: "2026-11-02T11:00:00.000Z"
  },
  {
    _id: "clm_003",
    itemId: "itm_007", // Ray-Ban Aviators (Found by Rahul usr_004)
    claimantId: "usr_003", // Alex Chen claimed it
    answers: [
      {
        question: "What color and case details can you confirm?",
        answer: "Gold frame with green classic lenses, black leatherette case."
      },
      {
        question: "What is inside the case or stamped on the frame?",
        answer: "A red cleaning cloth with university bookstore insignia and model RB3025 on the frame."
      }
    ],
    status: "completed",
    reviewedBy: "usr_004",
    reviewNote: "Handover completed at the campus security desk on Nov 2nd.",
    createdAt: "2026-10-27T09:30:00.000Z",
    updatedAt: "2026-11-02T17:00:00.000Z"
  }
];

