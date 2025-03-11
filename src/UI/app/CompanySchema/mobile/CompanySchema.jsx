import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import classes from "./CompanySchema.module.css";

import iconAdd from "@image/iconAdd.svg";
import arrowBack from "@image/back_white.svg";

import _ from "lodash";
import { FloatButton } from "antd";

import Blacksavetmp from "@image/Blacksavetmp.svg";
import Header from "@Custom/CustomHeader/Header";
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import HandlerMutation from "@Custom/HandlerMutation.jsx";

import PostSchema from "./postSchema/PostSchema.jsx";
import BlockSchema from "./blockSchema/BlockSchema";
import DrawerCreatePost from "../drawer/drawerForPost/DrawerCreatePost";

import { useGetSingleOrganization, useUpdateSingleOrganization } from "@hooks";
import { useAllPosts } from "@hooks";

import { buildTree } from "../constants/contsants.js";

const PostTree = ({
  posts,
  arrayColors,
  setArrayColors,
  setOnePost,
  setViewChildrenPost,
  setHeader,
}) => {
  const tree = buildTree(posts);
  console.log(tree);
  return (
    <div className={classes.wrapper}>
      {tree.map((post) => (
        <BlockSchema
          key={post.id}
          post={post}
          arrayColors={arrayColors}
          setArrayColors={setArrayColors}
          setOnePost={setOnePost}
          setViewChildrenPost={setViewChildrenPost}
          setHeader={setHeader}
        />
      ))}
    </div>
  );
};

export default function CompanySchema() {
  const { organizationId } = useParams();
  const navigate = useNavigate();

  const backCompanySchema = () => {
    navigate(`/pomoshnik/companySchema`);
  };

  const {
    allPosts = [],
    isLoadingGetPosts,
    isFetchingGetPosts,
    isErrorGetPosts,
  } = useAllPosts({ organizationId, structure: true });

  const {
    currentOrganization,
    isLoadingOrganizationId,
    isFetchingOrganizationId,
  } = useGetSingleOrganization({ organizationId: organizationId });

  const {
    updateOrganization,
    isLoadingUpdateOrganizationMutation,
    isSuccessUpdateOrganizationMutation,
    isErrorUpdateOrganizationMutation,
    ErrorOrganization,
    localIsResponseUpdateOrganizationMutation,
  } = useUpdateSingleOrganization();

  const [arrayAllPosts, setArrayAllPosts] = useState([]);
  const [onePost, setOnePost] = useState([]);
  const [arrayColors, setArrayColors] = useState(new Map());
  const [isViewChildrenPost, setViewChildrenPost] = useState(false);
  const [header, setHeader] = useState({
    postName: "фывфы",
    divisionName: "ыфваф",
    fullName: "фывфыв",
  });

  const saveUpdateOrganization = async () => {
    const colorCodes = {};
    for (const [key, value] of arrayColors) {
      colorCodes[key] = value;
    }

    await updateOrganization({
      _id: organizationId,
      colorCodes,
    });
  };

  useEffect(() => {
    if (!_.isEqual(arrayAllPosts, allPosts)) {
      setArrayAllPosts(_.cloneDeep(allPosts));
    }
  }, [allPosts]);

  useEffect(() => {
    if (
      currentOrganization?.colorCodes &&
      typeof currentOrganization.colorCodes === "object"
    ) {
      setArrayColors(new Map(Object.entries(currentOrganization.colorCodes)));
    }
  }, [currentOrganization]);

  const [openCreatePost, setOpenCreatePost] = useState(false);
  const createPost = () => {
    setOpenCreatePost(true);
  };

  const hasValidHeader = () => {
    return Object.values(header).some(
      (value) => value !== null && value !== ""
    );
  };

  console.log("onePost");
  console.log(onePost);

  return (
    <div className={classes.wrapper}>
      <Header
        onRightIcon={true}
        rightIcon={Blacksavetmp}
        rightIconClick={saveUpdateOrganization}
        onRight2Icon={true}
        right2Icon={iconAdd}
        right2IconClick={createPost}
      >
        Схема компании
      </Header>

      <DrawerCreatePost
        open={openCreatePost}
        setOpen={setOpenCreatePost}
        organizationId={organizationId}
      ></DrawerCreatePost>

      <div className={classes.body}>
        {isErrorGetPosts ? (
          <>
            <HandlerQeury Error={isErrorGetPosts}></HandlerQeury>
          </>
        ) : (
          <>
            {isFetchingGetPosts || isLoadingGetPosts ? (
              <HandlerQeury
                Loading={isLoadingGetPosts}
                Fetching={isFetchingGetPosts}
              ></HandlerQeury>
            ) : (
              <>
                {allPosts.length === 0 ? (
                  <div className={classes.header}>
                    <h1 className={classes.boldText}>Посты отсутсвуют</h1>
                    <FloatButton
                      icon={
                        <img
                          src={arrowBack}
                          alt="back"
                          style={{ width: 20, height: 20 }}
                        />
                      }
                      type="primary"
                      tooltip="Вернуться назад"
                      onClick={backCompanySchema}
                      style={{
                        insetInlineEnd: 94,
                      }}
                    />
                  </div>
                ) : (
                  <>

                    {hasValidHeader() && (
                      <div className={classes.header}>
                        {header.postName && (
                          <h1 className={classes.boldText}>
                            {header.postName}
                          </h1>
                        )}
                        {header.divisionName && (
                          <h2 className={classes.boldText}>
                            {header.divisionName}
                          </h2>
                        )}
                        {header.fullName && <h3>{header.fullName}</h3>}
                      </div>
                    )}

                    <>
                      {isViewChildrenPost ? (
                        <>
                          {onePost[0]?.children?.map((item) => {
                            return (
                              <>
                                <PostSchema
                                  key={item.id}
                                  post={item}
                                  backgroundColor={onePost[0].color}
                                  setOnePost={setOnePost}
                                  setViewChildrenPost={setViewChildrenPost}
                                  setHeader={setHeader}
                                />
                              </>
                            );
                          })}

                          <FloatButton
                            icon={
                              <img
                                src={arrowBack}
                                alt="back"
                                style={{ width: 20, height: 20 }}
                              />
                            }
                            type="primary"
                            tooltip="Вернуться назад"
                            onClick={() => {
                              setViewChildrenPost(false);
                              setHeader({
                                postName: "",
                                divisionName: "",
                                fullName: "",
                              });
                            }}
                            style={{
                              insetInlineEnd: 54,
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <PostTree
                            posts={arrayAllPosts}
                            arrayColors={arrayColors}
                            setArrayColors={setArrayColors}
                            setOnePost={setOnePost}
                            setViewChildrenPost={setViewChildrenPost}
                            setHeader={setHeader}
                          />

                          <FloatButton
                            icon={
                              <img
                                src={arrowBack}
                                alt="back"
                                style={{ width: 20, height: 20 }}
                              />
                            }
                            type="primary"
                            tooltip="Вернуться назад"
                            onClick={backCompanySchema}
                            style={{
                              insetInlineEnd: 54,
                            }}
                          />
                        </>
                      )}
                    </>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
