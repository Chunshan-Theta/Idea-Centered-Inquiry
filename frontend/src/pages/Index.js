import config from '../config.json';
import axios from "axios";
import React, { useState, useEffect } from 'react';
import IndexPage_Navbar from '../components/IndexPage_Navbar';
import { styled, Grid, Card, CardHeader, CardContent, IconButton, Typography, Select, InputLabel, MenuItem, FormControl, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import io from 'socket.io-client';

const Item = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#E3DFFD',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

export default function Index() {
  const [all, setAll] = useState('');
  const [activities, setActivities] = useState([]);
  const [ws, setWs] = useState(null);

  const handleChange = (event) => {
    setAll(event.target.value);
  };

  const connectWebSocket = () => {
    console.log('😮😮😮');
    setWs(io("http://127.0.0.1:8000"));
  }

  useEffect(() => {
    const getActivities = async() => {
      console.log("我在這裡!!!看我!!!")
      try{
        const fetchData = await axios.get(`${config[3].activityList}/${localStorage.getItem('userId')}`, {
          headers: {
            authorization: 'Bearer JWT Token',
          },
        })
        setActivities(fetchData.data)
        console.log(fetchData);
      }
      catch (err){
        console.log(err)
      }
    };
    getActivities();

    if(ws){
      console.log('success connect!');
      initWebSocket();
    }
  }, [ws]); // 空的依賴陣列確保 `useEffect` 只執行一次，相當於 `componentDidMount`

  const initWebSocket = () => {
    console.log("initWebSocket1",ws);
    ws.on("connect", () => {
      console.log(ws.id); // x8WIv7-mJelg7on_ALbx
    });
    ws.on("event02", (arg,callback) => {
      console.log(arg); // world
      callback({
        status: "event02 ok"
      })
    });
    console.log("initWebSocket2",ws);

  };

  const sendMessage = () => {
    console.log("event01!!!",ws);
    ws.emit('event01', '回傳發送訊息的...',(response) => {
      console.log(response.status); // ok
    });
    console.log("event01!!!!!!!");
  };

  return (
    <div className="home-container">
      <IndexPage_Navbar />
      <h2>我們的探究活動</h2>
      <input type='button' value='連線' onClick={connectWebSocket} />
      <input type='button' value='送出' onClick={sendMessage} />
      <Box sx={{ maxWidth: 120 }} className='activity-status'>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">狀態</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={all}
            label="狀態"
            onChange={handleChange}
          >
            <MenuItem value={10}>全部</MenuItem>
            <MenuItem value={20}>已完成</MenuItem>
            <MenuItem value={30}>進行中</MenuItem>
            <MenuItem value={30}>未開始</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item xs={10}>
          <Grid container justifyContent="center" spacing={4}>
            {activities.map((activity) => (
              <Grid item xs={6} key={activity.id}>
                <Item>
                  <CardHeader
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={activity.title}
                    // subheader={activity.activityKey}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {activity.startDate}-{activity.endDate}
                    </Typography>
                  </CardContent>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}