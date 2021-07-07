import React, {useContext} from 'react';
import {Grid, Typography, Paper, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ContextProvider, SocketContext } from '../SocketContext';
import { Socket } from 'socket.io-client';
import './iconmonstr-microphone-4.svg';
import MicIcon from "./icons/mic-on.svg";
import MicOff from "./icons/mic-off.svg";
import VidIcon from "./icons/video-on.svg";
import VidOff from "./icons/video-off.svg";

const useStyles = makeStyles((theme) => ({
    video: {
      width: '550px',
      [theme.breakpoints.down('xs')]: {
        width: '300px',
      },
    },
    video1: {
      width: '200px',
      [theme.breakpoints.down('xs')]: {
        width: '300px',
      },
    },
    video2: {
      width: '900px',
      [theme.breakpoints.down('xs')]: {
        width: '300px',
      },
    },
    gridContainer: {
      justifyContent: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    paper: {
      padding: '10px',
      border: '2px solid black',
      margin: '10px',
    },
  }));

const VideoPlayer= () =>{
    const classes= useStyles();
    const {name,callAccepted, myVideo, userVideo, callEnded, stream, call,updateMic,updateVideo, myMicStatus,
      myVideoStatus}=useContext(SocketContext);
    return(
        <Grid container className= { classes.gridContainer}>
            {/*Own video */}
            { stream &&(
              <Paper className={classes.paper} >
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" gutterBottom>{name || 'Name'}
                  </Typography>
                  {callAccepted && !callEnded?
                  (
                    <video playsInline muted ref={myVideo } autoPlay className={classes.video1} />                       
                  )
                  :
                  (<video playsInline muted ref={myVideo } autoPlay className={classes.video} /> )}
                  <div>
                  <Button onClick={()=> updateMic()}>
                    {myMicStatus ? (
                    <img src={MicIcon} alt="mic on icon" />
                    ) : (
                    <img src={MicOff} alt="mic off icon" />
                    )}
                  </Button>
                  <Button  onClick={()=> updateVideo()}>
                    {myVideoStatus ? (
                    <img src={VidIcon} alt="video on icon" />
                    ) : (
                    <img src={VidOff} alt="video off icon" />
                    )}
                  </Button>
                  
                  </div>
                </Grid>
              </Paper>
              )
            }            
            {/* User video*/}
            {callAccepted && !callEnded && (
              <Paper className={classes.paper} >
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" gutterBottom>{call.name || 'Name' }
                  </Typography>
                  <video playsInline  ref={userVideo } autoPlay className={classes.video2} />
                </Grid>
              </Paper>
            )}            
        </Grid>
  );
}

export default VideoPlayer;