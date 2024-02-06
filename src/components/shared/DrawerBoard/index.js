import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

const useStyles = makeStyles({
  
});

export default function DrawerBoard({toggleDrawer, open, content}) {
  const classes = useStyles();
  return (
    <div>
          <SwipeableDrawer
            anchor={'right'}
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            {content('right')}
          </SwipeableDrawer>
    </div>
  );
}
