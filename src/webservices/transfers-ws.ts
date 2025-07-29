import { Transaction, CreateTransfer } from '../types';
import { BaseInstance } from './http-client';

export const postTransfer = async (data: CreateTransfer): Promise<Transaction[] | null> => {
  return BaseInstance.httpClient
    ._post('/api/transfers/', data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};
