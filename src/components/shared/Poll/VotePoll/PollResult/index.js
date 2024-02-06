import { Box, Button, Card, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import StarIcon from "@material-ui/icons/Star";
import { colors } from "../../../../../assets/styles/colors";
import ListBoard from "../../../ListBoard";
import { getSingularOrPlural } from "../../../../../utils";

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: "initial",
    paddingTop: "12px",
    padding: 0,
    color: colors.primary,
    "&:hover": {
      background: "transparent",
    },
  },
  list: {
    width: 450,
    background: colors.backgroundMix,
  },
  closeButton: {
    textTransform: "initial",
    padding: 0,
    color: colors.primary,
    minWidth: "auto",
    "&:hover": {
      background: "transparent",
    },
  },
  close: {
    color: colors.gray,
    marginRight: "24px",
    fontWeight: "900",
    fontSize: "1.7rem",
  },
  card: {
    boxShadow: "none",
    borderRadius: 0,
    marginBottom: "12px",
  },
  counterButton: {
    fontSize: "0.75rem",
    textTransform: "initial",
    background: colors.gray3,
    padding: "0 8px",
    height: "21px",
  },
  maxCounterButton: {
    fontSize: "0.75rem",
    textTransform: "initial",
    color: colors.primary,
    background: colors.altBack,
    padding: "0 8px",
    height: "21px",
  },
}));

const PollResult = ({ toggleDrawer, poll, votes, votedTable, maxVotes }) => {
  const classes = useStyles();
  
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "60px",
          paddingLeft: "24px",
        }}
      >
        <Button
          disableRipple
          className={classes.closeButton}
          onClick={toggleDrawer(false)}
        >
          <CloseIcon className={classes.close} />
        </Button>
        <Typography>Poll details</Typography>
      </Box>
      <Card className={classes.card}>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            style={{ fontSize: "1.3rem", marginBottom: "12px" }}
          >
            {poll.content}
          </Typography>
          <Typography variant="subTitle2" style={{ fontSize: "0.9rem" }}>
            {votes?.length} participants voted
          </Typography>
        </Box>
      </Card>
      {
        votedTable?.map((vote) => (
            <Card className={classes.card}>
            <Box sx={{ p: 3 }}>
                <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                }}
                >
                <Typography variant="h6" style={{ fontSize: "1rem" }}>
                    {vote[1]}
                </Typography>
                {maxVotes > 0 && maxVotes === vote[2] ? (
                    <Button className={classes.maxCounterButton}>
                    {vote[2]} {getSingularOrPlural(vote[2], "vote")}{" "}
                    <StarIcon style={{ fontSize: "0.8rem" }} />
                    </Button>
                ) : (
                    <Button className={classes.counterButton}>
                    {vote[2]} {getSingularOrPlural(vote[2], "vote")}
                    </Button>
                )}
                </Box>
                <Box>
                {vote[3]?.length > 0 ? <ListBoard list={vote[3]} /> : null}
                </Box>
            </Box>
            </Card>
        ))
      }
    </div>
  );
};

export default PollResult;
