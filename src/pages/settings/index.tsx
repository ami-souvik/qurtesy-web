import { CurrencySettings } from '../../components/currency/currency-settings';
import { NotificationSettingsPanel } from '../../components/notifications';

export const Settings = () => {
  return (
    <div className="space-y-6">
      <CurrencySettings />
      <NotificationSettingsPanel />
    </div>
  );
};
