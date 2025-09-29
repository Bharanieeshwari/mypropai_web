import api, { getAdminToken } from "./api";

export const getPlansByUser = async (user_id) => {
  try {
    const res = await api.get(
      `/api/subscriptions/user/${user_id}/eligible-plans`,
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
export const upgradeSubscription = async ({ plan_id, user_id }) => {
  try {
    const res = await api.post(
      `/api/subscriptions/user/${user_id}/subscription/upgrade`,
      { plan_id },
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
      "upgradeSubscription failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createOrder = async (amount) => {
  try {
    const res = await api.post(`/api/payment/create-order`, {
      amount: amount,
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: ` Bearer ${getAdminToken()}`,
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

// completed paymnet
export const planPaymentComplete = async ({
  payment_id,
  order_id,
  signature,
}) => {
  try {
    const res = await api.post(
      `/api/payment/complete`,
      {
        razorpay_payment_id: payment_id,
        razorpay_order_id: order_id,
        razorpay_signature: signature,
      },
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
      "planPaymentComplete failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getUserSubscription = async (user_id) => {
  try {
    const res = await api.get(
      `/api/subscriptions/user/${user_id}/subscription/limits`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${getAdminToken()}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("failed to fetch user subscription", error);
  }
};
