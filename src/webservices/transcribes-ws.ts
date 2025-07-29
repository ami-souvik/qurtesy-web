import { BaseInstance } from './http-client';

export const postTranscribe = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return BaseInstance.httpClient
    ._post('/transcribes/', formData)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const queueTranscribe = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return BaseInstance.httpClient
    ._post('/transcribes/queue', formData)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};
