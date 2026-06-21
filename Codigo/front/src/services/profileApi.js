const API_BASE_URL = 'http://localhost:8080/api/profile';

const parseResponse = async (response) => {
  const text = await response.text();

  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Erro ${response.status}: não foi possível processar solicitação.`
    );
  }

  return data;
};

export const profileApi = {
  async getProfile(userId) {
    const response = await fetch(`${API_BASE_URL}/${userId}`);
    return parseResponse(response);
  },

  async updateProfile(userId, profileData) {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    return parseResponse(response);
  },

  async changePassword(userId, passwordData) {
    const response = await fetch(`${API_BASE_URL}/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    return parseResponse(response);
  },
};