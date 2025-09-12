import _ from 'lodash';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const BASEURL_PREFIX = import.meta.env.PROD ? '' : 'http://localhost:2517';

class Api {
  _service: AxiosInstance;
  _timeout: number = 40000;
  _baseUrl: string = BASEURL_PREFIX + '/api';
  _setConfig() {}
  _setRequestInterceptor(_service: AxiosInstance) {
    _service.interceptors.request.use((config) => {
      config.headers.Authorization = 'Bearer ABC1234';
      return config;
    });
  }
  _setResponseInterceptor(_service: AxiosInstance) {
    _service.interceptors.response.use(
      async (response) => {
        return response;
      },
      async (error) => {
        // Check network error and retry
        console.error(error.message);
      }
    );
  }

  constructor() {
    this._setConfig();
    const service = axios.create({
      timeout: this._timeout,
      baseURL: this._baseUrl,
    });
    this._setRequestInterceptor(service);
    this._setResponseInterceptor(service);
    this._service = _.cloneDeep(service);
  }
  get<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this._service.get(path, config);
  }
  post<T>(path: string, data: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this._service.post(path, data, config);
  }
  put<T>(path: string, data: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this._service.put(path, data, config);
  }
  patch<T>(path: string, data: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this._service.patch(path, data, config);
  }
  delete<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this._service.delete(path, config);
  }
}

export { Api };
