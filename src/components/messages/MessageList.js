import React, { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Tooltip,
  Zoom,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { colors } from "../../assets/styles/colors";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import PollOutlinedIcon from "@material-ui/icons/PollOutlined";
import { AvatarGroup } from "@material-ui/lab";
import FileAttached from "../shared/FileAttached";
import MediaChat from "./MediaChat";
import EmojiPickerContainer from "../shared/EmojiPickerContainer";
import Model from "../shared/Model";
import VotePoll from "../shared/Poll/VotePoll";
import { useStore } from "../../context";
import { useNavigate } from "react-router-dom";
import { getRandomColor, hasDuplicates, isMessageEmpty } from "../../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: `${colors.gray}`,
  },
  card: {
    flex: 1,
    width: "100%",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    height: "60vh",
    background: colors.white1,
  },
  cardHeader: {
    backgroundColor: `${colors.primaryLight}`,
  },
  avatarList: {
    display: "flex",
    flexDirection: "row",
  },
  arrow: {
    "&: hover": {
      opacity: "0.9",
      cursor: "pointer",
    },
  },
  cardContent: {
    flex: 1,
    height: "200px",
    overflow: "auto",
    padding: "16px 73px",
    [theme.breakpoints.down("md")]: {
      padding: "16px",
    },
  },
  cardAction: {
    boxShadow: "0px 4px 4px 2px rgba(0,0,0,0.8)",
    zIndex: "9",
  },
  cardForm: {
    display: "flex",
    alignItems: "flex-end",
    width: "100%",
  },
  cardTextField: {
    width: "100%",
    padding: "2px",
  },
  enterText: {
    backgroundColor: `${colors.primaryLight}`,
    "&:hover": {
      opacity: "0.8",
      cursor: "pointer",
    },
  },
  box: {
    textAlign: "left",
  },

  chatLine: {
    display: "flex",
    //alignItems: 'center',
    marginBottom: "16px",
  },
  text: {
    background: `${colors.gray}`,
    width: "fit-content",
    padding: "5px",
    borderRadius: "0px 5px 10px",
    marginBottom: "10px",
    maxWidth: "70%",
    marginLeft: "10px",
  },
  userAvatar: {
    height: "24px",
    width: "24px",
    fontSize: "1rem",
    backgroundColor: `${getRandomColor()}`,
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(0.5),
  },
  userAvatar1: {
    height: "26px",
    width: "26px",
    backgroundColor: `${colors.white}`,
    color: `${colors.blue}`,
  },
  customWidth: {
    maxWidth: 100,
    color: "#fff",
    backgroundColor: "#000",
    fontWeight: 700,
    fontSize: "110%",
  },
  poll: {
    color: colors.lightgray1,
    marginBottom: "-2px",
    marginRight: "-3px",
    "&:hover": {
      color: colors.primaryLight,
    },
  },
}));

const initialState = {
  poll: {
    question: " ",
    options: ["", ""],
    error: "",
  }
};

