import { useState, useEffect } from "react";
import {
  useDeleteDirectoriesMutation,
  useGetDirectoriesQuery,
  usePostDirectoriesMutation,
  useUpdateDirectoriesMutation,
} from "@hooks";
import { usePolicyDirectoriesHook } from "../../../../hooks/usePolicyDirectoriesHook";

export function useDirectories({ instructionsActive, directivesActive }) {
  const [currentDirectoryName, setCurrentDirectoryName] = useState();
  const [currentDirectoryId, setCurrentDirectoryId] = useState();

  const [openModalCreateDirectory, setOpenModalCreateDirectory] =
    useState(false);
  const [openModalUpdateDirectory, setOpenModalUpdateDirectory] =
    useState(false);
  const [openModalDeleteDirectory, setOpenModalDeleteDirectory] =
    useState(false);

  const [directoryName, setDirectoryName] = useState("");

  const [directoriesSendBD, setDirectoriesSendBD] = useState([]);
  const [directoriesUpdate, setDirectoriesUpdate] = useState([]);

  const [currentDirectoryInstructions, setCurrentDirectoryInstructions] =
    useState([]);
  const [currentDirectoryDirectives, setCurrentDirectoryDirectives] = useState(
    []
  );

  const [inputSearchModalDirectory, setInputSearchModalDirectory] =
    useState("");
  const [
    filterArraySearchModalDirectives,
    setFilterArraySearchModalDirectives,
  ] = useState([]);
  const [
    filterArraySearchModalInstructions,
    setFilterArraySearchModalInstructions,
  ] = useState([]);

  const {
    folders,
    foldersSort,
    isLoadingGetPolicyDirectories,
    isErrorGetPolicyDirectories,
    isFetchingGetPolicyDirectories,

    deletePolicyDirectories,
    isLoadingDeletePolicyDirectoriesMutation,
    isSuccessDeletePolicyDirectoriesMutation,
    isErrorDeletePolicyDirectoriesMutation,
    ErrorDeleteDirectories,
    localIsResponseDeletePolicyDirectoriesMutation,

    updatePolicyDirectories,
    isLoadingUpdatePolicyDirectoriesMutation,
    isSuccessUpdatePolicyDirectoriesMutation,
    isErrorUpdatePolicyDirectoriesMutation,
    ErrorUpdateDirectories,
    localIsResponseUpdatePolicyDirectoriesMutation,

    postDirectory,
    isLoadingPostPoliciesDirectoriesMutation,
    isSuccessPostPoliciesDirectoriesMutation,
    isErrorPostPoliciesDirectoriesMutation,
    ErrorPostPoliciesDirectoriesMutation,
    localIsResponsePostPolicyDirectoriesMutation,
  } = usePolicyDirectoriesHook();

  const saveFolder = async () => {
    await postDirectory({
      directoryName: directoryName,
      policyToPolicyDirectories: directoriesSendBD,
    })
      .unwrap()
      .then(() => {
        setDirectoryName("");
        setDirectoriesSendBD([]);

        setOpenModalCreateDirectory(false);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const saveUpdateFolder = async () => {
    await updatePolicyDirectories({
      policyDirectoryId: currentDirectoryId,
      directoryName: currentDirectoryName,
      policyToPolicyDirectories: directoriesUpdate,
    })
      .unwrap()
      .then(() => {
        exitUpdateDirectory();
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const saveDeleteFolder = async () => {
    await deletePolicyDirectories({
      policyDirectoryId: currentDirectoryId,
    })
      .unwrap()
      .then(() => {
        setOpenModalDeleteDirectory(false);
        setOpenModalUpdateDirectory(false);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const openCreateDirectory = () => {
    setOpenModalCreateDirectory(true);
  };
  const exitCreateDirectory = () => {
    setOpenModalCreateDirectory(false);
  };

  const updateDirectory = (element) => {
    const obj = folders?.filter((item) => item.id === element.id);
    if (obj?.length > 0) {
      const { id, directoryName, policyToPolicyDirectories } = obj[0];
      const policyIds = policyToPolicyDirectories.map(
        (element) => element.policy.id
      );
      setDirectoriesUpdate(policyIds);
      const filterArray = instructionsActive
        .filter((item) => policyIds.includes(item.id))
        .map((item) => ({
          id: item.id,
          policyName: item.policyName,
          checked: true,
        }));
      const filterArray1 = directivesActive
        .filter((item) => policyIds.includes(item.id))
        .map((item) => ({
          id: item.id,
          policyName: item.policyName,
          checked: true,
        }));

      const update = currentDirectoryInstructions
        ?.map((item) => {
          const foundItem = filterArray?.find(
            (element) => item.id === element.id
          );
          return {
            id: item.id,
            policyName: item.policyName,
            checked: foundItem ? true : false,
          };
        })
        ?.sort((a, b) => {
          // Сначала сортируем по checked: true должны быть выше
          if (a.checked === b.checked) {
            // Если оба элемента имеют одинаковое значение checked, сортируем по policyName (алфавитно)
            return a.policyName.localeCompare(b.policyName);
          }
          return b.checked - a.checked; // true (1) должно быть выше false (0)
        });

      const update1 = currentDirectoryDirectives
        ?.map((item) => {
          const foundItem = filterArray1?.find(
            (element) => item.id === element.id
          );
          return {
            id: item.id,
            policyName: item.policyName,
            checked: foundItem ? true : false,
          };
        })
        ?.sort((a, b) => {
          // Сначала сортируем по checked: true должны быть выше
          if (a.checked === b.checked) {
            // Если оба элемента имеют одинаковое значение checked, сортируем по policyName (алфавитно)
            return a.policyName.localeCompare(b.policyName);
          }
          return b.checked - a.checked; // true (1) должно быть выше false (0)
        });
      setCurrentDirectoryInstructions(update);
      setCurrentDirectoryDirectives(update1);
      setCurrentDirectoryName(directoryName);
      setCurrentDirectoryId(id);
      setOpenModalUpdateDirectory(true);
    }
  };
  const exitUpdateDirectory = () => {
    setOpenModalUpdateDirectory(false);
  };

  const handleCheckboxChange = (id) => {
    setDirectoriesSendBD((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  const handleCheckboxChangeUpdate = (id, type) => {
    setDirectoriesUpdate((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });

    if (type === "directives") {
      setCurrentDirectoryDirectives((prev) => {
        return prev.map((item) => {
          if (item.id === id) {
            return { ...item, checked: !item.checked };
          }
          return item;
        });
      });
    }

    if (type === "instructions") {
      setCurrentDirectoryInstructions((prev) => {
        return prev.map((item) => {
          if (item.id === id) {
            return { ...item, checked: !item.checked };
          }
          return item;
        });
      });
    }
  };

  const handleInputChangeModalSearch = (e) => {
    setInputSearchModalDirectory(e.target.value);
  };

  useEffect(() => {
    if (inputSearchModalDirectory !== "") {
      const arrayDirectives = [...directivesActive];
      const arrayInstructions = [...instructionsActive];
      const filteredDirectives = arrayDirectives.filter((item) =>
        item.policyName
          .toLowerCase()
          .includes(inputSearchModalDirectory.toLowerCase())
      );
      const filteredInstructions = arrayInstructions.filter((item) =>
        item.policyName
          .toLowerCase()
          .includes(inputSearchModalDirectory.toLowerCase())
      );
      setFilterArraySearchModalDirectives(filteredDirectives);
      setFilterArraySearchModalInstructions(filteredInstructions);
    } else {
      setFilterArraySearchModalDirectives([]);
      setFilterArraySearchModalInstructions([]);
    }
  }, [inputSearchModalDirectory]);

  useEffect(() => {
    if (openModalUpdateDirectory === false) {
      setInputSearchModalDirectory("");
      setFilterArraySearchModalDirectives([]);
      setFilterArraySearchModalInstructions([]);
    }
  }, [openModalUpdateDirectory]);

  useEffect(() => {
    if (openModalCreateDirectory === false) {
      setInputSearchModalDirectory("");
      setFilterArraySearchModalDirectives([]);
      setFilterArraySearchModalInstructions([]);
    }
  }, [openModalCreateDirectory]);

  return {
    setCurrentDirectoryInstructions,
    setCurrentDirectoryDirectives,

    directoriesSendBD,
    currentDirectoryName,
    setCurrentDirectoryName,

    directoryName,
    setDirectoryName,

    currentDirectoryInstructions,
    currentDirectoryDirectives,

    inputSearchModalDirectory,
    filterArraySearchModalDirectives,
    filterArraySearchModalInstructions,

    //Получение папок
    foldersSort,
    isLoadingGetPolicyDirectories,
    isErrorGetPolicyDirectories,
    isFetchingGetPolicyDirectories,

    //Создание папки
    openModalCreateDirectory,

    openCreateDirectory,
    exitCreateDirectory,

    saveFolder,

    isLoadingPostPoliciesDirectoriesMutation,
    isSuccessPostPoliciesDirectoriesMutation,
    isErrorPostPoliciesDirectoriesMutation,
    ErrorPostPoliciesDirectoriesMutation,
    localIsResponsePostPolicyDirectoriesMutation,

    //Обновление папки
    openModalUpdateDirectory,

    updateDirectory,
    exitUpdateDirectory,

    saveUpdateFolder,

    isLoadingUpdatePolicyDirectoriesMutation,
    isSuccessUpdatePolicyDirectoriesMutation,
    isErrorUpdatePolicyDirectoriesMutation,
    ErrorUpdateDirectories,
    localIsResponseUpdatePolicyDirectoriesMutation,


    //Удаление папки
    openModalDeleteDirectory,
    setOpenModalDeleteDirectory,

    saveDeleteFolder,

    isLoadingDeletePolicyDirectoriesMutation,
    isSuccessDeletePolicyDirectoriesMutation,
    isErrorDeletePolicyDirectoriesMutation,
    ErrorDeleteDirectories,
    localIsResponseDeletePolicyDirectoriesMutation,

    handleInputChangeModalSearch,
    handleCheckboxChange,
    handleCheckboxChangeUpdate,
  };
}
