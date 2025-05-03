// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const useApi = (baseUrl = '') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = useCallback(async (method, url, body = null, headers = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios({
        method,
        url: baseUrl + url,
        data: body,
        headers
      });
      
      setData(response.data);
      setLoading(false);
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, [baseUrl]);

  const get = useCallback((url, headers) => request('get', url, null, headers), [request]);
  const post = useCallback((url, body, headers) => request('post', url, body, headers), [request]);
  const put = useCallback((url, body, headers) => request('put', url, body, headers), [request]);
  const del = useCallback((url, headers) => request('delete', url, null, headers), [request]);

  return {
    loading,
    error,
    data,
    get,
    post,
    put,
    delete: del
  };
};

export default useApi;