import { PersonalFinanceSection } from '.';

export type Category = {
  id: number;
  name: string;
  emoji: string;
  section: PersonalFinanceSection;
  deleted: boolean;
};

export type CreateCategory = {
  name: string;
  emoji?: string;
  section: PersonalFinanceSection;
};

export type UpdateCategory = {
  id: number;
  name?: string;
  emoji?: string;
  section?: PersonalFinanceSection;
};
