import { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AuthErrorModal from '../components/Ui/Modals/AuthErrorModal/AuthErrorModal';

class HttpError extends Error {
  constructor(message, errorCode) {
      super(message);
      this.code = errorCode;
  }
}


export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setError] = useState(null);
  const authSelector = useSelector(state => state.auth)
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );
        if (!response.ok) {
            throw new HttpError(responseData.message,response.status);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        console.log("err")
        console.log(err)
        console.log(err.message)
        if(err.code === 401 && authSelector.isLoggedIn){
          setError(<AuthErrorModal/>);
        }else{
          setError(err.message);
        }
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, httpError, sendRequest, clearError };
};
