import axios from 'axios';
import { AuthApi, CustomersApi, Configuration, RolesApi, PermissionsApi } from './client-axios';

const config = new Configuration({
  basePath: process.env.REACT_APP_API_URL,
  accessToken: localStorage.getItem('token') || undefined,
});
export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const path = window.location.pathname.split('/');
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      if (path[1] == 'admin') window.location.href = '/admin/signin';
      else window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

const authApi = new AuthApi(config, undefined, axiosInstance);
const customerApi = new CustomersApi(config, undefined, axiosInstance);
const roleApi = new RolesApi(config, undefined, axiosInstance);
const permissionApi = new PermissionsApi(config, undefined, axiosInstance);

export { authApi, customerApi, roleApi, permissionApi };
