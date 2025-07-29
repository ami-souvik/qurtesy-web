import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BaseInstance, HttpClient } from '../webservices/http-client';
import { RootState } from '../store.types';
import { setLoading } from '../slices/state-slice';

export const useInitApp = () => {
  const dispatch = useDispatch();
  const { baseUrl } = useSelector(({ state }: RootState) => state);
  useEffect(() => {
    dispatch(setLoading(true));
    BaseInstance.httpClient = new HttpClient({ baseUrl });
    dispatch(setLoading(false));
  }, [baseUrl]);
};
