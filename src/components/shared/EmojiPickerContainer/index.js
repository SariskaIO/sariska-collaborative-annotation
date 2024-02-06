import { Box, Button } from "@material-ui/core";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import React from "react";

const EmojiPickerContainer = ({
  handleEmojiPicker,
  handleEmojiClick,
  isVisible,
  position,
  left,
  bottom,
  emojiStyle,
  showPreview,
  height,
}) => {
  
  return (
    <Box>
      <Button
        style={{
          padding: "2px",
          borderRadius: "50%",
          minWidth: "50%",
        }}
        onClick={handleEmojiPicker}
      >
        <Emoji unified="1f600" size="24" />
      </Button>
      {
        isVisible ? 
        <Box sx={{ position, left, bottom }}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            emojiStyle={emojiStyle}
            searchDisabled
            previewConfig={{
              showPreview,
            }}
            height={height}
          />
        </Box> 
        : null
      }
    </Box>
  );
};

export default EmojiPickerContainer;
