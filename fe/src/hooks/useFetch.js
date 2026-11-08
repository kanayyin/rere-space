import { useCallback, useEffect, useRef, useState } from 'react';

export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    const controller = new AbortController();
    fetcherRef.current(controller.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => { if (err.name !== 'AbortError') setState({ data: null, loading: false, error: err }); });
    return controller;
  }, []);

  useEffect(() => {
    const c = run();
    return () => c.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, reload: run };
}
