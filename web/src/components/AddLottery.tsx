import { Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAddLotteryModal } from '../hooks/useAddLotteryModal';

export function AddLottery() {
  const { open } = useAddLotteryModal();

  return (
    <Fab
      color="primary"
      aria-label="add lottery"
      onClick={open}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
      }}
      variant="extended"
    >
      <AddIcon />
      Add Lottery
    </Fab>
  );
}
