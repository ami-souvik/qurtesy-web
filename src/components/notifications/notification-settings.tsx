import React, { useState, useEffect } from 'react';
import { notificationService, NotificationSettings } from './notification-service';
import { Bell, Settings, Volume2, VolumeX, AlertTriangle, DollarSign } from 'lucide-react';

export const NotificationSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>(notificationService.getSettings());
  const [permissionStatus, setPermissionStatus] = useState<string>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const updateSetting = (key: keyof NotificationSettings, value: NotificationSettings[keyof NotificationSettings]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    notificationService.updateSettings({ [key]: value });
  };

  const requestNotificationPermission = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      updateSetting('pushNotifications', true);
      setPermissionStatus('granted');
    } else {
      setPermissionStatus('denied');
      alert('Notification permission denied.');
    }
  };

  const testNotification = () => {
    notificationService.addInfoNotification(
      'Test Notification',
      'This is a test notification to verify your settings.'
    );
  };
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-6 w-6 text-blue-400" />
        <h2 className="font-semibold text-white">Notification Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Push Notifications */}
        <div className="space-y-4">
          <h3 className="text-white flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Push Notifications</span>
          </h3>

          {permissionStatus === 'default' ? (
            <div className="glass-card rounded-lg p-4 bg-orange-500/10 border-orange-500/20">
              <p className="text-orange-200 mb-3">Enable browser notifications to receive alerts</p>
              <button
                onClick={requestNotificationPermission}
                className="glass-button px-4 py-2 rounded-lg text-orange-400 hover:text-orange-300 transition-colors"
              >
                Enable Push Notifications
              </button>
            </div>
          ) : permissionStatus === 'granted' ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓ Browser notifications enabled</span>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                  className="rounded"
                />
                <span className="text-slate-300">Active</span>
              </label>
            </div>
          ) : (
            <div className="glass-card rounded-lg p-4 bg-red-500/10 border-red-500/20">
              <p className="text-red-200 mb-2">Notifications are blocked</p>
              <p className="text-sm text-red-300">Please enable notifications in your browser settings</p>
            </div>
          )}
        </div>
        {/* Budget Alerts */}
        <div className="space-y-3">
          <h3 className="text-white flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Budget Alerts</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-slate-300">Budget warnings</span>
              <input
                type="checkbox"
                checked={settings.budgetWarnings}
                onChange={(e) => updateSetting('budgetWarnings', e.target.checked)}
                className="rounded"
              />
            </label>

            <div className="flex items-center space-x-4">
              <label className="text-slate-300">Warning threshold:</label>
              <input
                type="number"
                min="50"
                max="100"
                value={settings.budgetThreshold}
                onChange={(e) => updateSetting('budgetThreshold', parseInt(e.target.value))}
                className="w-16 glass-input rounded px-2 py-1 text-white"
              />
              <span className="text-slate-400">%</span>
            </div>
          </div>
        </div>

        {/* Expense Alerts */}
        <div className="space-y-3">
          <h3 className="text-lg text-white flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Expense Alerts</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-slate-300">Large expense alerts</span>
              <input
                type="checkbox"
                checked={settings.largeExpenseAlerts}
                onChange={(e) => updateSetting('largeExpenseAlerts', e.target.checked)}
                className="rounded"
              />
            </label>

            <div className="flex items-center space-x-4">
              <label className="text-slate-300">Alert threshold:</label>
              <input
                type="number"
                min="100"
                value={settings.largeExpenseThreshold}
                onChange={(e) => updateSetting('largeExpenseThreshold', parseInt(e.target.value))}
                className="w-20 glass-input rounded px-2 py-1 text-white"
              />
              <span className="text-slate-400">$</span>
            </div>
          </div>
        </div>
        {/* Sound Settings */}
        <div className="space-y-3">
          <h3 className="text-lg text-white flex items-center space-x-2">
            {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>Sound</span>
          </h3>

          <label className="flex items-center justify-between">
            <span className="text-slate-300">Play notification sounds</span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
              className="rounded"
            />
          </label>
        </div>

        {/* Test Button */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={testNotification}
            className="glass-button px-4 py-2 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
          >
            Test Notification
          </button>
        </div>
      </div>
    </div>
  );
};
