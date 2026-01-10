import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline | VagaGoold',
  description: 'Pagina offline do portal de agendamentos',
};

export default function OfflinePage() {
  return (
    <main className="offline-page">
      <div className="offline-card">
        <h1>Voce esta offline</h1>
        <p>Conecte a internet para continuar usando o portal.</p>
      </div>
    </main>
  );
}
