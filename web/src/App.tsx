import { Container, Typography, Box } from '@mui/material';
import { QueryProvider } from './providers/QueryProvider';
import { NotificationProvider } from './contexts/NotificationContext';
import { LotteryModalProvider } from './contexts/LotteryModalContext';
import { AddLottery } from './components/AddLottery';
import { AddLotteryModal } from './components/AddLotteryModal';
import { Notification } from './components/Notification';

function App() {
  return (
    <QueryProvider>
      <NotificationProvider>
        <LotteryModalProvider>
          <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                Lottery Management
              </Typography>
            </Box>
          </Container>
          <AddLottery />
          <AddLotteryModal />
          <Notification />
        </LotteryModalProvider>
      </NotificationProvider>
    </QueryProvider>
  );
}

export default App;
