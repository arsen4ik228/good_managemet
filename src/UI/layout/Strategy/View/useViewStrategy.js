

import { useParams } from 'react-router-dom';

import { message, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

import { useGetSingleObjective } from '@hooks/Objective/useGetSingleObjective';
import { useGetSingleStrategy } from '@hooks/Strategy/useGetSingleStrategy';
import { useUpdateSingleStrategy } from '@hooks/Strategy/useUpdateSingleStrategy';
import { useAllStrategy } from '@hooks/Strategy/useAllStrategy';


export default function useViewStrategy() {
  const { strategyId } = useParams();

  const { currentStrategy } = useGetSingleStrategy(strategyId);
  const { currentObjective } = useGetSingleObjective(strategyId);

  const { updateStrategy } = useUpdateSingleStrategy();
  const { activeStrategyId } = useAllStrategy();

  const updateStrategyHandler = async () => {
    try {
      if (activeStrategyId) {
        Modal.confirm({
          title: "Есть активная стратегия",
          icon: <ExclamationCircleFilled />,
          content:
            "Чтобы сделать текущую стратегию активной нужно завершить старую.",
          okText: "Сделать",
          cancelText: "Не изменять",
          onOk: () => {
            // возвращаем Promise
            return (async () => {
              await updateStrategy({
                _id: activeStrategyId,
                state: "Завершено",
              }).unwrap();

              await updateStrategy({
                _id: strategyId,
                state: "Активный",
              }).unwrap();

              message.success("Стратегия обновлена!");
            })();
          },
        });
      } else {
        await updateStrategy({
          _id: strategyId,
          state: "Активный",
        }).unwrap();
      }
    } catch (err) {
      message.error("Ошибка!");
    }
  };

  return {
    currentStrategy, currentObjective, updateStrategyHandler
  };
}
