import { useParams } from "react-router-dom";
import { useGetSingleStrategy } from "@hooks/Strategy/useGetSingleStrategy";

export default function useSplitStrategy() {
  const { strategyId } = useParams();
  const { currentStrategy } = useGetSingleStrategy(strategyId);
  return { currentStrategy };
}
