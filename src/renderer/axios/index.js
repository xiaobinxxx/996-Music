import axios from 'axios'
import { Loading } from 'element-ui';
const buseUrl = 'http://api.mtnhao.com';

/**
 * 拦截器
 */
const service = axios.create({
  baseURL: 'http://api.mtnhao.com/',
  timeout: 50000
});
// 加载前
service.interceptors.request.use(config => {
  return config;
})
// 加载后
service.interceptors.response.use((resp) => {
  return Promise.resolve(resp.data);
})

export default service;
