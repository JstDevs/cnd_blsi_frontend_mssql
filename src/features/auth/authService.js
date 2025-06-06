// Mock service for auth operations - replace with actual API calls
const login = async (username, password) => {
  // Simulating API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        const user = {
          id: 1,
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@lgu.gov.ph',
          role: 'Administrator',
          department: 'Information Technology',
          permissions: ['all']
        };
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, 800);
  });
};



const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
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
  changePassword
};