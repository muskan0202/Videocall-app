import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { ContextProvider, SocketContext } from '../SocketContext';
import { CallReceived, NotInterested } from '@material-ui/icons';

const Notifications = () => {
    const { answerCall, call, callAccepted,rejectCall } = useContext(SocketContext);
  
    return (
      <>
        {call.isReceivingCall && !callAccepted && (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <h1>{call.name} is calling:</h1>
            <Button variant="contained" style={{backgroundColor: '#12824C', color: '#FFFFFF'}} onClick={answerCall} startIcon={<CallReceived fontSize="large" />}>
              Answer
            </Button>
            <Button variant="contained" style={{backgroundColor: '#F52B2B', color: '#FFFFFF'}} onClick={rejectCall} startIcon={<NotInterested fontSize="large" />}>
              Deny
            </Button>
          </div>
        )}
      </>
    );
  };
export default Notifications;