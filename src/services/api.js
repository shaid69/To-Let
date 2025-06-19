const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Properties
  async getProperties(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/properties${queryParams ? `?${queryParams}` : ''}`);
  }

  async getFeaturedProperties() {
    return this.request('/properties/featured');
  }

  async getProperty(id) {
    return this.request(`/properties/${id}`);
  }

  async addProperty(propertyData) {
    return this.request('/properties', {
      method: 'POST',
      body: propertyData, // FormData for file upload
      headers: {}, // Let browser set content-type for FormData
    });
  }

  // Authentication
  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Inquiries
  async submitInquiry(inquiryData) {
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  }

  // Contact
  async submitContact(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // Stats
  async getStats() {
    return this.request('/stats');
  }
}

export default new ApiService();