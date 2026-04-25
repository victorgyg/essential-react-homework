import { Fab, Badge } from '@mui/material';
import { HowToReg as HowToRegIcon } from '@mui/icons-material';
import { useLotteryModalsContext } from '../contexts/LotteryModalsContext';
import { useLotterySelectionContext } from '../contexts/LotterySelectionContext';

export function RegisterLottery() {
  const { openRegisterModal } = useLotteryModalsContext();
  const { selectedLotteryIds } = useLotterySelectionContext();
  const count = selectedLotteryIds.length;
  const disabled = count === 0;

  const handleClick = () => {
    if (!disabled) {
      openRegisterModal();
    }
  };

  return (
    <Badge badgeContent={count} color="primary">
      <Fab
        variant="extended"
        color="primary"
        onClick={handleClick}
        disabled={disabled}
        aria-label="register for selected lotteries"
      >
        <HowToRegIcon sx={{ mr: 1 }} />
        Register
      </Fab>
    </Badge>
  );
}
