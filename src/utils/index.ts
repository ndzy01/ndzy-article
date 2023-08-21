import axios, { AxiosRequestHeaders } from 'axios';
import { message as antMsg } from 'antd';

antMsg.config({
  top: 100,
  duration: 3,
  maxCount: 1,
});

export const serviceAxios = axios.create({
  baseURL: 'https://ndzy-server.vercel.app', // 生产请求地址
  // baseURL: 'http://localhost:3000', // 开发请求地址
  timeout: 10000, // 请求超时设置
  withCredentials: false, // 跨域请求是否需要携带 cookie
});

// 创建请求拦截
serviceAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers = { Authorization: 'Basic' + ' ' + token } as AxiosRequestHeaders;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// 创建响应拦截
serviceAxios.interceptors.response.use(
  (res) => {
    const data = res.data;

    if (res.data.status === 1) {
      antMsg.error(res.data.msg);
    }

    if (res.data.status === 0) {
      antMsg.success(res.data.msg);
    }

    if (res.data.status === 2) {
      localStorage.setItem('token', '');
    }

    return data;
  },
  (error) => {
    let message = '';
    if (error && error.response) {
      switch (error.response.status) {
        case 302:
          message = '接口重定向了！';
          antMsg.error(message);
          break;
        case 400:
          message = '参数不正确！';
          antMsg.error(message);
          break;
        case 401:
          message = '您未登录，或者登录已经超时，请先登录！';
          antMsg.error(message);
          break;
        case 403:
          message = '您没有权限操作！';
          antMsg.error(message);
          break;
        case 404:
          message = `请求地址出错: ${error.response.config.url}`;
          antMsg.error(message);
          break;
        case 408:
          message = '请求超时！';
          antMsg.error(message);
          break;
        case 409:
          message = '系统已存在相同数据！';
          antMsg.error(message);
          break;
        case 500:
          message = '服务器内部错误！';
          antMsg.error(message);
          break;
        case 501:
          message = '服务未实现！';
          antMsg.error(message);
          break;
        case 502:
          message = '网关错误！';
          antMsg.error(message);
          break;
        case 503:
          message = '服务不可用！';
          antMsg.error(message);
          break;
        case 504:
          message = '服务暂时无法访问，请稍后再试！';
          antMsg.error(message);
          break;
        case 505:
          message = 'HTTP 版本不受支持！';
          antMsg.error(message);
          break;
        default:
          message = '异常问题，请联系管理员！';
          antMsg.error(message);
          break;
      }
    }
    return Promise.reject(message);
  },
);
