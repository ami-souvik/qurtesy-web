import axios from 'axios';

export const postTranscribe = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios
    .post('http://localhost:8000/transcribes/', formData)
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
    .post('http://localhost:8000/transcribes/queue', formData)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};
