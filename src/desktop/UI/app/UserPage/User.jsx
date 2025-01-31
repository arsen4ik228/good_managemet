import React, { useState, useRef } from "react";
import classes from "./User.module.css";

import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import Input from "@Custom/Input/Input";

import InputMask from "react-input-mask";
import { useUserHook } from "../../hooks/useUserHook";
import HandlerMutation from "@Custom/HandlerMutation";
import { usePostImageMutation } from "../../../BLL/fileApi";
import addCircle from "@image/addCircleGrey.svg";

export default function User() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [avatarLocal, setAvatarLocal] = useState("");
  const [file, setFile] = useState();

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
    reduxSelectedOrganizationId,
    postUser,

    isLoadingUserMutation,
    isSuccessUserMutation,
    isErrorUserMutation,
    ErrorUserMutation,

    localIsResponseUserMutation,
  } = useUserHook();

  const [postImage] = usePostImageMutation();

  const handlePostUserButtonClick = async () => {
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
      await postImage(formData)
        .unwrap()
        .then((result) => {
          userData.avatar_url = result.filePath;
        })
        .catch((error) => {
          console.error("Ошибка:", JSON.stringify(error, null, 2));
        });
    }

    await postUser(userData)
      .unwrap()
      .then()
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2));
      });
  };

  // Для картинки
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  //Загрузка картинки локально
  const imageUploadHandlerLocal = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatarLocal(imageUrl);
      console.log(imageUrl);
    }
  };

  return (
    <div className={classes.dialog}>
      <Headers name={"создание пользователя"}>
        <BottomHeaders></BottomHeaders>
      </Headers>
      <div className={classes.main}>
        <div className={classes.block}>
          <div className={classes.avatarContainer}>
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
          </div>

          <div className={classes.column2}>
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

            <button
              onClick={handlePostUserButtonClick}
              className={classes.btnSave}
            >
              Сохранить
            </button>
          </div>
        </div>

        <HandlerMutation
          Loading={isLoadingUserMutation}
          Error={isErrorUserMutation && localIsResponseUserMutation}
          Success={isSuccessUserMutation && localIsResponseUserMutation}
          textSuccess={"Стратегия обновлена"}
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
