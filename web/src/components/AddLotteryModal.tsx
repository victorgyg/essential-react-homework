import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
  Box,
} from '@mui/material';
import { useCreateLottery } from '../hooks/useCreateLottery';
import { useAddLotteryModal } from '../hooks/useAddLotteryModal';

export function AddLotteryModal() {
  const { isOpen, close } = useAddLotteryModal();
  const [name, setName] = useState('');
  const [prize, setPrize] = useState('');
  const { createLottery, isLoading } = useCreateLottery();

  const handleClose = () => {
    if (!isLoading) {
      close();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createLottery(
      { name, prize, type: 'simple' },
      {
        onSuccess: () => {
          setName('');
          setPrize('');
          close();
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>Add a new lottery</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Lottery name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
              fullWidth
              autoFocus
              variant="standard"
            />
            <TextField
              label="Lottery prize"
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              disabled={isLoading}
              required
              fullWidth
              variant="standard"
            />
          </Stack>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                textTransform: 'uppercase',
                backgroundColor: '#e0e0e0',
                color: 'rgba(0, 0, 0, 0.87)',
                boxShadow: 1,
                '&:hover': {
                  backgroundColor: '#d0d0d0',
                },
                '&:disabled': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              {isLoading ? 'Adding...' : 'Add'}
            </Button>
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  );
}
