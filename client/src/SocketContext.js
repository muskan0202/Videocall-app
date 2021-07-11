import React, {createContext, useState, useRef, useEffect } from 'react';
import {io} from 'socket.io-client';
//importing the simple-peer library which is a wrapper around webrtc. I have used this to make api calls to acess camera
//and microphone permissions, add a new participant to the meeting, change audio and video status.
import Peer from 'simple-peer';

const SocketContext= createContext();
//the following is the link to the server. The server is deployed using Heroku app cli.
const socket=io('https://video-chat-mse.herokuapp.com/');

const ContextProvider= ({children}) =>{
//setting the state which can be altered later to perform the functions or when some function s performed.
    const [stream ,setStream] = useState(null);
    const[me, setMe]=useState('');
    const[call, setCall]= useState({});
    const[callEnded, setCallEnded]= useState(false);
    const[callAccepted, setCallAccepted]= useState(false);
    const[callRejected,setCallRejected]=useState(false);
    const[myVideoStatus, setMyVideoStatus] = useState(true);
    const[userVideoStatus, setUserVideoStatus] = useState();
    const[myMicStatus, setMyMicStatus] = useState(true);
    const[userMicStatus, setUserMicStatus] = useState();
    const[name, setName]= useState('');

    const myVideo= useRef();
    const userVideo= useRef();
    const connectionRef= useRef();
    
//this is used to access camera and microphone permissions. getUserMedia method of the webrtc/simple-peer library is used.
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then((currentStream)=> {
                setStream(currentStream);

                myVideo.current.srcObject= currentStream;
            });
            socket.on('me', (id) => setMe(id));

            socket.on('callUser',({from, name: callerName, signal})=> {
                setCall({isReceivingCall: true, from, name: callerName, signal});
            });
    },[] );

//when a call is answered, a new peer connection is made. The person accepting the call is not the initiator and hence initiator is set
//to false. Video and Audio of the user is shared with the initiator on connection.
    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({initiator:false, trickle: false, stream});

        peer.on( 'signal', (data)=> {
            socket.emit('answerCall',{ signal: data, to: call.from });
        });

        peer.on('stream',(currentStream)=> {
            userVideo.current.srcObject= currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current= peer;
    }

//this function closes the video/ audio stream whenever video status or audio status is changed.
    socket.on("updateUserMedia", ({ type, currentMediaStatus }) => {
        if (currentMediaStatus !== null || currentMediaStatus !== []) {
          switch (type) {
            case "video":
              setUserVideoStatus(currentMediaStatus);
              break;
            case "mic":
              setUserMicStatus(currentMediaStatus);
              break;
            default:
              setUserMicStatus(currentMediaStatus[0]);
              setUserVideoStatus(currentMediaStatus[1]);
              break;
          }
        }
      });

//this is the function for when a call is being made. The person calling is the initiator and hence its value is set to true. 
// when calling the user sends stream and data such as user name which is displayed on the notification when a call is received. Also on
//the top of the video player. 

    const callUser = (id) => {
        const peer = new Peer({initiator:true, trickle: false, stream});

        peer.on( 'signal', (data)=> {
            socket.emit('callUser',{ userToCall: id, signalData: data, from: me, name });
        });

        peer.on('stream',(currentStream)=> {
            userVideo.current.srcObject= currentStream;
        });

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current= peer;
    }

//This function is used when a call is denied. The window is then refreshed so that the call cannot be made again as meeting code will change. 
//So to make a call again, new ID should be shared.
    const rejectCall = () => {
        setCallRejected(true);
        window.location.reload();
    }
//When the meeting is over, both the users have the option to leave the call. The window is then refreshed and meeting id is changed.

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    }
  //This function toggles video state between ON and OFF. getVideoTracks is used from the peer-js library to track the status of the stream. 
  //Type "video" is defined which is used in updateUserMedia function to set whether microphone properties are changed or the camera properties.
    const updateVideo = () => {
        setMyVideoStatus((currentStatus) => {
          socket.emit("updateMyMedia", {
            type: "video",
            currentMediaStatus: !currentStatus,
          });
          stream.getVideoTracks()[0].enabled = !currentStatus;
          return !currentStatus;
        });
      };

//This function toggles microphone state between ON and OFF. getAudioTracks is used from the peer-js library to track the status of the stream. 
//Type "mic" is defined which is used in updateUserMedia function to set whether microphone properties are changed or the camera properties.
      const updateMic = () => {
        setMyMicStatus((currentStatus) => {
          socket.emit("updateMyMedia", {
            type: "mic",
            currentMediaStatus: !currentStatus,
          });
          stream.getAudioTracks()[0].enabled = !currentStatus;
          return !currentStatus;
        });
      };
    return (
        <SocketContext.Provider value={
            {call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall, 
            rejectCall,
            callRejected,
            updateMic,
            updateVideo,
            myVideoStatus,
            myMicStatus,
            userVideoStatus,
            userMicStatus,
            setMyMicStatus,
            setMyVideoStatus,
            setUserMicStatus,
            setUserVideoStatus,
        }}>
            {children}
             </SocketContext.Provider>)
};

export {ContextProvider,SocketContext};