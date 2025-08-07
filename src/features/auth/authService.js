const API_URL = import.meta.env.VITE_API_URL;
const login = async (userName, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, password }),
    });

    const res = await response.json();
    if (!response.ok || !res.token) {
      throw new Error(res.message || res.errors?.general || 'Login failed');
    }
    // Set initial selected role
    if (res.user.accessList?.length > 0) {
      const defaultRole =
        res.user.accessList.length >= 2
          ? res.user.accessList[1]
          : res.user.accessList[0];
      localStorage.setItem('selectedRole', JSON.stringify(defaultRole));
    }
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    return res.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('selectedRole');
  return null;
};

const fetchUserProfile = async (token) => {
  // In a real implementation, this would verify the token with the backend
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          resolve(JSON.parse(storedUser));
        } else {
          reject(new Error('User not found'));
        }
      } else {
        reject(new Error('Invalid token'));
      }
    }, 500);
  });
};

const changePassword = async (currentPassword, newPassword) => {
  // Simulating API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentPassword === 'password') {
        resolve({ success: true, message: 'Password changed successfully' });
      } else {
        reject(new Error('Current password is incorrect'));
      }
    }, 800);
  });
};

export default {
  login,
  logout,
  fetchUserProfile,
  changePassword,
};
