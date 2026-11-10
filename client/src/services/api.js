// Backend API base URL
const API_BASE_URL = "http://localhost:5000/api";

// Common API request function
const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

// Register a new user
export const registerUser = (userData) => {
    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData)
    });
};

// Login an existing user
export const loginUser = (credentials) => {
    return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    });
};

// Request a password reset link
export const forgotPasswordApi = (email) => {
    return apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
    });
};

// Reset password using the token from the email link
export const resetPasswordApi = (token, password) => {
    return apiRequest(`/auth/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({ password })
    });
};

// Get currently logged-in user
export const getCurrentUser = (token) => {
    return apiRequest("/auth/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Create a new lost or found item
export const createItemApi = (itemData) => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/items", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
    });
};

// Get a single item by its ID from the backend
export const getItemByIdApi = (itemId) => {
    return apiRequest(`/items/${itemId}`, {
        method: "GET"
    });
};

// Get item details for editing, including private clues
export const getItemForEditApi = (itemId) => {
    const token = localStorage.getItem("findit_token");

    return apiRequest(`/items/${itemId}/edit`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};


// Get all items from the backend
export const getAllItemsApi = () => {
    return apiRequest("/items", {
        method: "GET"
    });
};

// Remove an item from the backend
export const deleteItemApi = (itemId) => {
    const token = localStorage.getItem("findit_token");

    return apiRequest(`/items/${itemId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
// Update an existing item in the backend
export const updateItemApi = (itemId, itemData) => {
    const token = localStorage.getItem("findit_token");

    return apiRequest(`/items/${itemId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
    });
};


// Submit a new claim to the backend
export const submitClaimApi = (claimData) => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/claims", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(claimData)
    });
};


// Get claims submitted by the logged-in user
export const getMyClaimsApi = () => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/claims/my", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};



// Update the status of an existing claim
export const updateClaimStatusApi = (claimId, status, reviewNote = "") => {
    const token = localStorage.getItem("findit_token");

    return apiRequest(`/claims/${claimId}/status`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, reviewNote })
    });
};


// Get claims received for items posted by the logged-in user
export const getReceivedClaimsApi = () => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/claims/received", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};


// Upload item images to the backend
export const uploadImagesApi = (images) => {
    const token = localStorage.getItem("findit_token");
    const formData = new FormData();

    images.forEach((image) => {
        formData.append("images", image);
    });

    return fetch(`${API_BASE_URL}/items/upload-images`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    }).then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Image upload failed");
        }

        return data;
    });
};


// Get conversations for the logged-in user
export const getConversationsApi = () => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/conversations", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Get message history for a conversation
export const getMessagesApi = (conversationId) => {
    const token = localStorage.getItem("findit_token");

    return apiRequest(`/conversations/${conversationId}/messages`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Get notifications for the logged-in user
export const getNotificationsApi = () => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/notifications", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Mark one notification as read
export const markNotificationAsReadApi = (notificationId) => {
    const token = localStorage.getItem("findit_token");

    return apiRequest(`/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Mark all notifications as read
export const markAllNotificationsAsReadApi = () => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/notifications/read-all", {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};


// Get admin dashboard statistics
export const getAdminOverviewApi = () => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/admin/overview", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Get all users for admin management
export const getAdminUsersApi = () => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/admin/users", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Update a user's account status
export const updateAdminUserStatusApi = (userId, accountStatus) => {
    const token = localStorage.getItem("findit_token");

    return apiRequest(`/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ accountStatus })
    });
};

// Get all items for admin moderation
export const getAdminItemsApi = () => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/admin/items", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Remove an item through admin moderation
export const removeAdminItemApi = (itemId) => {
    const token = localStorage.getItem("findit_token");

    return apiRequest(`/admin/items/${itemId}/remove`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Get all claims for admin auditing
export const getAdminClaimsApi = () => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/admin/claims", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Get all reports for admin moderation
export const getAdminReportsApi = () => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/reports", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Update a report's status and admin note
export const updateAdminReportStatusApi = (reportId, status, adminNote = "") => {
    const token = localStorage.getItem("findit_token");

    return apiRequest(`/reports/${reportId}/status`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, adminNote })
    });
};

// Submit a report against an item, user, or message
export const createReportApi = (reportData) => {
    const token = localStorage.getItem("findit_token");

    return apiRequest("/reports", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
    });
};
