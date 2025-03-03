

import {
    usePostPostsMutation,
  } from "@services/index";
  import useGetReduxOrganization from "@hooks/useGetReduxOrganization";
  import { useMutationHandler } from "@hooks/useMutationHandler";
  
  export const useCreatePost = () => {
    const { reduxSelectedOrganizationId } = useGetReduxOrganization();
  
     const [
       createPost,
       {
         isLoading: isLoadingPostMutation,
         isSuccess: isSuccessPostMutation,
         isError: isErrorPostMutation,
         error: ErrorPostMutation,
         reset:resetPostPostMutation,
       },
     ] = usePostPostsMutation();
   
     const localIsResponsePostPostMutation = useMutationHandler(
       isLoadingPostMutation,
       isSuccessPostMutation,
       resetPostPostMutation
     );
  
    return {
      reduxSelectedOrganizationId,
  
      createPost,
      isLoadingPostMutation,
      isSuccessPostMutation,
      isErrorPostMutation,
      ErrorPostMutation,
      localIsResponsePostPostMutation,
    };
  };
  