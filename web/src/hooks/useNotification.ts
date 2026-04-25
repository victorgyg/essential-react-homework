import { useNotificationContext } from '../contexts/NotificationContext';

export function useNotification() {
  const { showNotification } = useNotificationContext();
  return { showNotification };
}
