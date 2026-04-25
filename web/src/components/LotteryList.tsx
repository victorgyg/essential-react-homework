import { Grid, CircularProgress, Alert, Box, Typography } from '@mui/material';
import { useGetLotteries } from '../hooks/useGetLotteries';
import { LotteryCard } from './LotteryCard';

export function LotteryList() {
  const { lotteries, isLoading, error } = useGetLotteries();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error.message || 'Failed to load lotteries'}
      </Alert>
    );
  }

  if (lotteries.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No lotteries available
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
          Create a new lottery to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {lotteries.map((lottery) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={lottery.id}>
          <LotteryCard lottery={lottery} />
        </Grid>
      ))}
    </Grid>
  );
}
