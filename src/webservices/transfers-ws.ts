import axios from 'axios';
import { Transaction, CreateTransfer } from '../types';

export const postTransfer = async (data: CreateTransfer): Promise<Transaction[] | null> => {
  return axios
    .post('http://localhost:8000/transfers', data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};
