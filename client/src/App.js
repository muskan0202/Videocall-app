import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

//importing the components of our webpage.
import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notifications from './components/Notifications';

//these css properties define the styling of the webpage
const useStyles = makeStyles((theme) => ({
 
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  header:{
    fontSize:'4em',
    backgroundColor:'#464EB8',
    color:'white',
    padding:'10px',
    width:'100%',
    textAlign:'center',
  }
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}> MS TEAMS VIDEO </div>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </div>
  );
};

export default App;