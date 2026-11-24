import api from "./axios";

// Student: Submit a claim
export const submitClaim = async (claimData) => {
    const response = await api.post("/claims", claimData);
    return response.data;
};

// Student: Get my claims
export const getMyClaims = async () => {
    const response = await api.get("/claims/my-claims");
    return response.data;
};

// Admin: Get all claims
export const getAllClaims = async () => {
    const response = await api.get("/admin/claims");
    return response.data;
};

// Admin: Approve a claim
export const approveClaim = async (claimId) => {
    const response = await api.put(`/admin/claims/${claimId}/approve`);
    return response.data;
};

// Admin: Reject a claim
export const rejectClaim = async (claimId) => {
    const response = await api.put(`/admin/claims/${claimId}/reject`);
    return response.data;
};