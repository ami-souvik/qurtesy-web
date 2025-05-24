import { Budget } from '../../types';

interface Notification {
  id: string;
  type: 'warning' | 'alert' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  budgetWarnings: boolean;
  largeExpenseAlerts: boolean;
  largeExpenseThreshold: number;
  budgetThreshold: number;
  soundEnabled: boolean;
  emailNotifications: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  pushNotifications: false,
  budgetWarnings: true,
  largeExpenseAlerts: true,
  largeExpenseThreshold: 500,
  budgetThreshold: 90,
  soundEnabled: true,
  emailNotifications: false,
};

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private settings: NotificationSettings = DEFAULT_SETTINGS;
  private storageKey = 'qurtesy_notification_settings';

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load notification settings:', error);
    }
  }
  private saveSettings() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save notification settings:', error);
    }
  }

  public getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notify();

    if (this.settings.pushNotifications) {
      this.showBrowserNotification(newNotification);
    }

    if (this.settings.soundEnabled) {
      this.playNotificationSound();
    }
  }
  removeNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      this.notify();
    }
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.notify();
  }

  clearAllNotifications() {
    this.notifications = [];
    this.notify();
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  checkBudgetWarnings(budgets: Budget[]) {
    if (!this.settings.budgetWarnings) return;

    budgets.forEach((budget) => {
      if (budget.is_over_budget) {
        this.addNotification({
          type: 'warning',
          title: 'Budget Exceeded',
          message: `You've exceeded your ${budget.category.value} budget by $${Math.abs(budget.remaining_amount).toFixed(2)}`,
        });
      } else if (budget.percentage_used >= this.settings.budgetThreshold) {
        this.addNotification({
          type: 'alert',
          title: 'Budget Almost Reached',
          message: `Your ${budget.category.value} budget is ${budget.percentage_used.toFixed(1)}% used`,
        });
      }
    });
  }
  checkLargeExpense(amount: number, category: string) {
    if (!this.settings.largeExpenseAlerts) return;

    if (amount > this.settings.largeExpenseThreshold) {
      this.addNotification({
        type: 'info',
        title: 'Large Expense Recorded',
        message: `$${amount.toFixed(2)} expense recorded in ${category}`,
      });
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  private showBrowserNotification(notification: Notification) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
      });

      setTimeout(() => browserNotification.close(), 5000);
    } catch (error) {
      console.warn('Failed to show browser notification:', error);
    }
  }
  private playNotificationSound() {
    try {
      const audioContext = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }

  addSuccessNotification(title: string, message: string) {
    this.addNotification({ type: 'success', title, message });
  }

  addErrorNotification(title: string, message: string) {
    this.addNotification({ type: 'warning', title, message });
  }

  addInfoNotification(title: string, message: string) {
    this.addNotification({ type: 'info', title, message });
  }
}

export const notificationService = new NotificationService();
export type { Notification };
