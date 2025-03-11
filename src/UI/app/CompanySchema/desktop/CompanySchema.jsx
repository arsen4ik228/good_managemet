import React, { useState, useEffect } from "react";
import classes from "./CompanySchema.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import _ from "lodash";
import { FloatButton } from "antd";

import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders.jsx";
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import HandlerMutation from "@Custom/HandlerMutation.jsx";

import PostSchema from "./postSchema/PostSchema";
import BlockSchema from "./blockSchema/BlockSchema";

import arrowBack from "@image/back_white.svg";
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
    postName: "",
    divisionName: "",
    fullName: "",
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

  console.log("onePost");
  console.log(onePost);
  return (
    <div className={classes.dialog}>
      <Headers name={"схема постов"}>
        <BottomHeaders update={saveUpdateOrganization} create={createPost} />
      </Headers>

      <DrawerCreatePost
        open={openCreatePost}
        setOpen={setOpenCreatePost}
        organizationId={organizationId}
      ></DrawerCreatePost>

      {isErrorGetPosts ? (
        <>
          <HandlerQeury Error={isErrorGetPosts}></HandlerQeury>
        </>
      ) : (
        <div className={classes.main}>
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
                  <div className={classes.header}>
                    <h1 className={classes.boldText}>{header.postName}</h1>
                    <h2 className={classes.boldText}>{header.divisionName}</h2>
                    <h3>{header.fullName}</h3>
                  </div>

                  <div className={classes.wrapper}>
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
                          onClick={() => setViewChildrenPost(false)}
                          style={{
                            insetInlineEnd: 94,
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
                            insetInlineEnd: 94,
                          }}
                        />
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
