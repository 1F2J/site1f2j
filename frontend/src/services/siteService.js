import axios from 'axios';

export const getFeaturedProducts = async () => {
  try {
    const response = await axios.get('/api/site/featured-products');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

export const getHomeSections = async () => {
  try {
    const response = await axios.get('/api/site/home-sections');
    return response.data;
  } catch (error) {
    console.error('Error fetching home sections:', error);
    throw error;
  }
};