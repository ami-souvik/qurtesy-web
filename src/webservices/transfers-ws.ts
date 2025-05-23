import axios from 'axios';
import { BASE_URL } from '../config';
import { Transaction, CreateTransfer } from '../types';

export const postTransfer = async (data: CreateTransfer): Promise<Transaction[] | null> => {
  return axios
    .post(`${BASE_URL}/api/transfers/`, data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};
