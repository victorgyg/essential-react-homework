import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
  Box,
} from '@mui/material';
import { useAddLotteryModal } from '../hooks/useAddLotteryModal';
import { useAddLotteryForm } from '../hooks/useAddLotteryForm';

export function AddLotteryModal() {
  const { isOpen, close } = useAddLotteryModal();
  const { formik, isPending } = useAddLotteryForm({
    onSuccess: close,
  });

  const handleClose = () => {
    if (!isPending) {
      formik.resetForm();
      close();
    }
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
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Lottery name"
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
            <TextField
              label="Lottery prize"
              name="prize"
              value={formik.values.prize}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.prize && Boolean(formik.errors.prize)}
              helperText={formik.touched.prize && formik.errors.prize}
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
              {isPending ? 'Adding...' : 'Add'}
            </Button>
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  );
}
