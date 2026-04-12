import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Backend local URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Xử lý dữ liệu trước khi trả về cho Component
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Bạn có thể xử lý các lỗi Global như 401 (hết hạn login) tại đây
    return Promise.reject(error);
  }
);

export default api;