const MessageList = ({
  messages,
  pushMessage,
  loading,
  pushVote,
  newVotes,
  messageId
}) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  //const [chat, setChat] = useState("");
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  let [fileAttached, setFileAttached] = useState([]);
  const [openPoll, setOpenPoll] = React.useState(false);
  const [poll, setPoll] = useState(initialState.poll);
  const [counter, setCounter] = useState(initialState.counter);
  const navigate = useNavigate();
  const {
    users: { user },
    rooms: { room },
  } = useStore();

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleEmojiPicker = () => {
    setIsPickerVisible(!isPickerVisible);
  };

  const handleEmojiClick = (emojiData, event) => {
    setText(text + emojiData.emoji);
    setIsPickerVisible(!isPickerVisible);
  };

  const startFileUpload = (fileData) => {
    const index = fileAttached.findIndex((item) => fileData.id === item.id);

    if (index >= 0) {
      const item = fileAttached[index];
      item.status = fileData.status;
      item.url = fileData.url;
      fileAttached[index] = item;
    } else {
      setFileAttached([...fileAttached, fileData]);
    }
  };

  const removeAttachment = (id) => {
    setFileAttached(fileAttached.filter((file) => file.id !== id));
  };

  const handleOpenPoll = () => {
    setOpenPoll(true);
  };

  const handleChangePoll = (e, index, optValue) => {
    if (e.target.name === "question") {
      setPoll((poll) => ({ ...poll, question: e.target.value }));
    } else {
      const updatedPollOptions = [...poll.options];
      updatedPollOptions[index] = optValue;
      setPoll((poll) => ({
        ...poll,
        options: updatedPollOptions,
      }));
    }
  };

  const disableButton = isMessageEmpty(text, fileAttached);

  const handleClosePoll = (e) => {
    e.preventDefault();
    setPoll(initialState.poll);
    setOpenPoll(false);
  };

  const handleSubmitPoll = (e) => {
    e.preventDefault();
    setPoll((poll) => ({ ...poll, error: `` }));
    if (!poll.question || poll.question.trim() === "") {
      setPoll((poll) => ({
        ...poll,
        error: "Poll Question can't be kept blank",
      }));
      return;
    }
    for (let opt of poll.options) {
      let index = poll.options.indexOf(opt);
      if (!opt) {
        setPoll((poll) => ({
          ...poll,
          error: `Poll Option ${index + 1} can't be kept blank`,
        }));
        break;
      }
    }

    if (hasDuplicates(poll.options)) {
      setPoll((poll) => ({
        ...poll,
        error: `Poll can't have duplicate options`,
      }));
    }

    if (poll.error) {
      return;
    }
    //setPoll((poll) => ({ ...poll, question: poll.question.trim() }));
    let trimmedPoll = {...poll, question: poll.question.trim()};
    pushMessage(trimmedPoll, "poll");

    if (!disableButton) {
      setPoll(initialState.poll);
    }
    setOpenPoll(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileAttached.find((item) => item.status === "loading")) {
      return;
    }
    if (!disableButton) {
      if (text) {
        pushMessage(text);
      }
      if (fileAttached.length) {
        fileAttached.map((item) => {
          if (item.status === "done") {
            pushMessage(item.url);
          }
        });
      }
    }
    setText("");
    setFileAttached([]);
    //setChat((chat) => [...chat, text]);
  };

  useEffect(() => {
    //const userDetails = JSON.parse(localStorage.getItem("user"));
    //const roomDetails = JSON.parse(localStorage.getItem("room"));
    //setUser(userDetails);
    //setRoom(roomDetails);
    scrollToBottom();
  }, []);

  const scrollRef = useRef(null);
  const scrollToBottom = () => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [text]);

  const goBack = () => navigate("/");

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <div className={classes.avatarList}>
              <Tooltip
                TransitionComponent={Zoom}
                title={user.name}
                arrow
                classes={{ tooltip: classes.customWidth }}
              >
                <AvatarGroup max={2}></AvatarGroup>
              </Tooltip>
            </div>
          }
          // action={
          //   <IconButton aria-label="settings">
          //     <MoreVertIcon />
          //   </IconButton>
          // }
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: colors.white,
              }}
            >
              <ArrowBackIcon onClick={goBack} className={classes.arrow} />
              <div style={{ fontWeight: 900, fontSize: "1.2rem" }}>
                <span>Room Name : </span>
                {!loading ? (
                  <span style={{ color: colors.searchFocus }}>
                    {room?.session_id}
                  </span>
                ) : null}
              </div>
              <div style={{ fontWeight: 900, fontSize: "1.2rem" }}>
                <span> User : </span>
                {!loading ? (
                  <span style={{ color: colors.searchFocus }}>
                    {user?.name}
                  </span>
                ) : null}
              </div>
            </div>
          }
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
          ></Typography>
          <Box className={classes.box}>
            {messages.map((message, id) => (
              <Box className={classes.chatLine} key={message.id}>
                <Avatar aria-label="user" className={classes.userAvatar}>
                  {message.created_by_name?.toUpperCase().slice(0, 1)}
                </Avatar>

                {
                  message.content_type === "poll" ? (
                    <VotePoll
                      username={message?.created_by_name}
                      poll={message}
                      counter={counter}
                      pushVote={pushVote}
                      newVotes={newVotes}
                      messageId={messageId}
                    />
                  ) : (
                    <MessageItem message={message} id={id} user={user} />
                  )
                }
              </Box>
            ))}
          </Box>
          <Typography ref={scrollRef} style={{ height: "18px" }}></Typography>
        </CardContent>
        {fileAttached.length > 0 && (
          <Box className={classes.cb__chatWrapper__attachements}>
            {fileAttached.map((file, index) => (
              <FileAttached
                key={index}
                fileData={file}
                removeAttachment={removeAttachment}
              />
            ))}
          </Box>
        )}
        <CardActions disableSpacing className={classes.cardAction}>
          {
            <MediaChat
              startFileUpload={startFileUpload}
              currentMessage={text}
            />
          }
          <form
            noValidate
            autoComplete="off"
            className={classes.cardForm}
            onSubmit={handleSubmit}
          >
            <Grid
              container
              spacing={1}
              alignItems="flex-end"
              style={{ width: "100%", alignItems: "center" }}
            >
              <Grid item>
                <Button
                  style={{
                    padding: "2px",
                    borderRadius: "50%",
                    minWidth: "50%",
                  }}
                  onClick={handleOpenPoll}
                >
                  <Tooltip title="Poll" placement="top">
                    <PollOutlinedIcon className={classes.poll} />
                  </Tooltip>
                </Button>
              </Grid>
              <Model
                open={openPoll}
                poll={poll}
                setPoll={setPoll}
                handleChange={handleChangePoll}
                handleClose={handleClosePoll}
                handleSubmit={handleSubmitPoll}
              />
              <Grid item>
                <EmojiPickerContainer
                  handleEmojiClick={handleEmojiClick}
                  handleEmojiPicker={handleEmojiPicker}
                  isVisible={isPickerVisible}
                  position={"absolute"}
                  left={"60px"}
                  bottom={"75px"}
                  emojiStyle={"apple"}
                  showPreview={false}
                  height={350}
                />
              </Grid>
              <Grid item style={{ flex: 1 }}>
                <TextField
                  id="text"
                  label="Enter Text Here"
                  variant="outlined"
                  className={classes.cardTextField}
                  onChange={handleChange}
                  value={text}
                />
              </Grid>
              <Grid item>
                <Avatar
                  className={classes.enterText}
                  onClick={handleSubmit}
                  disabled={disableButton}
                >
                  <DoneAllIcon />
                </Avatar>
              </Grid>
            </Grid>
          </form>
        </CardActions>
      </Card>
      {/* {messages.map((message, id) => <MessageItem message={message} key={id}/>)} */}
    </div>
  );
};

export default MessageList;
