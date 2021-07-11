import React, {useContext} from 'react';
import {Grid, Typography, Paper, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ContextProvider, SocketContext } from '../SocketContext';
import { Socket } from 'socket.io-client';

//these are the icons for changing the audio and video state of the user
import MicIcon from "./icons/mic-on.svg";
import MicOff from "./icons/mic-off.svg";
import VidIcon from "./icons/video-on.svg";
import VidOff from "./icons/video-off.svg";

//defining the styles of videos player. There are 3 different classes of videos.
//These differ in the size of the video. When the user starts the website, they will be able to see themselves in a bigger window 
//when compared to the time when 2 peers are present.
//At that time video1 defines our own video which will be smaller than that of the other user's video which is defined by video2.
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
      border: '2px solid #464EB8',
      margin: '10px',
    },
  }));

const VideoPlayer= () =>{
    const classes= useStyles();
    //importing all the functions and states that will be used in our project. 
    const {name,callAccepted, myVideo, userVideo, callEnded, stream, call,updateMic,updateVideo, myMicStatus,
      myVideoStatus}=useContext(SocketContext);
    return(
        <Grid container className= { classes.gridContainer}>
            {/*Self video. It will be visible at all times however the size of the grid changes and thus ternary operator is used for it. */}
            { stream &&(
              <Paper className={classes.paper} >
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" gutterBottom>{name || 'Name'}
                  </Typography>
                  {callAccepted && !callEnded?
                  (<video playsInline muted ref={myVideo } autoPlay className={classes.video1} />
                  )
                  :
                  (<video playsInline muted ref={myVideo } autoPlay className={classes.video} /> )}
                  <div>
                    {/*Buttons to alter the state of audio and video. However the video device does not turn off.
                    This is because webrtc only switches off only the stream and not the camera.*/}
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
            {/* User video. It will be visible only when a connection is made between the 2 peers.*/}
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