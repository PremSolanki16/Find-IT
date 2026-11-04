export const mockReports = [
  {
    _id: "rep_001",
    reporterId: "usr_002",
    targetType: "item",
    itemId: "itm_004",
    targetUserId: null,
    messageId: null,
    reason: "spam",
    details: "Suspected duplicate test posting or vague description without sufficient campus relevance.",
    status: "open",
    reviewedBy: null,
    adminNote: "",
    createdAt: "2026-11-03T08:20:00.000Z",
    updatedAt: "2026-11-03T08:20:00.000Z"
  },
  {
    _id: "rep_002",
    reporterId: "usr_001",
    targetType: "user",
    itemId: null,
    targetUserId: "usr_004",
    messageId: null,
    reason: "scam",
    details: "User sent an unsolicited external payment link claiming to require shipping fees.",
    status: "under_review",
    reviewedBy: "usr_admin",
    adminNote: "Under investigation by campus safety team. Chat logs requested.",
    createdAt: "2026-11-02T14:10:00.000Z",
    updatedAt: "2026-11-03T10:00:00.000Z"
  },
  {
    _id: "rep_003",
    reporterId: "usr_003",
    targetType: "message",
    itemId: null,
    targetUserId: null,
    messageId: "msg_001",
    reason: "inappropriate",
    details: "False alarm test report submitted during UI beta testing.",
    status: "dismissed",
    reviewedBy: "usr_admin",
    adminNote: "Verified legitimate communication. Report dismissed.",
    createdAt: "2026-10-31T15:00:00.000Z",
    updatedAt: "2026-10-31T16:00:00.000Z"
  }
];

