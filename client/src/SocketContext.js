import React, {createContext, useState, useRef, useEffect } from 'react';
import {io} from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext= createContext();
const socket=io('http://localhost:5000');

const ContextProvider= ({children}) =>{

    const [stream ,setStream] = useState(null);
    const[me, setMe]=useState('');
    const[call, setCall]= useState({});
    const[callEnded, setCallEnded]= useState(false);
    const[callAccepted, setCallAccepted]= useState(false);
    const[callRejected,setCallRejected]=useState(false);
    const [myVideoStatus, setMyVideoStatus] = useState(true);
    const [userVideoStatus, setUserVideoStatus] = useState();
    const [myMicStatus, setMyMicStatus] = useState(true);
    const [userMicStatus, setUserMicStatus] = useState();
    const[name, setName]= useState('');

    const myVideo= useRef();
    const userVideo= useRef();
    const connectionRef= useRef();

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

    const rejectCall = () => {
        setCallRejected(true);
        window.location.reload();
    }

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    }
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