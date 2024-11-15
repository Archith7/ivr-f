import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../stylecss/webrtc.css';

const socket = io('https://192.168.22.70:3000/'); // Connect to the signaling server
let audioChunks = [];
const apiEndpoint = 'http://127.0.0.1:8000/upload-audio'; // API endpoint for audio upload

const WebRTC = () => {
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recognitionShouldRestart, setRecognitionShouldRestart] = useState(true);

  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  const startTimer = () => {
    setIsRunning(true);
    const id = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    clearInterval(intervalId);
    setTimer(0);
    setIsRunning(false);
  };

  // Initialize SpeechRecognition
  const recognition = useRef(null);
  const transcript = useRef('');

  useEffect(() => {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new window.SpeechRecognition();
    recognition.current.interimResults = true;
    recognition.current.lang = 'en-US';

    recognition.current.addEventListener('result', (e) => {
      transcript.current = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
    });

    recognition.current.addEventListener('start', () => {
      console.log('Speech recognition started');

      // Check if localStream is available before starting MediaRecorder
      if (localStream) {
        const recorder = new MediaRecorder(localStream);
        setMediaRecorder(recorder);
        audioChunks = []; // Reset audio chunks for a new recording session

        recorder.ondataavailable = event => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        recorder.start();
        console.log('Media recorder started.');
      } else {
        console.error('No local stream available to start recording.');
      }
    });

    // recognition.current.addEventListener('end', () => {
    //   console.log('Speech recognition ended. Final transcript:', transcript.current);
    //   if (recognitionShouldRestart) {
    //     recognition.current.start();
    //   }
    //   if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    //     mediaRecorder.stop();
    //   }
    // });

    recognition.current.addEventListener('end', () => {
      console.log('Speech recognition ended. Final transcript:', transcript.current);
      if (recognitionShouldRestart) {
        recognition.current.start();
      }
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        sendAudioToApi(audioBlob);
      }
    });

    return () => {
      recognition.current.removeEventListener('result', () => {});
      recognition.current.removeEventListener('start', () => {});
      recognition.current.removeEventListener('end', () => {});
    };
  }, [localStream, mediaRecorder, recognitionShouldRestart]);

  const startSpeechRecognition = () => {
    setRecognitionShouldRestart(true);
    recognition.current.start();
  };

  const stopSpeechRecognition = () => {
    setRecognitionShouldRestart(false);
    recognition.current.stop();
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localAudioRef.current.srcObject = stream;
      localAudioRef.current.muted = true;
      setLocalStream(stream);

      const pc = new RTCPeerConnection(configuration);
      setPeerConnection(pc);

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', { candidate: event.candidate });
        }
      };

      pc.ontrack = (event) => {
        remoteAudioRef.current.srcObject = event.streams[0];
        if (event.streams[0].active) {
          setIsCallConnected(true);
          startTimer();
          startSpeechRecognition(); // Start speech recognition when call starts
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { offer });
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const endCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (localAudioRef.current) localAudioRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;

    socket.emit('endCall');
    stopTimer();
    stopSpeechRecognition(); // Stop speech recognition when call ends
    setIsCallConnected(false);
  };

  const sendAudioToApi = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.mp3');

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const llmResponse = data.message;
        console.log('Received LLM response:', llmResponse);
        speakText(llmResponse); // Convert the LLM response text to speech
      } else {
        console.error('Failed to send audio file', response.statusText);
      }
    } catch (error) {
      console.error('Error sending audio file', error);
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set the language (you can change it as needed)
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    socket.on('offer', async (data) => {
      const { offer } = data;
      if (offer && offer.type) {
        const pc = new RTCPeerConnection(configuration);
        setPeerConnection(pc);

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('candidate', { candidate: event.candidate });
          }
        };

        pc.ontrack = (event) => {
          remoteAudioRef.current.srcObject = event.streams[0];
          if (event.streams[0].active) {
            setIsCallConnected(true);
            startTimer();
            startSpeechRecognition(); // Start speech recognition when call starts
          }
        };

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('answer', { answer });
        } catch (error) {
          console.error('Error handling offer:', error);
        }
      } else {
        console.error('Invalid offer received:', offer);
      }
    });

    socket.on('answer', async (data) => {
      const { answer } = data;
      if (peerConnection && answer && answer.type) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
          console.error('Error setting remote description for answer:', error);
        }
      } else {
        console.error('Invalid answer received:', answer);
      }
    });

    socket.on('candidate', async (data) => {
      const { candidate } = data;
      if (peerConnection) {
        try {
          await peerConnection.addIceCandidate(candidate);
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    socket.on('endCall', () => {
      endCall();
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('candidate');
      socket.off('endCall');
    };
  }, [peerConnection]);

  return (
    <div className="webrtc">
      <h1>Voice Chat With Virtual Agent</h1>
      
      {/* Image Section */}
      <div className="image-container">
        <img src="images/robo.jpg" alt="Voice Chat" />
      </div>
      
      {/* Call Controls */}
      <div className="call-container">
        <button id="startCall" className="btn" onClick={startCall} disabled={isCallConnected}>Start Call</button>
        <button id="endCall" className="btn" onClick={endCall} disabled={!isCallConnected}>End Call</button>
      </div>
      
      {/* Audio Elements */}
      <audio ref={localAudioRef} autoPlay />
      <audio ref={remoteAudioRef} autoPlay />
      
      {/* Timer */}
      <div className="timer">
        {isRunning ? `Call Duration: ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` : ''}
      </div>

    </div>
  );
};

export default WebRTC;


// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import '../stylecss/webrtc.css';

// const socket = io('http://localhost:5000'); // Connect to the signaling server

// const WebRTC = () => {
//   const [localStream, setLocalStream] = useState(null);
//   const [peerConnection, setPeerConnection] = useState(null);
//   const [isCallConnected, setIsCallConnected] = useState(false);
//   const [timer, setTimer] = useState(0);
//   const [isRunning, setIsRunning] = useState(false);
//   const [intervalId, setIntervalId] = useState(null);

//   const localAudioRef = useRef(null);
//   const remoteAudioRef = useRef(null);

//   const configuration = {
//     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//   };

//   const startTimer = () => {
//     setIsRunning(true);
//     const id = setInterval(() => {
//       setTimer((prev) => prev + 1);
//     }, 1000);
//     setIntervalId(id);
//   };

//   const stopTimer = () => {
//     clearInterval(intervalId);
//     setTimer(0);
//     setIsRunning(false);
//   };

//   const startCall = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       localAudioRef.current.srcObject = stream;
//       localAudioRef.current.muted = true;
//       setLocalStream(stream);

//       const pc = new RTCPeerConnection(configuration);
//       setPeerConnection(pc);

//       stream.getTracks().forEach((track) => pc.addTrack(track, stream));

//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket.emit('candidate', { candidate: event.candidate });
//         }
//       };

//       pc.ontrack = (event) => {
//         remoteAudioRef.current.srcObject = event.streams[0];
//         if (event.streams[0].active) {
//           setIsCallConnected(true);
//           startTimer();
//         }
//       };

//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
//       socket.emit('offer', { offer });
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };

//   const endCall = () => {
//     if (peerConnection) {
//       peerConnection.close();
//       setPeerConnection(null);
//     }

//     if (localStream) {
//       localStream.getTracks().forEach((track) => track.stop());
//       setLocalStream(null);
//     }

//     if (localAudioRef.current) localAudioRef.current.srcObject = null;
//     if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;

//     socket.emit('endCall');
//     stopTimer();
//     setIsCallConnected(false);
//   };

//   useEffect(() => {
//     socket.on('offer', async (data) => {
//       const { offer } = data;
//       if (offer && offer.type) {
//         const pc = new RTCPeerConnection(configuration);
//         setPeerConnection(pc);

//         pc.onicecandidate = (event) => {
//           if (event.candidate) {
//             socket.emit('candidate', { candidate: event.candidate });
//           }
//         };

//         pc.ontrack = (event) => {
//           remoteAudioRef.current.srcObject = event.streams[0];
//           if (event.streams[0].active) {
//             setIsCallConnected(true);
//             startTimer();
//           }
//         };

//         try {
//           await pc.setRemoteDescription(new RTCSessionDescription(offer));
//           const answer = await pc.createAnswer();
//           await pc.setLocalDescription(answer);
//           socket.emit('answer', { answer });
//         } catch (error) {
//           console.error('Error handling offer:', error);
//         }
//       } else {
//         console.error('Invalid offer received:', offer);
//       }
//     });

//     socket.on('answer', async (data) => {
//       const { answer } = data;
//       if (peerConnection && answer && answer.type) {
//         try {
//           await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//         } catch (error) {
//           console.error('Error setting remote description for answer:', error);
//         }
//       } else {
//         console.error('Invalid answer received:', answer);
//       }
//     });

//     socket.on('candidate', async (data) => {
//       const { candidate } = data;
//       if (peerConnection) {
//         try {
//           await peerConnection.addIceCandidate(candidate);
//         } catch (error) {
//           console.error('Error adding ICE candidate:', error);
//         }
//       }
//     });

//     socket.on('endCall', () => {
//       endCall();
//     });

//     return () => {
//       socket.off('offer');
//       socket.off('answer');
//       socket.off('candidate');
//       socket.off('endCall');
//     };
//   }, [peerConnection]);

//   return (
//     // <div className="webrtc-container">
//     //   <button onClick={startCall} disabled={isCallConnected}>Start Call</button>
//     //   <button onClick={endCall} disabled={!isCallConnected}>End Call</button>
//     //   <div className="audio-players">
//     //     <audio ref={localAudioRef} autoPlay />
//     //     <audio ref={remoteAudioRef} autoPlay />
//     //   </div>
//     //   <div className="timer">
//     //     {isRunning ? `Call Duration: ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` : 'Call not started'}
//     //   </div>
//     // </div>
//     // <div className="webrtc">
//     //   <h1>Voice Chat With Virtual Agent</h1>
//     //   <div className="image-container">
//     //     <img src="images/robo.jpg" alt="Voice Chat" />
//     //   </div>
//     //   <div className="call-container">
//     //     <button id="startCall" className="btn" onClick={startCall} disabled={isRunning}>Start Call</button>
//     //     <button id="endCall" className="btn" onClick={endCall} disabled={!isRunning}>End Call</button>
//     //   </div>
//     //   {/* <div className="timer">
//     //     {formatTime(timer)}
//     //   </div> */}
//     //   <div className="timer">
//     //    {isRunning ? `Call Duration: ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` : 'Call not started'}
//     //   </div>
//     // </div>

//     <div className="webrtc">
//   <h1>Voice Chat With Virtual Agent</h1>
  
//   {/* Image Section */}
//   <div className="image-container">
//     <img src="images/robo.jpg" alt="Voice Chat" />
//   </div>
  
//   {/* Call Controls */}
//   <div className="call-container">
//     <button id="startCall" className="btn" onClick={startCall} disabled={isCallConnected}>Start Call</button>
//     <button id="endCall" className="btn" onClick={endCall} disabled={!isCallConnected}>End Call</button>
//   </div>
  
//   {/* Audio Players */}
//   <div className="audio-players">
//     <audio ref={localAudioRef} autoPlay />
//     <audio ref={remoteAudioRef} autoPlay />
//   </div>
  
//   {/* Call Timer */}
//   <div className="timer">
//     {isRunning ? `Call Duration: ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` : ''}
//   </div>
// </div>

    
//   );
// };

// export default WebRTC;




