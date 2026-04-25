import { Card, Typography, CardActionArea, Box } from '@mui/material';
import { Loop as LoopIcon } from '@mui/icons-material';
import type { Lottery } from '../types/lottery';
import { useLotterySelectionContext } from '../contexts/LotterySelectionContext';

interface LotteryCardProps {
  lottery: Lottery;
}

export function LotteryCard({ lottery }: LotteryCardProps) {
  const { toggleLottery, isSelected } = useLotterySelectionContext();
  const selected = isSelected(lottery.id);

  const handleClick = () => {
    toggleLottery(lottery.id);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: selected ? '2px solid' : '1px solid',
        borderColor: selected ? 'primary.main' : 'grey.300',
        backgroundColor: selected ? 'primary.50' : 'white',
        boxShadow: 'none',
        borderRadius: 1,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 2,
          borderColor: selected ? 'primary.dark' : 'grey.400',
        },
        position: 'relative',
      }}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          p: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                textAlign: 'left',
              }}
            >
              {lottery.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textAlign: 'left',
              }}
            >
              {lottery.prize}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                textAlign: 'left',
              }}
            >
              {lottery.id}
            </Typography>
          </Box>
          <LoopIcon
            sx={{
              color: 'text.primary',
              fontSize: 24,
              ml: 2,
              position: 'absolute',
              top: 12,
              right: 12,
            }}
          />
        </Box>
      </CardActionArea>
    </Card>
  );
}
