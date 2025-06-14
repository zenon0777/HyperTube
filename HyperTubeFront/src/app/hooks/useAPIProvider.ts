// hooks/useAPIProvider.ts
import { useAppSelector, useAppDispatch } from '@/app/store';
import { setAPIProvider } from '@/app/store/apiProviderSlice';

export const useAPIProvider = () => {
  const dispatch = useAppDispatch();
  const APIProvider = useAppSelector((state) => state.APIProviderSlice.APIProvider);

  const changeProvider = (provider: 'TMDB' | 'YTS') => {
    dispatch(setAPIProvider(provider));
  };

  return {
    APIProvider,
    changeProvider,
    isYTS: APIProvider === 'YTS',
    isTMDB: APIProvider === 'TMDB',
  };
};