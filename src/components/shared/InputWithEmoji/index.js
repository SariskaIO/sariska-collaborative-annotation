import { InputAdornment, TextField, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import EmojiPickerContainer from '../EmojiPickerContainer';

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
  }));

const InputWithEmoji = ({position}) => {
    const classes = useStyles();
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [text, setText] = useState('');

    const handleEmojiPicker = () => {
      setIsPickerVisible(!isPickerVisible);
    };
    
    const handleChange = (emojiData, event) => {
      setText(text + emojiData.emoji);
      setIsPickerVisible(!isPickerVisible);
    };

  return (
    <TextField
        className={classes.margin}
        id="input-with-icon-textfield"
        label="What do you want to poll?"
        onChange={handleChange}
      />
  )
}

export default InputWithEmoji