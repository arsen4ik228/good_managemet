import React, { useState, useEffect, useRef } from "react";
import classes from "./User.module.css";
import Input from "@Custom/Input/Input";
import InputMask from "react-input-mask";
import { useUserHook } from "@hooks";
import HandlerMutation from "@Custom/HandlerMutation";
import { usePostImageMutation } from "@services";
import addCircle from "@image/addCircleGrey.svg";
import exitHeader from "@image/exitHeader.svg";
import MainContentContainer from "@Custom/MainContentContainer/MainContentContainer";



export default function User() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);

  const [avatarLocal, setAvatarLocal] = useState("");
  const [file, setFile] = useState("");

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
  } = useUserHook();

  const [postImage] = usePostImageMutation();

  // Для картинки

  const handleCreateUserButtonClick = async () => {
    const userData = {
      firstName,
      lastName,
      middleName,
      telephoneNumber,
      organizationId: reduxSelectedOrganizationId,
    };

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const result = await postImage(formData).unwrap();
        userData.avatar_url = result.filePath;
      } catch (error) {
        console.error(
          "Ошибка загрузки изображения:",
          JSON.stringify(error, null, 2)
        );
      }
    }

    try {
      const result = await postUser(userData).unwrap();
      reset();
    } catch (error) {
      reset();
      console.error(
        "Ошибка создания пользователя:",
        JSON.stringify(error, null, 2)
      );
    }
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


  const reset = () => {
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setTelephoneNumber("");
    setAvatarLocal("");
    setFile("");
  };

  useEffect(() => {
    if (firstName && lastName && middleName && telephoneNumber.length >= 12) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [firstName, lastName, middleName, telephoneNumber]);


  return (

    <MainContentContainer>
      <div className={classes.dialog}>

        <div className={classes.main}>
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
                title={"удалить картинку"}
                onClick={deleteImage}
                style={{ width: "12px", height: "12px" }}
              ></img>
            </div>

            <div className={classes.column2}>
              <div data-tour="data-form" className={classes.column2}>
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
                    mask="+9 (999) 999-99-99-9999999"  // добавим “запасные” цифры
                    maskChar={null}                    // не показывает подчёркивания
                    value={telephoneNumber}
                    onChange={handleChangeTelephoneNumber}
                    placeholder="+_ (___) ___-__-__"
                    required
                  >
                    {(inputProps) => (
                      <input {...inputProps} type="tel" id="phone" />
                    )}
                  </InputMask>
                </Input>
              </div>

              <button
                data-tour="data-save"
                onClick={handleCreateUserButtonClick}
                className={classes.btnSave}
                disabled={!isValid}
              >
                Сохранить
              </button>
            </div>
          </div>

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

    </MainContentContainer>
  );
}
