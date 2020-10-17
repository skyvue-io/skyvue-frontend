import { useEffect, useState } from 'react';
import skyvueFetch from 'services/skyvueFetch';

const useTokenRefresh = () => {
  const [tokens, setTokens] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    error: boolean;
    disconnected: boolean;
  }>({
    accessToken: null,
    refreshToken: localStorage.getItem('refreshToken'),
    error: false,
    disconnected: false,
  });

  useEffect(() => {
    const getTokens = async () => {
      const res = await skyvueFetch().post('/auth/user/refresh', {
        refreshToken: localStorage.getItem('refreshToken'),
      })

      if (res.error === 'Failed to fetch') {
        setTokens({
          ...tokens,
          disconnected: true,
        })
        return;
      }
      if (res.error || res === 'JsonWebTokenError' || res === 'Authorization error') {
        setTokens({
          ...tokens,
          error: true,
        })
        return;
      }

      if (res.refreshToken && res.accessToken) {
        localStorage.setItem('refreshToken', res.refreshToken);
        setTokens({
          ...res
        })
      }
    }

    if (tokens.refreshToken && !tokens.accessToken) {
      getTokens();
    }
  }, [tokens])

  return tokens;
}

export default useTokenRefresh;