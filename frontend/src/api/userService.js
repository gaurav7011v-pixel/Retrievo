import api from "./axios";

// Get all users
export const getAllUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};

// Get user by ID
export const getUserById = async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
};

// Activate user
export const activateUser = async (userId) => {
    const response = await api.put(`/admin/users/${userId}/activate`);
    return response.data;
};

// Deactivate user
export const deactivateUser = async (userId) => {
    const response = await api.put(`/admin/users/${userId}/deactivate`);
    return response.data;
};

// Get logged-in user's profile
export const getUserProfile = async () => {
    const response = await api.get("/users/profile");
    return response.data;
};

// Update logged-in user's profile
export const updateUserProfile = async (profileData) => {
    const response = await api.put("/users/profile", profileData);
    return response.data;
};

// Change logged-in user's password
export const changePassword = async (passwordData) => {
    const response = await api.put(
        "/users/change-password",
        passwordData
    );
    return response.data;
};