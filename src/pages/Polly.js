// import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";
// import Predictions from "@aws-amplify/predictions";
// import { Container, Header } from "semantic-ui-react";
// import {
//   faCircleStop,
//   faMicrophone,
//   faUser,
//   faXmarkCircle,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Amplify, { API } from "aws-amplify";
// import React, { useState } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
// import {
//   VerticalTimeline,
//   VerticalTimelineElement,
// } from "react-vertical-timeline-component";
// import "react-vertical-timeline-component/style.min.css";
// import ch from "./ch.png";
// import "./Polly.css";
// import chatgpt_logo from "./chatgpt_logo.webp";




// Amplify.addPluggable(new AmazonAIPredictionsProvider());

// function Polly({ user, username }) {
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   const [timelines, setTimelines] = useState([]);
//   const [lineColor, setLineColor] = useState("#21223C");
//   const [isListening, setIsListening] = useState(false);

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   const startListening = () => {
//     setIsListening(true);
//     SpeechRecognition.startListening({ continuous: true });
//   };

//   const reset = () => {
//     setIsListening(false);
//     stopListening();
//   };

//   const stopListening = async () => {
//     await SpeechRecognition.stopListening();

//     setIsListening(false);

//     if (!transcript) {
//       resetTranscript();
//       return;
//     }

//     setTimelines((prevTimelines) => [
//       ...prevTimelines,
//       <VerticalTimelineElement
//         className="vertical-timeline-element--work speaker"
//         iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
//         icon={
//           username === "ch" ? (
//             <img src={ch} alt="User logo" />
//           ) : (
//             <FontAwesomeIcon icon={faUser} />
//           )
//         }
//       >
//         <div>{transcript.slice()}</div>
//       </VerticalTimelineElement>,
//     ]);

//     setLineColor("white");

//     const completion = await API.post("lambdaapi", "/items", {
//       body: {
//           input: {
//               question: transcript,
//           },
//       },
//   });
  

//     resetTranscript();

//     setTimelines((prevTimelines) => [
//       ...prevTimelines,
//       <VerticalTimelineElement
//         className="vertical-timeline-element--work bot"
//         iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
//         icon={
//           <picture>
//             <img src={chatgpt_logo} alt="chatgpt_logo" />
//           </picture>
//         }
//       >
//         <div>{completion.Answer}</div>
//       </VerticalTimelineElement>,
//     ]);

//     const result = await Predictions.convert({
//       textToSpeech: {
//         source: {
//           text: completion.Answer,
//         },
//         voiceId: "Joanna",
//       },
//     });

//     let AudioContext = window.AudioContext || window.webkitAudioContext;
//     console.log({ AudioContext });
//     const audioCtx = new AudioContext();
//     const source = audioCtx.createBufferSource();

//     audioCtx.decodeAudioData(result.audioStream, (buffer) => {
//       source.buffer = buffer;
//       source.connect(audioCtx.destination);
//       source.start(0);
//     });

//     document.addEventListener("touchend", () => AudioContext.resume());
//   };

//   return (
//     <div className="Polly">
//       <Header>
//         <Container className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
//           <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
//             <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
//               Welcome {username}
//             </span>
//             <div>
//               {!isListening ? (
//                 <FontAwesomeIcon
//                   icon={faMicrophone}
//                   className={`mic-off ${listening ? " listening" : ""}`}
//                   onClick={startListening}
//                 />
//               ) : null}
//               {isListening ? (
//                 <FontAwesomeIcon
//                   icon={faCircleStop}
//                   className={`stop ${listening ? " listening" : ""}`}
//                   onClick={stopListening}
//                 />
//               ) : null}
//               {isListening ? (
//                 <FontAwesomeIcon
//                   icon={faXmarkCircle}
//                   className={`cancel ${listening ? " listening" : ""}`}
//                   onClick={reset}
//                 />
//               ) : null}
//             </div>
//           </div>
//         </Container>
//       </Header>
//       <div style={styles.container}></div>
//       <VerticalTimeline lineColor={lineColor}>
//         {timelines.map((timeline, i) => {
//           return timeline;
//         })}
//       </VerticalTimeline>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     width: 400,
//     margin: "0 auto",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     padding: 20,
//   },
//   todo: { marginBottom: 15 },
//   input: {
//     border: "none",
//     backgroundColor: "#ddd",
//     marginBottom: 10,
//     padding: 8,
//     fontSize: 18,
//   },
//   todoName: { fontSize: 20, fontWeight: "bold" },
//   todoDescription: { marginBottom: 0 },
//   button: {
//     backgroundColor: "black",
//     color: "white",
//     outline: "none",
//     fontSize: 18,
//     padding: "12px 0px",
//   },
// };

// export default Polly;
