import { sqlite } from '../config';
import { useEffect, useState } from 'react';

export const useInitApp = () => {
  const [loading, setLoading] = useState(true);
  const initSQlite = async () => {
    await sqlite.ready;
    await sqlite.sync();
    setLoading(false);
  };
  useEffect(() => {
    // setTimeout(() => {
    initSQlite();
    // }, 2000)
  }, []);
  return { loading };
};
