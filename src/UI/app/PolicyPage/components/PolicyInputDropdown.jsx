import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Dropdown,
  Menu,
  Tooltip,
  Button,
  Form,
  Space,
  Empty,
} from "antd";
import {
  FolderOutlined,
  FileOutlined,
  ExclamationOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  RightOutlined,
} from "@ant-design/icons";

const PolicyInputWithDropdown = ({
  policyName,
  setPolicyName,
  disabledArchive,
  directivesActive,
  directivesDraft,
  directivesCompleted,
  instructionsActive,
  instructionsDraft,
  instructionsCompleted,
  disposalsActive,
  disposalsDraft,
  disposalsCompleted,
  foldersSort,
  getPolicyId,
  setDisabledArchive,
  updateDirectory,
  openCreateDirectory,
}) => {
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const inputRef = useRef(null);

  // Собираем все элементы в плоский массив для поиска
  const getAllItems = () => {
    const items = [];

    const processItems = (itemArray, type) => {
      if (!itemArray || itemArray.length === 0) return;
      itemArray.forEach((item) => {
        items.push({
          ...item,
          searchType: type,
          originalItem: item,
        });
      });
    };

    // Добавляем директивы
    processItems(directivesActive, "active-dir");
    processItems(directivesDraft, "draft-dir");
    processItems(directivesCompleted, "completed-dir");

    // Добавляем инструкции
    processItems(instructionsActive, "active-inst");
    processItems(instructionsDraft, "draft-inst");
    processItems(instructionsCompleted, "completed-inst");

    // Добавляем распоряжения
    processItems(disposalsActive, "active-dis");
    processItems(disposalsDraft, "draft-dis");
    processItems(disposalsCompleted, "completed-dis");

    // Добавляем элементы из папок
    foldersSort?.forEach((folder) => {
      folder.policyToPolicyDirectories?.forEach((policyDir) => {
        items.push({
          ...policyDir.policy,
          searchType: `folder-${folder.id}`,
          originalItem: policyDir,
        });
      });
    });

    return items;
  };

  // Поиск элементов
  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredItems([]);
      return;
    }

    const allItems = getAllItems();
    const filtered = allItems.filter((item) =>
      item.policyName.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredItems(filtered);
  }, [
    searchValue,
    directivesActive,
    directivesDraft,
    directivesCompleted,
    instructionsActive,
    instructionsDraft,
    instructionsCompleted,
    disposalsActive,
    disposalsDraft,
    disposalsCompleted,
    foldersSort,
  ]);

  // Обработка выбора элемента
  const handleItemSelect = (item) => {
    if (
      item.searchType.includes("completed") ||
      (item.status && item.status === "Завершено")
    ) {
      setDisabledArchive(true);
    } else {
      setDisabledArchive(false);
    }

    getPolicyId(item.id);
    setIsOpenSearch(false);
    setPolicyName(item.policyName);
    setSearchValue("");
  };

  // Обработка нажатия Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredItems.length > 0) {
      // Берем первый элемент из отфильтрованного списка
      handleItemSelect(filteredItems[0]);
    }
  };

  const renderItemsOrEmpty = (items, type) => {
    if (!items || items.length === 0) {
      return [
        {
          key: `empty-${type}`,
          label: "Нет данных",
          icon: <ExclamationOutlined />,
          disabled: true,
        },
      ];
    }
    return items.map((item) => ({
      key: `${type}-${item.id}`,
      label: item.policyName,
      icon: <FileOutlined />,
      onClick: () => {
        getPolicyId(item.id);
        if (type.includes("completed")) {
          setDisabledArchive(true);
        }
        setIsOpenSearch(false);
        setPolicyName(item.policyName);
      },
    }));
  };

  const renderDirectory = (items, type) => {
    if (!items || items.length === 0) {
      return [
        {
          key: `empty-${type}`,
          label: "Нет данных",
          icon: <ExclamationOutlined />,
          disabled: true,
        },
      ];
    }
    return items.map((item) => ({
      key: `${type}-${item.policy.id}`,
      label: item.policy.policyName,
      icon: <FileOutlined />,
      onClick: () => {
        getPolicyId(item.policy.id);
        setIsOpenSearch(false);
        setPolicyName(item.policy.policyName);
      },
    }));
  };

  const menuItems = [
    {
      key: "directives",
      label: "Директивы",
      icon: <FolderOutlined />,
      children: [
        {
          key: "active-directives",
          label: "Активные",
          icon: <FolderOutlined />,
          children: renderItemsOrEmpty(directivesActive, "active-dir"),
        },
        {
          key: "draft-directives",
          label: "Черновики",
          icon: <FolderOutlined />,
          children: renderItemsOrEmpty(directivesDraft, "draft-dir"),
        },
        {
          key: "completed-directives",
          label: "Завершенные",
          icon: <FolderOutlined />,
          children: renderItemsOrEmpty(directivesCompleted, "completed-dir"),
        },
      ],
    },
    {
      key: "instructions",
      label: "Инструкции",
      icon: <FolderOutlined />,
      children: [
        {
          key: "active-instructions",
          label: "Активные",
          icon: <FolderOutlined />,
          children: renderItemsOrEmpty(instructionsActive, "active-inst"),
        },
        {
          key: "draft-instructions",
          label: "Черновики",
          icon: <FolderOutlined />,
          children: renderItemsOrEmpty(instructionsDraft, "draft-inst"),
        },
        {
          key: "completed-instructions",
          label: "Завершенные",
          icon: <FolderOutlined />,
          children: renderItemsOrEmpty(instructionsCompleted, "completed-inst"),
        },
      ],
    },
    {
      key: "disposals",
      label: "Распоряжения",
      icon: <FolderOutlined />,
      children: [
        {
          key: "active-disposals",
          label: "Активные",
          icon: <FolderOutlined />,
          children: renderItemsOrEmpty(disposalsActive, "active-dis"),
        },
        {
          key: "draft-disposals",
          label: "Черновики",
          icon: <FolderOutlined />,
          children: renderItemsOrEmpty(disposalsDraft, "draft-dis"),
        },
        {
          key: "completed-disposals",
          label: "Завершенные",
          icon: <FolderOutlined />,
          children: renderItemsOrEmpty(disposalsCompleted, "completed-dis"),
        },
      ],
    },
    ...(foldersSort?.length > 0
      ? foldersSort.map((item) => ({
          key: `folder-${item.id}`,
          label: (
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>{item.directoryName}</span>
              <Tooltip title="Редактировать папку" placement="bottom">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpenSearch(false);
                    updateDirectory(item);
                  }}
                  style={{ marginLeft: 8 }}
                />
              </Tooltip>
            </div>
          ),
          icon: <FolderOutlined />,
          children: [
            {
              key: `folder-directives-${item.id}`,
              label: "Директива",
              icon: <FolderOutlined />,
              children: renderDirectory(
                item.policyToPolicyDirectories.filter(
                  (el) => el.policy.type === "Директива"
                ),
                "directives"
              ),
            },
            {
              key: `folder-instructions-${item.id}`,
              label: "Инструкция",
              icon: <FolderOutlined />,
              children: renderDirectory(
                item.policyToPolicyDirectories.filter(
                  (el) => el.policy.type === "Инструкция"
                ),
                "instructions"
              ),
            },
            {
              key: `folder-disposals-${item.id}`,
              label: "Распоряжение",
              icon: <FolderOutlined />,
              children: renderDirectory(
                item.policyToPolicyDirectories.filter(
                  (el) => el.policy.type === "Распоряжение"
                ),
                "disposals"
              ),
            },
          ],
        }))
      : []),
    {
      key: "create-folder",
      label: "Создать папку",
      icon: <PlusCircleOutlined />,
      onClick: openCreateDirectory,
    },
  ];

  const searchResultsMenu = (
    <Menu
      style={{
        width: 250,
        maxHeight: 300,
        overflowY: "auto",
        position: "absolute",
        left: 0, // Располагаем слева
        top: "100%", // Располагаем ниже
        marginTop: 8, // Небольшой отступ от элемента триггера
      }}
    >
      {filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <Menu.Item
            key={`search-${item.id}`}
            icon={<FileOutlined />}
            onClick={() => handleItemSelect(item)}
          >
            {item.policyName}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Ничего не найдено"
          />
        </Menu.Item>
      )}
    </Menu>
  );

  const mainMenu = (
    <Menu
      mode="inline"
      style={{
        width: 250,
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
        position: "absolute",
        left: 0, // Располагаем слева
        top: "100%", // Располагаем ниже
        marginTop: 8, // Небольшой отступ от элемента триггера
      }}
      items={menuItems}
      expandIcon={({ isOpen }) => (
        <RightOutlined
          style={{
            transform: isOpen ? "rotate(90deg)" : "none",
            transition: "transform 0.2s",
            verticalAlign: "middle",
          }}
        />
      )}
      multiple={false}
    />
  );

  return (
    <Dropdown
      overlay={searchValue.trim() ? searchResultsMenu : mainMenu}
      trigger={["click"]}
      open={isOpenSearch}
      onOpenChange={(open) => {
        setIsOpenSearch(open);
        if (!open) setSearchValue("");
      }}
      placement="bottomRight"
    >
      <Input
        ref={inputRef}
        value={policyName}
        onChange={(e) => {
          setPolicyName(e.target.value);
          setSearchValue(e.target.value);
          if (e.target.value && !isOpenSearch) {
            setIsOpenSearch(true);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder="Название политики"
        disabled={disabledArchive}
        style={{ width: 250 }}
        suffix={
          <Button
            type="text"
            icon={<SearchOutlined />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpenSearch(true);
              inputRef.current?.focus();
            }}
          />
        }
      />
    </Dropdown>
  );
};

export default PolicyInputWithDropdown;
