import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config.json';
import io from 'socket.io-client';
import ForumPage_Navbar from '../components/ForumPage_Navbar';
import Graph from "react-vis-network-graph";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Divider } from '@mui/material';

export default function Forum() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [open, setOpen] = useState(false);
  const [nodeData, setNodeData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const ws = io.connect('http://127.0.0.1:8000');              
    
  const handleClickOpen = (nodeId) => {
    setOpen(true);
    setSelectedNode(nodeId);
    localStorage.setItem('nodeId', nodeId);
  };

  const handleClose = () => {
      setOpen(false);
      localStorage.removeItem('nodeId');
  };
  
  useEffect(() => {
    if (ws) {
      console.log("initWebSocket 1");
      initWebSocket();
    }
    const getNodeData = async () => {
      try {
          const response = await axios.get(`${config[11].getOneNode}/${localStorage.getItem('nodeId')}`);
          setNodeData(response.data);
          console.log(response.data);
      } catch (err) {
          console.log(err);
      }
    };

    getNodeData();
  }, []);
  
  const getNodes = async () => {
    const fetchData = await axios.get(`${config[8].getNode}/1`, {
      headers: {
        authorization: 'Bearer JWT Token',
      },
    });

    const fetchEdge = await axios.get(`${config[10].getEdge}/1`, {
      headers: {
        authorization: 'Bearer JWT Token',
      },
    });

    console.log("fetchData: ", fetchData);
    console.log("fetchEdge: ", fetchEdge);

    const nodeData = fetchData.data[0].Nodes.map((node) => ({
      id: node.id,
      label: node.title,
      title: node.content,
      group: node.tags
    }));

    const edgeData = fetchEdge.data.map((edge) => ({
      from: edge.from,
      to: edge.to
    }));

    console.log('nodeData: ', nodeData);
    console.log('edgeData: ', edgeData);
    setNodes(nodeData);
    setEdges(edgeData);
    console.log('graph: ', nodes);
  };
  
  const initWebSocket = () => {
    
    console.log("initWebSocket 2");
    ws.on('connect', () => {
      console.log("connect 1", ws.id);
      getNodes();
    });

    ws.on('event02', (arg, callback) => {
      console.log("connect [event02]",arg);
      getNodes();
      callback({
        status: 'event02 ok',
      });
    });
  };

  const graph = {
    nodes: nodes,
    edges: edges,
  };

  const options = {
    layout: {
      randomSeed: 23,
      hierarchical: {
        enabled: true,
        blockShifting: true,
        edgeMinimization: true,
        direction: 'RL',
        sortMethod: 'directed',
      },
    },
    interaction: {
      navigationButtons: true,
      tooltipDelay: 300
    },
    clickToUse: true,
    groups: {
      idea: {
        color: {
          border: '#D2E0FB',
          background: '#D2E0FB',
          highlight: {
            border: '#D2E0FB',
            background: '#D2E0FB'
          }
        },
      },
      question: {
        color: {
          border: '#FFC5C5',
          background: '#FFC5C5',
          highlight: {
            border: '#FFC5C5',
            background: '#FFC5C5'
          }
        },
      },
      information: {
        color: {
          border: '#8EACCD',
          background: '#8EACCD',
          highlight: {
            border: '#8EACCD',
            background: '#8EACCD'
          }
        },
      },
      experiment: {
        color: {
          border: '#D7E5CA',
          background: '#D7E5CA',
          highlight: {
            border: '#D7E5CA',
            background: '#D7E5CA'
          }
        }
      },
      record: {
        color: {
          border: '#F9F3CC',
          background: '#F9F3CC',
          highlight: {
            border: '#F9F3CC',
            background: '#F9F3CC'
          }
        },
      }
      // add more groups here
    },
    edges: {
      color: '#8B8B8B',
      width: 3,
      length: 150,
      color: { inherit: 'from' },
      arrows: {
        from: {
          enabled: true,
          scaleFactor: 0.7,
        },
        to: {
          enabled: false,
        },
      },
    },
    nodes: {
      shape: 'box',
      borderWidth: 1,
      chosen: true,
      shapeProperties: {
        borderRadius: 1
      },
      color: {
        border: '#E3DFFD',
        background: '#E3DFFD',
        highlight: {
          border: '#e3dffdcb',
          background: '#e3dffdcb'
        },
        hover: {
          border: '#e3dffdcb',
          background: '#e3dffdcb'
        }
      },
      opacity: 1,
      font: {
        color: '#343434',
        size: 14, // px
        face: 'arial',
        background: 'none',
        strokeWidth: 0, // px
        strokeColor: '#ffffff',
        align: 'center',
        multi: false,
        vadjust: 0,
        bold: {
          color: '#343434',
          size: 14, // px
          face: 'arial',
          vadjust: 0,
          mod: 'bold'
        },
        ital: {
          color: '#343434',
          size: 14, // px
          face: 'arial',
          vadjust: 0,
          mod: 'italic',
        },
        boldital: {
          color: '#343434',
          size: 14, // px
          face: 'arial',
          vadjust: 0,
          mod: 'bold italic'
        },
        mono: {
          color: '#343434',
          size: 15, // px
          face: 'courier new',
          vadjust: 2,
          mod: ''
        }
      },
      hidden: false,
      label: "HTML",
      level: undefined,
      margin: 20,
      shadow: {
        color: 'rgba(33,33,33,.7)',
        size: 10,
        x: 10,
        y: 10
      },
      heightConstraint: { minimum: 20, valign: 'middle' },
      widthConstraint: { minimum: 20, maximum: 50 },
      mass: 1,
      physics: true,
      scaling: {
        label: {
          enabled: true,
          min: 12,
          max: 30,
          drawThreshold: 12,
          maxVisible: 30,
        },
        customScalingFunction: function (min,max,total,value) {
          if (max === min) {
            return 0.5;
          }
          else {
            let scale = 1 / (max - min);
            return Math.max(0,(value - min)*scale);
          }
        }
      },
      value: 1,
    }
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
    click: (event) => {
      var { nodes, edges, items } = event;
      console.log('click~', nodes);
      console.log('click~', event);
      if (nodes.length == 1) {
        handleClickOpen(nodes[0]);
      }
    }
  };

  return (
    <div className="home-container">
      <ForumPage_Navbar/>
      <div
        id="graph"
        style={{
          flex: 1,
          height: '100vh',
          overflow: 'auto',
          position: 'fixed',
          top: '0',
          left: '0',
          marginLeft: '64px',
        }}
      >
        <Graph graph={graph} options={options} events={events}/>
      </div> 
      <Dialog
              open={handleClickOpen}
              onClose={handleClose}
              maxWidth="md"
              scroll='body'
            >
                <DialogTitle>
                    {nodeData && (    // ensure that nodeData is not null or undefined before trying to access its properties.
                        <>
                            {nodeData.title}
                        </>
                    )}
                </DialogTitle>
                <Divider variant="middle" />
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {nodeData && (    // ensure that nodeData is not null or undefined before trying to access its properties.
                            <>
                                {nodeData.content}
                            </>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    {/* <Button type='submit' onClick={handleSubmit}>送出</Button> */}
                </DialogActions>
            </Dialog>
      {/* {selectedNode != '' && (<ViewNode open={handleClickOpen} onClose={handleClose} />)} */}
    </div>
  );
}