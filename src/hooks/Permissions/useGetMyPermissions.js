import { useGetPermissionsQuery } from "@services";

export function useGetMyPermissions() {
  const { permissions = [] } = useGetPermissionsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      permissions: data?.permissions || [],
    }),
  });

  return {
    permissions,
  };
}
