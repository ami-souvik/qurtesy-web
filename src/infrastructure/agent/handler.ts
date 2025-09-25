import { api } from '../../config';

export const handler = async (text: string): Promise<string> => {
  const {
    result: { amount, entities, category, transaction_type },
  } = await api
    .post<{
      result: {
        amount?: string;
        entities: string[];
        category: string;
        transaction_type: string;
      };
    }>('/parse', { text })
    .then((resp) => resp.data);
  return `amount: ${amount || ''}\nentities: ${JSON.stringify(entities)}\ncategory: ${category}\ntype: ${transaction_type}`;
};

export const trainSvm = async () => {
  return await api.get<string>('/train').then((resp) => resp.data);
};
