import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
export const axiosBaseQuery = ({ baseUrl }: { baseUrl: string } = { baseUrl: '' }): BaseQueryFn<{
    url: string;
    method?: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    headers?: AxiosRequestConfig['headers'];
  }> =>
  async ({ url, method, data, params, headers }) => {
    try {
      axios.defaults.baseURL = baseUrl;
      const result = await axios({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };