import axios from 'axios';
import { logOut } from '../util/logout';
import { AuthApi, CustomersApi, Configuration, RolesApi, PermissionsApi, AdminApi } from './client-axios';

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
    if (error?.response?.status === 401) {
      logOut();
    }
    return Promise.reject(error);
  }
);

const authApi = new AuthApi(config, undefined, axiosInstance);
const customerApi = new CustomersApi(config, undefined, axiosInstance);
const roleApi = new RolesApi(config, undefined, axiosInstance);
const permissionApi = new PermissionsApi(config, undefined, axiosInstance);
const adminApi = new AdminApi(config, undefined, axiosInstance);

export { authApi, customerApi, roleApi, permissionApi, adminApi };
