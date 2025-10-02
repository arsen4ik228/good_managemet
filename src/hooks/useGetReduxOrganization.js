import { useSelector } from "react-redux";

export default function useGetReduxOrganization() {
  const reduxSelectedOrganizationId = useSelector(
    (state) => state.localStorage.reduxSelectedOrganizationId
  );
  const reduxSelectedOrganizationReportDay = useSelector(
    (state) => state.localStorage.reduxSelectedOrganizationReportDay
  );
  const reduxSelectedOrganizationName = useSelector(
    (state) => state.localStorage.reduxSelectedOrganizationName
  )
  return {
    reduxSelectedOrganizationId,
    reduxSelectedOrganizationReportDay,
    reduxSelectedOrganizationName
  }
}
