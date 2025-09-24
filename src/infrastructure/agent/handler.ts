import { api } from '../../config';

export const handler = async (text: string) => {
  return await api.post('/parse', { text }).then((resp) => resp.data);
};

export const trainSvm = async () => {
  return await api.get<string>('/train').then((resp) => resp.data);
};
