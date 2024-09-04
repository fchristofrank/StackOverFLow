import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const REACT_APP_API_URL = 'http://localhost:8000';

/**
 * Function to handle successful responses
 */
const handleRes = (res: AxiosResponse<any>) => res;

/**
 * Function to handle errors
 */
const handleErr = (err: AxiosError<any>) => {
  // eslint-disable-next-line no-console
  console.log(err);
  return Promise.reject(err);
};

const api = axios.create({ withCredentials: true });

/**
 * Add a request interceptor to the Axios instance.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError<any>) => handleErr(error),
);

/**
 * Add a response interceptor to the Axios instance.
 */
api.interceptors.response.use(
  (response: AxiosResponse<any>) => handleRes(response),
  (error: AxiosError<any>) => handleErr(error),
);

export { REACT_APP_API_URL, api };
