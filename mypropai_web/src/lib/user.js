import api, { getUserToken, fetchNewUserToken, clearUserToken } from "./api";

// Add to wishlist
export const addWishlist = async (property_id) => {
  try {
    const res = await api.post(
      "/api/wishlist/create",
      { property_id }, 
      {
        headers: {
          Authorization: `Bearer ${getUserToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};


// Get wishlist
export const getWishlist = async () => {
  try {
    const res = await api.get("/api/wishlist/my-wishlist", {
      headers: {
        Authorization: `Bearer ${getUserToken()}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

// Delete wishlist
export const deleteWishlist = async (wishlistId) => {
  try {
    const res = await api.delete(`/api/wishlist/${wishlistId}`, {
      headers: { Authorization: `Bearer ${getUserToken()}` },
    });
    return res.data;
  } catch (error) {
    // Retry on 401
    if (error.response?.status == 401) {
      clearUserToken();
      const newToken = await fetchNewUserToken();
      const res = await api.delete(`/api/wishlist/${wishlistId}`, {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      return res.data;
    }
    console.error("Error deleting wishlist item:", error.response?.data || error.message);
    throw error;
  }
};
