export const mockNotifications = [
  {
    _id: "notif_001",
    recipientId: "usr_001", // Prem
    type: "claim_accepted",
    title: "Claim Accepted!",
    body: "Priya Sharma accepted your claim for 'Black Leather Men's Bifold Wallet'. You can now chat to coordinate return.",
    relatedItemId: "itm_001",
    relatedClaimId: "clm_001",
    relatedConversationId: "conv_001",
    isRead: false,
    createdAt: "2026-10-31T14:30:00.000Z"
  },
  {
    _id: "notif_002",
    recipientId: "usr_001", // Prem
    type: "new_message",
    title: "New Message from Priya",
    body: "Priya sent you a message: 'Great! See you tomorrow afternoon.'",
    relatedItemId: "itm_001",
    relatedClaimId: "clm_001",
    relatedConversationId: "conv_001",
    isRead: false,
    createdAt: "2026-11-03T16:45:00.000Z"
  },
  {
    _id: "notif_003",
    recipientId: "usr_003", // Alex
    type: "claim_received",
    title: "New Claim Received",
    body: "Rahul Verma submitted an ownership claim for your found item 'Sony WH-1000XM4 Headphones'.",
    relatedItemId: "itm_003",
    relatedClaimId: "clm_002",
    relatedConversationId: null,
    isRead: true,
    createdAt: "2026-11-02T11:00:00.000Z"
  },
  {
    _id: "notif_004",
    recipientId: "usr_001", // Prem
    type: "item_update",
    title: "Item Post Active",
    body: "Your lost report for 'Silver Apple MacBook Air M2' has been published and is searchable across the campus network.",
    relatedItemId: "itm_002",
    relatedClaimId: null,
    relatedConversationId: null,
    isRead: true,
    createdAt: "2026-10-30T13:10:00.000Z"
  }
];

