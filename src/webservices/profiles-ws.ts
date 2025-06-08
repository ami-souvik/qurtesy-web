import axios from 'axios';
import { BASE_URL } from '../config';
import { Profile, CreateProfile, UpdateProfileData } from '../types/daily-expenses';

export const getProfiles = async (): Promise<Profile[]> => {
  return axios
    .get(`${BASE_URL}/api/profiles/`)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log('Error fetching profiles:', err);
      return [];
    });
};

export const createProfile = async (data: CreateProfile): Promise<Profile | null> => {
  return axios
    .post(`${BASE_URL}/api/profiles/`, data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log('Error creating profile:', err);
      throw err;
    });
};

export const updateProfile = async (id: number, data: UpdateProfileData): Promise<Profile | null> => {
  return axios
    .put(`${BASE_URL}/api/profiles/${id}`, data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log('Error updating profile:', err);
      throw err;
    });
};

export const deleteProfile = async (id: number): Promise<void> => {
  return axios
    .delete(`${BASE_URL}/api/profiles/${id}`)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log('Error deleting profile:', err);
      throw err;
    });
};
