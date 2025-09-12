import _ from 'lodash';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const BASEURL_PREFIX = import.meta.env.PROD ? '' : 'http://localhost:2517';

class HttpClient {
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
  _get(path: string, config?: AxiosRequestConfig) {
    return this._service.get(path, config);
  }
  _post(path: string, data: object, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._service.post(path, data, config);
  }
  _put(path: string, data: object, config?: AxiosRequestConfig) {
    return this._service.put(path, data, config);
  }
  _patch(path: string, data: object, config?: AxiosRequestConfig) {
    return this._service.patch(path, data, config);
  }
  _del(path: string, config?: AxiosRequestConfig) {
    return this._service.delete(path, config);
  }
}

const BaseInstance = {
  httpClient: new HttpClient(),
};

export { BaseInstance, HttpClient };
