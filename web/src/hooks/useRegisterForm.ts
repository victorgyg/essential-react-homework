import { useTransition } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { Lottery } from '../types/lottery';
import { useRegisterMultipleLotteries } from './useRegisterMultipleLotteries';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
});

interface UseRegisterFormProps {
  lotteries: Lottery[];
  onSuccess?: () => void;
}

export function useRegisterForm({
  lotteries,
  onSuccess,
}: UseRegisterFormProps) {
  const { registerMultiple } = useRegisterMultipleLotteries();
  const [isPending, startTransition] = useTransition();

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      startTransition(() => {
        registerMultiple(
          { lotteries, name: values.name },
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
