import React, { useEffect, useState } from 'react'
import InputTextContainer from '@Custom/ContainerForInputText/InputTextContainer';
import Headers from "@Custom/Headers/Headers";
import classes from './desktopConvertPage.module.css'
import { useParams } from 'react-router-dom';
import { notEmpty } from '@helpers/helpers'
import Task from '../TaskContainer/Task'
import { useConvertsHook } from '@hooks/useConvertsHook';
import Input from '../Input';



export default function DesktopConvertPage() {
    const { contactId } = useParams()


  const { contactInfo, allConverts } = useConvertsHook({ contactId: contactId })


    return (
        <div className={classes.dialog}>
            <Headers name={contactInfo?.userName} sectionName={contactInfo?.postName} avatar={contactInfo?.avatar}>
            </Headers>

            <div className={classes.main}>
                <div className={classes.body}>
                    {allConverts?.map((item, index) => (
                        <React.Fragment key={index}>
                            <Task taskData={item}></Task>
                        </React.Fragment>
                    ))}

                </div>
            </div>
            <Input></Input>

        </div>
    )
}
