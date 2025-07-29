import { Profile, CreateProfile, UpdateProfileData } from '../types/daily-expenses';
import { BaseInstance } from './http-client';

export const getProfiles = async (): Promise<Profile[]> => {
  return BaseInstance.httpClient
    ._get('/api/profiles/')
    .then((resp) => resp.data)
    .catch((err) => {
      console.log('Error fetching profiles:', err);
      return [];
    });
};

export const createProfile = async (data: CreateProfile): Promise<Profile | null> => {
  return BaseInstance.httpClient
    ._post('/api/profiles/', data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log('Error creating profile:', err);
      throw err;
    });
};

export const updateProfile = async (id: number, data: UpdateProfileData): Promise<Profile | null> => {
  return BaseInstance.httpClient
    ._put(`/api/profiles/${id}`, data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log('Error updating profile:', err);
      throw err;
    });
};

export const deleteProfile = async (id: number): Promise<void> => {
  return BaseInstance.httpClient
    ._del(`/api/profiles/${id}`)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log('Error deleting profile:', err);
      throw err;
    });
};
