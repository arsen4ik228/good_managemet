import { useGetPermissionsQuery } from "@services";
import { homeUrl } from "@helpers/constants";

export function useModuleActions(section, id) {
  // Получаем права
  const { data, isLoading } = useGetPermissionsQuery();
  const permissions = data?.permissions || [];

  // Проверяем, есть ли доступ на обновление для нужного модуля
  const canUpdate = permissions.find((p) => p.module === section)?.canUpdate;
  const canCreate = permissions.find((p) => p.module === section)?.canCreate;

  // Все возможные кнопки
  const allButtonsForUpdate = {
    goal: [
      {
        text: "Редактировать",
        click: () => window.open(`${homeUrl}#/editGoal`, "_blank"),
      },
    ],
    policy: [
      {
        text: "Редактировать",
        click: () => window.open(`${homeUrl}#/editPolicy/${id}`, "_blank"),
      },
    ],
    post: [
      {
        text: "Редактировать",
        click: () => window.open(`${homeUrl}#/editPost/${id}`, "_blank"),
      },
    ],
    statistic: [
      {
        text: "Редактировать",
        click: () =>
          window.open(`${homeUrl}#/editStatisticInformation/${id}`, "_blank"),
      },
      {
        text: "Ввести данные",
        click: () =>
          window.open(`${homeUrl}#/editStatisticPointsData/${id}`, "_blank"),
      },
    ],
  };

  // Возвращаем кнопки только если есть права на обновление
  return {
    buutonsArr: canUpdate ? allButtonsForUpdate[section] || [] : [],
    isCreate: canCreate ? true : false,
    isChange_control_panel: canUpdate ? true : false,
    isChange_svodka: canUpdate ? true : false,
    isLoading,
  };
}
