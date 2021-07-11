import React, {useContext, useState} from 'react';
import {Button, Typography, Grid, TextField, Container, Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {Assignment, Phone, PhoneDisabled} from '@material-ui/icons';
import { SocketContext } from '../SocketContext';

//react-share library is used to add social media sharing options.
//However I have included only whatsapp and email as they seemed the most relevant.
import {EmailShareButton,  WhatsappShareButton, WhatsappIcon,EmailIcon} from "react-share";

//defining the styling of the options component. It is fully responsive.
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    gridContainer: {
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    container: {
      width: '600px',
      margin: '35px 0',
      padding: 0,
      [theme.breakpoints.down('xs')]: {
        width: '80%',
      },
    },
    margin: {
      marginTop: 20,
    },
    padding: {
      padding: 20,
    },
    paper: {
      padding: '10px 20px',
      border: '2px solid #464EB8',
    },
  }));

  
const Options= ({children}) =>{
  //importing all the functions and states that will be used in our project. 
    const {me, callAccepted, name, setName, leaveCall, callEnded, callUser}=useContext(SocketContext);
    const [IdToCall, setIdToCall]= useState('');
    const classes=useStyles();

    return(
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography gutterBottom variant="h6">User Info</Typography>
              <TextField label="Name" value={name} required 
              onChange={(e) => {setName(e.target.value); localStorage.setItem("name", e.target.value); }}
              fullWidth />
              <CopyToClipboard text={me} className={classes.margin}>
                <Button variant="contained" color="primary" fullWidth startIcon={<Assignment fontSize="large" />}>
                  Copy Meeting ID
                </Button>
              </CopyToClipboard>
              <div style={{padding:'10px'}}>
                {/*The sharing buttons send the meeting id along with the url of the website where the app is deployed. */}
              <WhatsappShareButton
              url={`https://msteams-video-mse.netlify.app`}
              title={`Click on the link below and enter the meeting code: ${me} to join the meeting.\n`}
              separator="Link: "
            >
              <WhatsappIcon size={26} round />
            </WhatsappShareButton>
            &nbsp; {/* this command is used to add a horizontal spacing between the whatsapp and email icons*/}
            <EmailShareButton url={`https://msteams-video-mse.netlify.app`} subject={`Meeting Invitation`} 
            body={`Click on the link below and enter the meeting code: ${me} to join the meeting.\n`}
            seperator="Link: " >
              <EmailIcon size={26} round/>
            </EmailShareButton>
              </div>
            </Grid>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography gutterBottom variant="h6">Join a meeting</Typography>
              <TextField label="Enter meeting ID" value={IdToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
              {/*The Call button is replaced by the hangup button when a user is in call with someone. I have used ternary operator to implement 
              it.*/}
              {callAccepted && !callEnded ? (
                <Button variant="contained" style={{backgroundColor: '#F52B2B', color: '#FFFFFF'}} startIcon={<PhoneDisabled fontSize="large" />} 
                fullWidth onClick={leaveCall} className={classes.margin}>
                  Hang Up
                </Button>
              ) : (
                <Button variant="contained" style={{backgroundColor: '#12824C', color: '#FFFFFF'}} startIcon={<Phone fontSize="large" />} 
                fullWidth onClick={() => { if (name.length) callUser(IdToCall);
                  else alert("Enter Name to continue");
                }} className={classes.margin}>
                  Call
                </Button>
              )}
              
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
}
export default Options;