import React, { useState, useEffect, useRef } from "react";
import classes from "./SettingsPage.module.css";

import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";

import { Button, List } from "antd";

import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import Input from "@Custom/Input/Input";
import HandlerMutation from "@Custom/HandlerMutation";

import { notEmpty } from "@helpers/helpers";
import { baseUrl } from "@helpers/constants";

import addCircle from "@image/addCircleGrey.svg";
import exitHeader from "@image/exitHeader.svg";

import { useUserHook } from "@hooks";
import { usePostImageMutation } from "@services";

import { ConfigProvider, Tour } from "antd";
import ruRU from "antd/locale/ru_RU";

export default function SettingsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);

  const [avatarLocal, setAvatarLocal] = useState("");
  const [file, setFile] = useState("");

  const refUpdate = useRef(null);
  const [openHint, setOpenHint] = useState(false);

  const steps = [
    {
      title: "Сохранить",
      description: "Нажмите для сохранения",
      target: () => refUpdate.current,
    },
    {
      title: "Аватар",
      description: "Нажмите на аватар и поменяйте фотографию, при нажатии на крестик аватар удалиться",
      target: () => document.querySelector('[data-tour="data-avatar"]'),
    },
    {
      title: "Личная информация",
      description: "Нажмите и поменяйте данные",
      target: () => document.querySelector('[data-tour="data-form"]'),
    },
    {
      title: "Личная информация",
      description: "Нажмите и поменяйте данные",
      target: () => document.querySelector('[data-tour="data-form"]'),
    },
    {
      title: "Закрепленные посты",
      description: "Распологаются все посты закрепленные за пользователем",
      target: () => document.querySelector('[data-tour="data-post"]'),
    },
        {
      title: "Пост",
      description: "Нажмите на название поста и перейдите к этому посту",
      target: () => document.querySelector('[data-tour="data-postItem"]'),
    },
  ];

  const handleChangeFirstName = (e) => {
    const inputValue = e;
    const lettersOnly = inputValue.replace(/[^A-Za-zА-Яа-я\s]/g, "");

    const formattedValue =
      lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1);

    setFirstName(formattedValue);
  };

  const handleChangeLastName = (e) => {
    const inputValue = e;
    const lettersOnly = inputValue.replace(/[^A-Za-zА-Яа-я\s]/g, "");

    const formattedValue =
      lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1);

    setLastName(formattedValue);
  };

  const handleChangeMiddleName = (e) => {
    const inputValue = e;
    const lettersOnly = inputValue.replace(/[^A-Za-zА-Яа-я\s]/g, "");

    const formattedValue =
      lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1);
    console.log(formattedValue);
    setMiddleName(formattedValue);
  };

  const handleChangeTelephoneNumber = (e) => {
    const cleanedPhone = e.target.value.replace(/\D/g, "");
    setTelephoneNumber(`+${cleanedPhone}`);
  };

  // Создание аккаунта
  const {
    // Создать user
    reduxSelectedOrganizationId,
    postUser,

    isLoadingUserMutation,
    isSuccessUserMutation,
    isErrorUserMutation,
    ErrorUserMutation,

    localIsResponseUserMutation,

    // Получит информацию для создания user
    postsWithoutUser,
    isLoadingGetUserNew,
    isErrorGetUserNew,

    userInfo,

    updateUser,
  } = useUserHook();

  // Для картинки
  const [postImage] = usePostImageMutation();

  const handleUpdateUserButtonClick = async () => {
    const Data = {};

    if (firstName !== userInfo?.firstName) Data.firstName = firstName;

    if (lastName !== userInfo?.lastName) Data.lastName = lastName;

    if (middleName !== userInfo?.middleName) Data.middleName = middleName;

    if (telephoneNumber !== userInfo?.telephoneNumber)
      Data.telephoneNumber = telephoneNumber;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const result = await postImage(formData).unwrap();
        Data.avatar_url = result.filePath;
      } catch (error) {
        console.error(
          "Ошибка загрузки изображения:",
          JSON.stringify(error, null, 2)
        );
        throw error;
      }
    }else{
       Data.avatar_url = null;
    }

    if (!notEmpty(Data)) return;

    await updateUser({
      ...Data,
    })
      .unwrap()
      .then(() => {})
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2));
      });
  };

  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  //Загрузка картинки локально
  const imageUploadHandlerLocal = (e) => {
    const fileInput = e.target;
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatarLocal(imageUrl);
    }
    // Сбрасываем значение инпута, чтобы можно было выбрать тот же файл
    fileInput.value = "";
  };

  const deleteImage = () => {
    if (avatarLocal) {
      URL.revokeObjectURL(avatarLocal); // Очищаем URL из памяти
    }
    setFile("");
    setAvatarLocal("");
  };

  useEffect(() => {
    if (firstName && lastName && middleName && telephoneNumber.length == 12) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [firstName, lastName, middleName, telephoneNumber]);

  const navigate = useNavigate();

  console.log(userInfo);

  useEffect(() => {
    if (!notEmpty(userInfo)) return;

    setFirstName(userInfo?.firstName);
    setLastName(userInfo?.lastName);
    setMiddleName(userInfo?.middleName);
    setTelephoneNumber(userInfo?.telephoneNumber);
    setAvatarLocal(userInfo.avatar_url ? baseUrl + userInfo?.avatar_url : "");
  }, [userInfo]);

  const buttonClickToPost = (id) => {
    navigate(`/pomoshnik/post/${id}`);
  };

  return (
    <div className={classes.dialog}>
      <Headers
        name={"редактирование пользователя"}
        funcActiveHint={() => setOpenHint(true)}
      >
        <BottomHeaders
          update={handleUpdateUserButtonClick}
          refUpdate={refUpdate}
        ></BottomHeaders>
      </Headers>

      <ConfigProvider locale={ruRU}>
        <Tour
          open={openHint}
          onClose={() => setOpenHint(false)}
          steps={steps}
        />
      </ConfigProvider>

      <div className={classes.main}>
        <div className={classes.wrapper}>
          <div className={classes.block}>
            <div className={classes.avatarContainer} data-tour="data-avatar">
              <img
                src={avatarLocal || addCircle}
                alt="avatar"
                className={classes.avatar}
                onClick={handleAvatarClick}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className={classes.hiddenInput}
                onChange={imageUploadHandlerLocal}
              />
              <img
                src={exitHeader}
                alt="удалить картинку"
                title={"удалить картинку"}
                onClick={deleteImage}
                style={{ width: "12px", height: "12px" }}
              ></img>
            </div>

            <div className={classes.column2} data-tour="data-form">
              <Input
                name={"Имя"}
                value={firstName}
                onChange={handleChangeFirstName}
              ></Input>

              <Input
                name={"Фамилия"}
                value={lastName}
                onChange={handleChangeLastName}
              ></Input>

              <Input
                name={"Отчество"}
                value={middleName}
                onChange={handleChangeMiddleName}
              ></Input>

              <Input name={"Телефон"} isShowInput={true}>
                <InputMask
                  mask="+9 (999) 999-99-99"
                  value={telephoneNumber}
                  onChange={handleChangeTelephoneNumber}
                  placeholder="+9 (999) 999-99-99"
                  required
                >
                  {(inputProps) => (
                    <input {...inputProps} type="tel" id="phone" />
                  )}
                </InputMask>
              </Input>
            </div>
          </div>

          <List
            data-tour="data-post"
            style={{ alignSelf: "flex-start", width: "100%" }}
            header={<div>Закрепленные посты</div>}
            bordered
            dataSource={userInfo?.posts}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <svg
                      width="20.000000"
                      height="20.000000"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <desc>Created with Pixso.</desc>
                      <defs />
                      <path
                        id="Vector"
                        d="M5 20C4.46 20 3.96 19.78 3.58 19.41C3.21 19.03 3 18.53 3 18L3 8C3 7.46 3.21 6.96 3.58 6.58C3.96 6.21 4.46 6 5 6L9 6L9 4L8 4C7.73 4 7.48 3.89 7.29 3.7C7.1 3.51 7 3.26 7 3L0 3L0 1L7 1C7 0.73 7.1 0.48 7.29 0.29C7.48 0.1 7.73 0 8 0L12 0C12.26 0 12.51 0.1 12.7 0.29C12.89 0.48 13 0.73 13 1L20 1L20 3L13 3C13 3.26 12.89 3.51 12.7 3.7C12.51 3.89 12.26 4 12 4L11 4L11 6L15 6C16.11 6 17 6.9 17 8L17 18C17 18.53 16.78 19.03 16.41 19.41C16.03 19.78 15.53 20 15 20L5 20ZM10 12.28C11.18 12.28 12.13 11.32 12.13 10.14C12.13 8.95 11.18 8 10 8C8.81 8 7.85 8.95 7.85 10.14C7.85 11.32 8.81 12.28 10 12.28ZM5 16.21C5 14.55 8.33 13.71 10 13.71C11.66 13.71 15 14.55 15 16.21L15 17.28C15 17.67 14.67 18 14.28 18L5.71 18C5.32 18 5 17.67 5 17.28L5 16.21Z"
                        fill="#005475"
                        fill-opacity="0.901961"
                        fill-rule="evenodd"
                      />
                    </svg>
                  }
                  title={
                    <Button
                    data-tour="data-postItem"
                      style={{ padding: 0 }}
                      color="default"
                      variant="link"
                      onClick={() => buttonClickToPost(item.id)}
                    >
                      {item.postName}
                    </Button>
                  }
                  description={<div>{item.divisionName}</div>}
                />
              </List.Item>
            )}
          />
        </div>

        {/* <FloatButton
          icon={<SaveOutlined />}
          type="primary"
          tooltip="Сохранить изменения"
          onClick={handleUpdateUserButtonClick}
          style={{
            insetInlineEnd: 94,
          }}
        /> */}

        <HandlerMutation
          Loading={isLoadingUserMutation}
          Error={isErrorUserMutation && localIsResponseUserMutation}
          Success={isSuccessUserMutation && localIsResponseUserMutation}
          textSuccess={`Пользователь ${firstName} ${lastName} ${middleName} создан`}
          textError={
            ErrorUserMutation?.data?.errors?.[0]?.errors?.[0]
              ? ErrorUserMutation.data.errors[0].errors[0]
              : ErrorUserMutation?.data?.message
          }
        ></HandlerMutation>
      </div>
    </div>
  );
}
