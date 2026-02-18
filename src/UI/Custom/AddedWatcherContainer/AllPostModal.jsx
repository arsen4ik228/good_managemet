import React, { useState, useMemo } from 'react'
import classes from './AllPostModal.module.css'
import ModalContainer from '../ModalContainer/ModalContainer'
import { useAllPosts } from '@hooks'
import { selectedOrganizationId } from '@helpers/constants'
import { Tooltip } from 'antd'
import primary_search from '@image/primary _ search.svg'
import avatar from '@image/default_avatar.svg'
import round_check from '@image/round_check.svg'
import round_check_true from '@image/round_check_true.svg'
import {baseUrl} from '@helpers/constants'

export default function AllPostModal({ setOpenModal, watchers, buttonClick, selectedPost, setSelectedPost }) {

    const { allPosts } = useAllPosts({ organization: selectedOrganizationId })
    const [searchQuery, setSearchQuery] = useState('')

    const handlePostClick = (postId) => {
        setSelectedPost(prevState => {
            if (prevState.includes(postId)) {
                return prevState.filter(id => id !== postId);
            } else {
                return [...prevState, postId];
            }
        });
    };

    // Фильтрация постов на основе поискового запроса
    const filteredPosts = useMemo(() => {
        if (!allPosts) return [];
        if (!searchQuery.trim()) return allPosts;

        const query = searchQuery.toLowerCase().trim();
        
        return allPosts.filter(item => {
            const postName = item?.postName?.toLowerCase() || '';
            const lastName = item?.lastName?.toLowerCase() || '';
            const firstName = item?.firstName?.toLowerCase() || '';
            const fullName = `${lastName} ${firstName}`.toLowerCase();
            
            return postName.includes(query) || 
                   lastName.includes(query) || 
                   firstName.includes(query) ||
                   fullName.includes(query);
        });
    }, [allPosts, searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };


    return (
        <ModalContainer
            buttonText={'Сохранить'}
            setOpenModal={setOpenModal}
            // clickFunction={buttonClick}
        >
            <div className={classes.contentContainer}>
                <div className={classes.searchContainer}>
                    <div>
                        <img src={primary_search} alt="primary_search" />
                    </div>
                    <div className={classes.searchWrapper}>
                        <input
                            type="text"
                            placeholder="Найти контакт"
                            className={classes.searchInput}
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    {searchQuery && (
                        <button 
                            className={classes.clearButton}
                            onClick={() => setSearchQuery('')}
                        >
                            ✕
                        </button>
                    )}
                </div>
                
                {filteredPosts?.length === 0 ? (
                    <div className={classes.noResults}>
                        Ничего не найдено
                    </div>
                ) : (
                    filteredPosts?.map((item, index) => (
                        <div 
                            key={item.id || index} 
                            className={classes.postContainer} 
                            onClick={() => handlePostClick(item.id)}
                        >
                            <div
                                className={`${classes.content} 
                                ${selectedPost.includes(item.id) ? classes.selected : ''}
                                `}
                            >
                                <div className={classes.imgContainer}>
                                    <img src={ item?.user?.avatar_url ? baseUrl + item?.user?.avatar_url : avatar} alt="avatar" />
                                    {/* userInfo?.avatar_url ? `${baseUrl}${userInfo?.avatar_url}` : default_avatar */}
                                </div>
                                <Tooltip
                                    title={`${item?.postName || ''} - ${item?.lastName || ''} ${item?.firstName || ''}`}
                                    mouseEnterDelay={0.3}
                                    placement="right"
                                    autoAdjustOverflow={true}
                                    destroyTooltipOnHide={true}
                                    overlayStyle={{ maxWidth: 400 }}
                                >
                                    <div className={classes.text}>
                                        <div className={classes.upperTxt}>
                                            {item?.postName}
                                        </div>
                                        <div className={classes.bottomTxt}>
                                            {item?.lastName} {item?.firstName}
                                        </div>
                                    </div>
                                </Tooltip>
                                <div className={classes.roundSection}>
                                    <img 
                                        src={selectedPost.includes(item.id) ? round_check_true : round_check} 
                                        alt="round_check" 
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </ModalContainer>
    )
}