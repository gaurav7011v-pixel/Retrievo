import api from "./axios";

// Report a lost item
export const reportLostItem = async (itemData) => {
    const response = await api.post("/items/lost", itemData);
    return response.data;
};

// Report a found item
export const reportFoundItem = async (itemData) => {
    const response = await api.post("/items/found", itemData);
    return response.data;
};

// Get all reported items
export const getAllItems = async () => {
    const response = await api.get("/items");
    return response.data;
};

// Get item by ID
export const getItemById = async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
};

// Get logged-in user's reports
export const getMyReports = async () => {
    const response = await api.get("/items/my-reports");
    return response.data;
};

// Admin: Get all items
export const getAllItemsAdmin = async () => {
    const response = await api.get("/admin/items");
    return response.data;
};

// Admin: Update item status
export const updateItemStatus = async (itemId, status) => {
    const response = await api.put(
        `/admin/items/${itemId}/status`,
        null,
        {
            params: { status }
        }
    );
    return response.data;
};

// Admin: Delete an item
export const deleteItemAdmin = async (itemId) => {
    const response = await api.delete(`/admin/items/${itemId}`);
    return response.data;
};