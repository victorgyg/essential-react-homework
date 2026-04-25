import { Snackbar } from '@mui/material';
import { useNotificationContext } from '../contexts/NotificationContext';

export function Notification() {
  const { notification, hideNotification } = useNotificationContext();

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={hideNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      message={notification.message}
    />
  );
}
