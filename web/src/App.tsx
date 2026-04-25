import { Container, Typography, Box } from '@mui/material';
import { Casino as CasinoIcon } from '@mui/icons-material';
import { QueryProvider } from './providers/QueryProvider';
import { NotificationProvider } from './contexts/NotificationContext';
import { LotteryModalsProvider } from './contexts/LotteryModalsContext';
import { LotterySelectionProvider } from './contexts/LotterySelectionContext';
import { AddLottery } from './components/AddLottery';
import { RegisterLottery } from './components/RegisterLottery';
import { AddLotteryModal } from './components/AddLotteryModal';
import { RegisterModal } from './components/RegisterModal';
import { LotteryList } from './components/LotteryList';
import { Notification } from './components/Notification';

function App() {
  return (
    <QueryProvider>
      <NotificationProvider>
        <LotteryModalsProvider>
          <LotterySelectionProvider>
            <Container
              maxWidth="xl"
              sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              <Box
                sx={{
                  my: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: 'center',
                }}
              >
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                    fontWeight: 300,
                  }}
                >
                  Lotteries
                </Typography>
                <CasinoIcon sx={{ fontSize: { xs: 32, sm: 40, md: 48 } }} />
              </Box>
              <LotteryList />
            </Container>
            <Box
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                display: 'flex',
                gap: 2,
                zIndex: 1000,
              }}
            >
              <RegisterLottery />
              <AddLottery />
            </Box>
            <AddLotteryModal />
            <RegisterModal />
            <Notification />
          </LotterySelectionProvider>
        </LotteryModalsProvider>
      </NotificationProvider>
    </QueryProvider>
  );
}

export default App;
