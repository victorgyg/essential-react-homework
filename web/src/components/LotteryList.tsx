import { useState, useMemo } from 'react';
import {
  Grid,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Fade,
} from '@mui/material';
import { useGetLotteries } from '../hooks/useGetLotteries';
import { useDebounce } from '../hooks/useDebounce';
import { LotteryCard } from './LotteryCard';
import { SearchFilter } from './SearchFilter';

export function LotteryList() {
  const { lotteries, isLoading, error } = useGetLotteries();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredLotteries = useMemo(() => {
    if (!debouncedSearch.trim()) return lotteries;

    const searchLower = debouncedSearch.toLowerCase();
    return lotteries.filter(
      (lottery) =>
        lottery.name.toLowerCase().includes(searchLower) ||
        lottery.prize.toLowerCase().includes(searchLower),
    );
  }, [lotteries, debouncedSearch]);

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
    <>
      <SearchFilter value={searchTerm} onChange={setSearchTerm} />

      {filteredLotteries.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No lotteries found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {filteredLotteries.map((lottery) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={lottery.id}
              sx={{ display: 'flex' }}
            >
              <Fade in timeout={300} style={{ width: '100%' }}>
                <Box sx={{ height: '100%', width: '100%' }}>
                  <LotteryCard lottery={lottery} />
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
