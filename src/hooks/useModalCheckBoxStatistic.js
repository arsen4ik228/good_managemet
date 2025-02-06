import { useGetStatisticsQuery } from "@services";
import { useState, useEffect } from "react";
import useGetOrganizationId from "./useGetReduxOrganization";

export function useModalCheckBoxStatistic({
  openModalStatistic,
  setStatisticsChecked,
}) {
  const [
    filterArraySearchModalStatistics,
    setFilterArraySearchModalStatistics,
  ] = useState([]);

  const [inputSearchModalStatistics, setInputSearchModalStatistics] =
    useState("");

  const { reduxNewSelectedOrganizationId } = useGetOrganizationId();

  const {
    statistics = [],
    isLoadingStatistic,
    isErrorStatistic,
  } = useGetStatisticsQuery(
    { organizationId: reduxNewSelectedOrganizationId, statisticData: false },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        statistics: data || [],
        isLoadingStatistic: isLoading,
        isErrorStatistic: isError,
      }),
      skip: !openModalStatistic,
    }
  );

  const handleChecboxChangeStatistics = (id) => {
    setStatisticsChecked((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const searchStatistics = (e) => {
    setInputSearchModalStatistics(e.target.value);
  };

  const resetStatisticsId = () => {
    setInputSearchModalStatistics("");
    setFilterArraySearchModalStatistics([]);
    setStatisticsChecked([]);
  };

  useEffect(() => {
    if (inputSearchModalStatistics !== "") {
      const filtered = statistics.filter((item) =>
        item.name
          .toLowerCase()
          .includes(inputSearchModalStatistics.toLowerCase())
      );
      setFilterArraySearchModalStatistics(filtered);
    } else {
      setFilterArraySearchModalStatistics([]);
    }
  }, [inputSearchModalStatistics]);

  return {
    statistics,
    isErrorStatistic,
    isLoadingStatistic,
    inputSearchModalStatistics,
    filterArraySearchModalStatistics,

    handleChecboxChangeStatistics,
    searchStatistics,
    resetStatisticsId,
  };
}
