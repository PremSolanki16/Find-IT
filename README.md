# FindIt – Lost & Found Platform (Frontend)

FindIt is a modern, responsive, and secure Lost & Found web application engineered for universities, colleges, libraries, offices, and public institutions. It enables users to report lost belongings, log found items, submit ownership claims with verification details, track claim statuses, and communicate privately without exposing personal phone numbers or confidential identifying marks.

Built with **React.js**, **JavaScript**, **React Router**, and a unified **Design System with CSS Variables**.

---

## 🚀 Key Features & Highlights

- **Reusable Component Architecture**: Strictly follows DRY (Don't Repeat Yourself) principles. Shared common components, item cards, claim cards, status badges, data tables, modals, and layouts are reused across all pages.
- **Unified Design Tokens (`variables.css`)**: Single central source of truth for brand colors, status indicators, typography, spacing, border radii, shadows, and z-index layers.
- **Two-State Reusable Navbar**: Dynamically adjusts for Guest vs. Authenticated User modes, with real-time notification badges and responsive mobile menu.
- **Interactive Role Switcher**: Built-in demo switcher banner at the top of the application allowing instant switching between:
  - **Prem Solanki** (Standard Registered User / Claimant)
  - **Priya Sharma** (Finder / Registered User)
  - **Sarah Jenkins** (Platform Administrator)
  - **Guest Mode** (Logged out view)
- **Safe Handover Protocol**: Confidential verification questionnaire keeps secret clues hidden from public view until proven by the genuine owner.
- **Private Chat Interface**: Authorised communication thread enabled exclusively upon claim approval to safely arrange handover logistics.
- **Dual Dashboards**: Dedicated User Workspace (Lost Items, Found Items, Claims, Received Claims, Profile) and separate Admin Moderation Console (Users, Items, Claims audit, Content reports).

---

## 🗄️ MongoDB Database Architecture Compatibility

The frontend state and data models strictly adhere to the project's planned MongoDB collections and fields:

1. **`users`**: `_id`, `name`, `email`, `role` (`user` | `admin`), `accountStatus` (`active` | `suspended` | `disabled`), `avatarUrl`, timestamps.
2. **`items`**: `_id`, `createdBy`, `type` (`lost` | `found`), `title`, `description`, `category` (electronics, bags, clothing, documents, accessories, keys, other), `locationName`, `locationDetails`, `eventDate`, `imageUrls`, `privateClues`, `status` (`open` | `claim_pending` | `returned` | `closed` | `removed`), `isRewardOffered`, `rewardDetails`, timestamps.
3. **`claims`**: `_id`, `itemId`, `claimantId`, `answers` (`[{ question, answer }]`), `status` (`pending` | `accepted` | `rejected` | `cancelled` | `completed`), `reviewedBy`, `reviewNote`, timestamps.
4. **`conversations`**: `_id`, `claimId`, `itemId`, `participantIds` (`[userId1, userId2]`), `lastMessageAt`, timestamps.
5. **`messages`**: `_id`, `conversationId`, `senderId`, `text`, `messageType`, `isDeleted`, `createdAt`.
6. **`notifications`**: `_id`, `recipientId`, `type` (`claim_received` | `claim_accepted` | `claim_rejected` | `new_message` | `item_update`), `title`, `body`, `relatedItemId`, `relatedClaimId`, `relatedConversationId`, `isRead`, timestamps.
7. **`reports`**: `_id`, `reporterId`, `targetType` (`item` | `user` | `message`), `itemId`, `targetUserId`, `messageId`, `reason` (`spam` | `inappropriate` | `scam` | `harassment` | `other`), `details`, `status` (`open` | `under_review` | `resolved` | `dismissed`), `adminNote`, timestamps.

---

## 📁 Project Directory Structure

```text
FindIt/
│
├── client/
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx & Button.css
│   │   │   │   ├── Input.jsx & Input.css
│   │   │   │   ├── FormField.jsx
│   │   │   │   ├── Modal.jsx & Modal.css
│   │   │   │   ├── Loader.jsx & Loader.css
│   │   │   │   ├── EmptyState.jsx & EmptyState.css
│   │   │   │   ├── ConfirmationDialog.jsx & ConfirmationDialog.css
│   │   │   │   ├── StatusBadge.jsx & StatusBadge.css
│   │   │   │   ├── Pagination.jsx & Pagination.css
│   │   │   │   ├── Icons.jsx
│   │   │   │   ├── Navbar.jsx & Navbar.css
│   │   │   │   └── Footer.jsx & Footer.css
│   │   │   │
│   │   │   ├── items/
│   │   │   │   ├── ItemCard.jsx & ItemCard.css
│   │   │   │   ├── ItemGrid.jsx & ItemGrid.css
│   │   │   │   ├── SearchBar.jsx & SearchBar.css
│   │   │   │   ├── CategoryCard.jsx & CategoryCard.css
│   │   │   │   ├── FilterSidebar.jsx & FilterSidebar.css
│   │   │   │   └── ImageUpload.jsx & ImageUpload.css
│   │   │   │
│   │   │   ├── claims/
│   │   │   │   ├── ClaimCard.jsx & ClaimCard.css
│   │   │   │   ├── ClaimStatus.jsx & ClaimStatus.css
│   │   │   │   └── VerificationForm.jsx & VerificationForm.css
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   ├── ConversationList.jsx & ConversationList.css
│   │   │   │   ├── ChatWindow.jsx & ChatWindow.css
│   │   │   │   └── MessageBubble.jsx & MessageBubble.css
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── DashboardSidebar.jsx & DashboardSidebar.css
│   │   │       ├── DashboardNavbar.jsx & DashboardNavbar.css
│   │   │       ├── StatCard.jsx & StatCard.css
│   │   │       ├── NotificationCard.jsx & NotificationCard.css
│   │   │       └── DataTable.jsx & DataTable.css
│   │   │
│   │   ├── pages/
│   │   │   ├── Home/ (Home.jsx & Home.css)
│   │   │   ├── Auth/ (Login.jsx, Signup.jsx & Auth.css)
│   │   │   ├── BrowseItems/ (BrowseItems.jsx & BrowseItems.css)
│   │   │   ├── ItemDetails/ (ItemDetails.jsx & ItemDetails.css)
│   │   │   ├── ReportItem/ (ReportLost.jsx, ReportFound.jsx & ReportItem.css)
│   │   │   ├── Dashboard/ (DashboardOverview.jsx, MyLostItems.jsx, MyFoundItems.jsx, MyClaims.jsx, ReceivedClaims.jsx, ProfileInfo.jsx & DashboardPages.css)
│   │   │   ├── Claims/ (SubmitClaim.jsx & SubmitClaim.css)
│   │   │   ├── Chat/ (ChatPage.jsx & ChatPage.css)
│   │   │   ├── Notifications/ (NotificationsPage.jsx & NotificationsPage.css)
│   │   │   └── Admin/ (AdminOverview.jsx, ManageUsers.jsx, ManageItems.jsx, ManageClaims.jsx, ManageReports.jsx & AdminPages.css)
│   │   │
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx & PublicLayout.css
│   │   │   ├── AuthLayout.jsx & AuthLayout.css
│   │   │   └── DashboardLayout.jsx & DashboardLayout.css
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── DataContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useData.js
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── data/
│   │   │   ├── mockUsers.js
│   │   │   ├── mockItems.js
│   │   │   ├── mockClaims.js
│   │   │   ├── mockConversations.js
│   │   │   ├── mockMessages.js
│   │   │   ├── mockNotifications.js
│   │   │   └── mockReports.js
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   │
│   │   ├── styles/
│   │   │   ├── variables.css
│   │   │   └── global.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

## 🚦 Application Routes

| Path | Layout | Description |
| :--- | :--- | :--- |
| `/` | `PublicLayout` | Landing page: Hero search, categories, statistics, how it works |
| `/browse` | `PublicLayout` | Browse and filter all lost and found items |
| `/items/:id` | `PublicLayout` | Item details, image gallery, poster info, claim trigger |
| `/login` | `AuthLayout` | User login with validation and quick demo autofill |
| `/signup` | `AuthLayout` | User registration with input validation |
| `/report/lost` | `PublicLayout` | Report a lost item with location, date, photos, reward |
| `/report/found` | `PublicLayout` | Report a found item with private verification clues |
| `/claims/:id` | `PublicLayout` | Submit ownership verification questionnaire |
| `/chat` | `PublicLayout` | Private encrypted chat between finder and claimant |
| `/notifications`| `PublicLayout` | Notification stream for claim status updates & messages |
| `/dashboard` | `DashboardLayout` | User overview: lost items, found items, claims, returns |
| `/dashboard/lost-items` | `DashboardLayout` | Manage lost items posted by current user |
| `/dashboard/found-items` | `DashboardLayout` | Manage found items posted by current user |
| `/dashboard/claims` | `DashboardLayout` | Track status of claims submitted by current user |
| `/dashboard/received-claims` | `DashboardLayout` | Review answers and accept/reject received claims |
| `/dashboard/profile` | `DashboardLayout` | Edit profile name, avatar URL, and view status |
| `/admin` | `DashboardLayout` | Admin overview, moderation queue, platform statistics |
| `/admin/users` | `DashboardLayout` | Manage user accounts (active, suspended) |
| `/admin/items` | `DashboardLayout` | Manage and delete item listings |
| `/admin/claims` | `DashboardLayout` | Audit all claims and inspection answers |
| `/admin/reports` | `DashboardLayout` | Review content reports (spam, scam, harassment) |

---

## 🛠️ How to Run Locally

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)

### 2. Installation & Startup
```bash
# Navigate to the client directory
cd client

# Install dependencies (React, React Router)
npm install

# Start the development server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Testing and Verification Checklist

- [x] **Complete Component Hierarchy**: All 30+ reusable and page components created.
- [x] **Zero Duplicate Navbars/Footers**: Unified Navbar and Footer across all public routes.
- [x] **Single CSS Variables File**: `client/src/styles/variables.css` imported throughout.
- [x] **Production Build Tested**: `npm run build` succeeds cleanly with 0 errors.
- [x] **Interactive State**: Add items via Report Lost/Found, submit claims, accept/reject claims, send messages, mark notifications as read.
- [x] **Backend Ready**: Ready for Mongoose models and Express REST API endpoints matching the 7 collections.

