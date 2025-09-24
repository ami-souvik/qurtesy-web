import { useState } from 'react';
import { Button } from '../../components/action/button';
import { CurrencySettings } from '../../components/currency/currency-settings';
import { NotificationSettingsPanel } from '../../components/notifications';
import { trainSvm } from '../../infrastructure/agent/handler';

export const Settings = () => {
  const [status, setStatus] = useState<null | string>(null);
  const handler = () => {
    trainSvm().then((d: string) => setStatus(d));
  };
  return (
    <div className="space-y-6">
      <Button onClick={handler}>Train</Button>
      <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
        {status}
      </p>
      <CurrencySettings />
      <NotificationSettingsPanel />
    </div>
  );
};
