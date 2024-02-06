import { makeStyles } from '@material-ui/core';
import React from 'react'
import { colors } from '../../assets/styles/colors';
import { linkify } from '../../utils';

const useStyles = makeStyles(()=>({
    link: {
        color: colors.yellow
    },
    text: {
        fontSize: '1.1rem',
        background: colors.white,
        padding: '4px 16px',
        minWidth: '40px',
        borderRadius: '0 6px 6px 6px',
        marginTop: 0,
        marginBottom: 0
    }
}))
const MessageItem = ({message}) => {

    const classes = useStyles();
    
    return (
            <p 
                className={classes.text}
                dangerouslySetInnerHTML={{__html: linkify(message?.content, {className: classes.link})}}>
            </p>
    );

}

export default MessageItem;
