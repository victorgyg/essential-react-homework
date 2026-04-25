import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { useRegisterModal } from '../hooks/useRegisterModal';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { useGetLotteries } from '../hooks/useGetLotteries';

export function RegisterModal() {
  const { isOpen, selectedLotteryIds, close, clearSelection } =
    useRegisterModal();
  const { lotteries } = useGetLotteries();

  const selectedLotteries = lotteries.filter((l) =>
    selectedLotteryIds.includes(l.id),
  );

  const { formik, isPending } = useRegisterForm({
    lotteries: selectedLotteries,
    onSuccess: () => {
      clearSelection();
      close();
    },
  });

  const handleClose = () => {
    if (!isPending) {
      formik.resetForm();
      close();
    }
  };

  const count = selectedLotteryIds.length;

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
      <DialogTitle sx={{ pb: 1 }}>
        Register for {count} {count === 1 ? 'Lottery' : 'Lotteries'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected lotteries:
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                flexWrap: 'wrap',
                gap: 1,
                maxHeight: 120,
                overflowY: 'auto',
              }}
            >
              {selectedLotteries.map((lottery) => (
                <Chip
                  key={lottery.id}
                  label={`${lottery.name} - ${lottery.prize}`}
                  size="small"
                  sx={{ maxWidth: '100%' }}
                />
              ))}
            </Stack>
          </Box>
          <Stack spacing={3}>
            <TextField
              label="Your name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              disabled={isPending}
              fullWidth
              variant="standard"
            />
          </Stack>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending || !formik.isValid}
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
              {isPending ? 'Registering...' : 'Register'}
            </Button>
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  );
}
