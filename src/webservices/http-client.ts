import _ from 'lodash';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type ClientConfig = {
  baseUrl: string;
};

class HttpClient {
  _service: AxiosInstance;
  _timeout: number = 40000;
  _baseUrl: string = '';
  _setConfig(clientConfig: ClientConfig) {
    this._baseUrl = clientConfig.baseUrl;
  }
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

  constructor(clientConfig: ClientConfig) {
    this._setConfig(clientConfig);
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
  httpClient: {} as HttpClient,
};

export { BaseInstance, HttpClient };
