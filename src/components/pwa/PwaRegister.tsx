'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;

    const registrar = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (erro) {
        console.error('Erro ao registrar service worker:', erro);
      }
    };

    registrar();
  }, []);

  return null;
}
