import React, { useState, useEffect, useRef } from "react";
import classes from "./User.module.css";

import Header from "@Custom/CustomHeader/Header";
import Input from "@Custom/Input/Input";

import InputMask from "react-input-mask";
import { useUserHook } from "@hooks";
import HandlerMutation from "@Custom/HandlerMutation";
import { usePostImageMutation } from "@services";
import addCircle from "@image/addCircleGrey.svg";
import post from "@image/post.svg";
import ButtonAttach from "@Custom/buttonAttach/ButtonAttach";
import { useModalSelectCheckBox } from "@hooks";
import { ModalSelectCheckBox } from "@Custom/modalSelectCheckBox/ModalSelectCheckBox";
import { usePostsHook } from "@hooks";
import exitHeader from "@image/exitHeader.svg";
import iconAdd from "@image/iconAdd.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCreatedUserId } from "@slices";
import { ButtonContainer } from "@Custom/CustomButtomContainer/ButtonContainer";
import ModalContainer from "@Custom/ModalContainer/ModalContainer";
import TableCheckBox from "@Custom/tableCheckBox/TableCheckBox";
import add from "@Custom/icon/icon _ add _ blue.svg";

export default function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);

  const [avatarLocal, setAvatarLocal] = useState("");
  const [file, setFile] = useState("");

  const [openModalSelectPosts, setOpenModalSelectPosts] = useState("");
  const [arrayCheckedPostsIds, setArrayCheckedPostsIds] = useState([]);
  const [arrayCheckedPostsNames, setArrayCheckedPostsNames] = useState([]);

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
        throw error;
      }
    }

    try {
      const result = await postUser(userData).unwrap();
      saveUpdatePost(result.id);
      dispatch(setCreatedUserId(result.id));
    } catch (error) {
      console.error(
        "Ошибка создания пользователя:",
        JSON.stringify(error, null, 2)
      );
      throw error;
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

  // Для прикрепления поста
  const {
    filterArraySearchModalCheckBox,
    handleCheckboxChange,
    inputSearchModalCheckBox,
    setInputSearchModalCheckBox,
  } = useModalSelectCheckBox({
    array: postsWithoutUser,
    arrayItem: "postName",
    setArrayChecked: setArrayCheckedPostsIds,
  });

  const exitsModalSelectPosts = () => {
    setOpenModalSelectPosts(false);
    const filtered = arrayCheckedPostsIds
      .map(
        (selectPost) =>
          postsWithoutUser.find((post) => selectPost === post.id)?.postName
      )
      .filter(Boolean); // Убираем undefined
    setArrayCheckedPostsNames(filtered);
  };

  const {
    updatePost,
    isLoadingUpdatePostMutation,
    isSuccessUpdatePostMutation,
    isErrorUpdatePostMutation,
    ErrorUpdatePostMutation,
  } = usePostsHook();

  const saveUpdatePost = async (createdUserId) => {
    if (arrayCheckedPostsIds.length > 0 && createdUserId) {
      try {
        await Promise.all(
          arrayCheckedPostsIds.map(async (id) => {
            await updatePost({
              _id: id,
              responsibleUserId: createdUserId,
            })
              .unwrap()
              .then(() => {
                reset();
              })
              .catch((error) => {
                console.error(
                  `Ошибка при обновлении поста ${id}:`,
                  JSON.stringify(error, null, 2)
                );
              });
          })
        );
      } catch (err) {
        console.error("Ошибка выполнения запросов:", err);
      }
    }
  };

  const reset = () => {
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setTelephoneNumber("");
    setAvatarLocal("");
    setFile("");
    setArrayCheckedPostsIds([]);
    setArrayCheckedPostsNames([]);
  };

  useEffect(() => {
    if (firstName && lastName && middleName && telephoneNumber.length == 12) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [firstName, lastName, middleName, telephoneNumber]);

  const createUserAndCreatePost = async () => {
    try {
      await handleCreateUserButtonClick();
      navigate("/pomoshnik/Posts/new");
    } catch (error) {
      console.error("Ошибка в процессе создания пользователя:", error);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Header>Создание Пользователя</Header>

      <div className={classes.body}>
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
          <img
            src={exitHeader}
            title={"удалить картинку"}
            onClick={deleteImage}
            style={{ width: "12px", height: "12px" }}
          ></img>
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
              {(inputProps) => <input {...inputProps} type="tel" id="phone" />}
            </InputMask>
          </Input>

          <ButtonAttach
            image={post}
            onClick={() => setOpenModalSelectPosts(true)}
            selectArray={arrayCheckedPostsNames}
            prefix={"Посты: "}
            btnName={"Пикрепить посты"}
            disabled={!isValid}
            widthBtn={"190px"}
          ></ButtonAttach>
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

      <ButtonContainer
        clickFunction={handleCreateUserButtonClick}
        disabled={!isValid}
      >
        Сохранить
      </ButtonContainer>

      {openModalSelectPosts && (
        <ModalContainer
          clickFunction={createUserAndCreatePost}
          setOpenModal={exitsModalSelectPosts}
        >
          <TableCheckBox
            nameTable={"Посты"}
            array={postsWithoutUser}
            arrayItem={"postName"}
            arrayCheked={arrayCheckedPostsIds}
            handleChecboxChange={handleCheckboxChange}
          ></TableCheckBox>

          <button
            className={classes.createBtnPost}
            onClick={createUserAndCreatePost}
          >
           <span> Создать пост </span>
            <img src={add} alt="add" />
          </button>
        </ModalContainer>
      )}
    </div>
  );
}
