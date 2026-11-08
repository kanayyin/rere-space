import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

const ConfigContext = createContext({ config: { storeName: 'PastelShop', adminWhatsapp: '' } });

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({ storeName: 'PastelShop', adminWhatsapp: '' });

  useEffect(() => {
    api.get('/public/config').then(setConfig).catch(() => {});
  }, []);

  return <ConfigContext.Provider value={{ config }}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  return useContext(ConfigContext);
}
