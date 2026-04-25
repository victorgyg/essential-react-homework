import { useTransition } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateLottery } from './useCreateLottery';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Lottery name must be at least 3 characters')
    .required('Lottery name is required'),
  prize: Yup.string()
    .min(3, 'Prize must be at least 3 characters')
    .required('Prize is required'),
});

interface UseAddLotteryFormProps {
  onSuccess?: () => void;
}

export function useAddLotteryForm({ onSuccess }: UseAddLotteryFormProps = {}) {
  const { createLottery } = useCreateLottery();
  const [isPending, startTransition] = useTransition();

  const formik = useFormik({
    initialValues: {
      name: '',
      prize: '',
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      startTransition(() => {
        createLottery(
          { name: values.name, prize: values.prize, type: 'simple' },
          {
            onSuccess: () => {
              resetForm();
              onSuccess?.();
            },
          },
        );
      });
    },
  });

  return {
    formik,
    isPending,
  };
}
