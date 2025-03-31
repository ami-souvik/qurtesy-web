import axios from 'axios';
import { BASE_URL } from '../config';

export const postTranscribe = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios
    .post(`${BASE_URL}/transcribes/`, formData)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const queueTranscribe = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios
    .post(`${BASE_URL}/transcribes/queue`, formData)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};
