export const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Redirect to login
    window.location.href = "/login";
};