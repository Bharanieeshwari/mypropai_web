// Import
import api, { getAdminToken } from "./api";

// Post property form data
export const postProperty = async (formData) => {
  try {
    const form = new FormData();
    const propertyData = {
      title: formData?.title,
      description: formData?.description,
      price: formData?.price,
      area_value: formData?.plot_area_sqft,
      area_unit: formData?.area_unit,
      property_type: formData?.subPropertyType,
      user_id: formData.user_id,
      category_name: formData?.category_name,
      sale_type: "Resale Property",
      price_type: formData?.priceOption,
      registration_fee: formData?.feesOption,
      ...(formData.cover_image !== undefined && formData.cover_image !== null
        ? { cover_image: formData.cover_image }
        : {}),
      location: {
        locality: formData.location?.locality,
        landmark: formData.location?.landmark,
        street: formData.location?.street,
        apartment_society: formData.location?.apartment_society,
        city: formData.location?.city,
        state: formData.location?.state,
        country: formData.location?.country,
        pincode: formData.location?.pincode,
        latitude: formData.location?.latitude,
        longitude: formData.location?.longitude,
      },
      details: {
        plot_length_ft: formData?.details?.plot_length_ft?.value,
        plot_breadth_ft: formData?.details?.plot_breadth_ft?.value,
        facing: formData?.details?.facing,
        approval_status: formData?.details?.approval_status,
        approval_authority: formData?.details?.approval_authority,
        permissible_floors: formData?.details?.permissible_floors,
        corner_plot: formData?.details?.corner_plot,
        boundary_wall: formData?.details?.boundary_wall,
        open_sides_count: formData?.details?.open_sides_count,
        construction_done: formData?.details?.construction_done,
        road_size_sqft: formData?.details?.road_size_sqft,
      },
    };

    console.log("property data", propertyData);
    form.append("data", JSON.stringify(propertyData));

    const appendUniqueFiles = (form, filesArray, keyPrefix) => {
      if (!filesArray || filesArray.length === 0) return;

      const uniqueFiles = [];

      filesArray.forEach((item) => {
        const fileObj = item.file ? item.file : item;
        const isDuplicate = uniqueFiles.some(
          (f) => f.name === fileObj.name && f.size === fileObj.size
        );

        if (!isDuplicate) uniqueFiles.push(fileObj);
      });

      uniqueFiles.forEach((fileObj, idx) => {
        form.append(`${keyPrefix}_${idx + 1}`, fileObj);
      });
    };
    if (formData.cover_image && formData.cover_image.length > 0) {
      form.append("cover_image", formData.cover_image[0]);
    }

    appendUniqueFiles(form, formData.photos, "image");
    appendUniqueFiles(form, formData.video, "video");
    const res = await api.post("/api/properties/create", form, {
      headers: {
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      "postProperty failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update property fomr data
export const UpdatePostProperty = async (formData, propertyId, user_id) => {
  try {
    const form = new FormData();
    const updatedPostPropertyData = {
      title: formData?.title,
      description: formData?.description,
      price: formData?.price,
      area_value: formData?.plot_area_sqft,
      area_unit: formData?.area_unit,
      property_type: formData?.subPropertyType,
      user_id: user_id,
      category_name: formData?.category_name,
      sale_type: "Resale Property",
      price_type: formData?.priceOption,
      registration_fee: formData?.feesOption,
      ...(formData.cover_image !== undefined && formData.cover_image !== null
        ? { cover_image: formData.cover_image }
        : {}),
      location: {
        locality: formData.location?.locality,
        landmark: formData.location?.landmark,
        street: formData.location?.street,
        apartment_society: formData.location?.apartment_society,
        city: formData.location?.city,
        state: formData.location?.state,
        country: formData.location?.country,
        pincode: formData.location?.pincode,
        latitude: formData.location?.latitude,
        longitude: formData.location?.longitude,
      },
      details: {
        plot_length_ft: formData?.details?.plot_length_ft?.value,
        plot_breadth_ft: formData?.details?.plot_breadth_ft?.value,
        facing: formData?.details?.facing,
        approval_status: formData?.details?.approval_status,
        approval_authority: formData?.details?.approval_authority,
        permissible_floors: formData?.details?.permissible_floors,
        corner_plot: formData?.details?.corner_plot,
        boundary_wall: formData?.details?.boundary_wall,
        open_sides_count: formData?.details?.open_sides_count,
        construction_done: formData?.details?.construction_done,
        road_size_sqft: formData?.details?.road_size_sqft,
      },
    };

    form.append("data", JSON.stringify(updatedPostPropertyData));

    const appendUniqueFiles = (form, filesArray, keyPrefix) => {
      if (!Array.isArray(filesArray) || filesArray.length === 0) return;

      const uniqueFiles = [];

      filesArray.forEach((item) => {
        const fileObj = item.file ? item.file : item;
        const isDuplicate = uniqueFiles.some(
          (f) => f.name === fileObj.name && f.size === fileObj.size
        );

        if (!isDuplicate) uniqueFiles.push(fileObj);
      });

      uniqueFiles.forEach((fileObj, idx) => {
        form.append(`${keyPrefix}_${idx + 1}`, fileObj);
      });
    };
    appendUniqueFiles(form, formData.photos, "image");
    appendUniqueFiles(form, formData.video, "video");

    const res = await api.put(`/api/properties/${propertyId}/update`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      "Update Post Property failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get all properties
export const getAllProperties = async ({
  user_id,
  category,
  property_type,
  city,
  min_price,
  max_price,
  page,
  page_size,
} = {}) => {
  const params = {};
  if (user_id) params.user_id = user_id;
  if (category) params.category = category;
  if (property_type) params.property_type = property_type;
  if (city) params.city = city;
  if (min_price) params.min_price = min_price;
  if (max_price) params.max_price = max_price;
  if (page) params.page = page;
  if (page_size) params.page_size = page_size;

  const res = await api.get("/api/properties/all", { params });
  return res.data;
};




// Get property using property id
export const getPropertyById = async ({ propertyId } = {}) => {
  try {
    const res = await api.get(`/api/properties/${propertyId}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });

    return res;
  } catch (error) {
    console.error(
      "getUserProperties failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get all property using user id
export const getUserProperties = async ({ user_id, page, page_size } = {}) => {
  try {
    const params = {};
    if (page !== undefined && page !== "") {
      params.page = page;
    }
    if (page_size !== undefined && page_size !== "") {
      params.page_size = page_size;
    }

    const res = await api.get(`/api/properties/mine?user_id=${user_id}`, {
      params,
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      "getUserProperties failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Check for user can post property
export const canUserPostProperty = async ({ user_id } = {}) => {
  try {
    const params = {};

    if (user_id !== undefined && user_id !== "") {
      params.user_id = user_id;
    }

    const res = await api.get(
      `api/subscriptions/user/${user_id}/subscription/can-post`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${getAdminToken()}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error(
      "getUserProperties failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Increment maximum limt of post porperty
export const incrementPostProperty = async ({ user_id } = {}) => {
  try {
    const params = {};

    if (user_id !== undefined && user_id !== "") {
      params.user_id = user_id;
    }

    const res = await api.post(
      `/api/subscriptions/user/${user_id}/usage/increment-property`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${getAdminToken()}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error(
      "getUserProperties failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Check for can user view Contact
export const canUserViewContact = async ({ user_id } = {}) => {
  try {
    const params = {};

    if (user_id !== undefined && user_id !== "") {
      params.user_id = user_id;
    }

    const res = await api.get(
      `api/subscriptions/user/${user_id}/subscription/can-view`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${getAdminToken()}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error(
      "canViewDetails failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Increment user viewed Contact
export const incrementUserView = async ({ user_id } = {}) => {
  try {
    const params = {};

    if (user_id !== undefined && user_id !== "") {
      params.user_id = user_id;
    }

    const res = await api.post(
      `api/subscriptions/user/${user_id}/usage/increment-view`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${getAdminToken()}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "canViewDetails failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get all property type
export const getAllPropertyType = async () => {
  try {
    const res = await api.get(`/api/properties/available-property-types`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      "getAllPropertyType failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};
// Get all categories
export const getAllCategories = async () => {
  try {
    const res = await api.get(`/api/properties/available-categories`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      "getAllPropertyType failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get all properties
export const getFilterProperties = async ({ page, page_size } = {}) => {
  const params = {};
  if (page) params.page = page;
  if (page_size) params.page_size = page_size;

  const res = await api.get("/api/properties/filter/", { params });
  return res.data;
};
