import { useUpdateSvodkaMutation } from "@services/index";
import { useMutationHandler } from "@hooks/useMutationHandler";

export const useUpdateSvodka = () => {
  const [
    updateSvodka,
    {
      isLoading: isLoadingUpdateSvodkaMutation,
      isSuccess: isSuccessUpdateSvodkaMutation,
      isError: isErrorUpdateSvodkaMutation,
      error: ErrorUpdateSvodkaMutation,
      reset: resetUpdateSvodkaMutation,
    },
  ] = useUpdateSvodkaMutation();

  const localIsResponseUpdateSvodkaMutation = useMutationHandler(
    isSuccessUpdateSvodkaMutation,
    isErrorUpdateSvodkaMutation,
    resetUpdateSvodkaMutation
  );

  return {
    updateSvodka,
    isLoadingUpdateSvodkaMutation,
    isSuccessUpdateSvodkaMutation,
    isErrorUpdateSvodkaMutation,
    ErrorUpdateSvodkaMutation,
    localIsResponseUpdateSvodkaMutation,
  };
};
