import { useState, useEffect, useRef } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import SpeechRecognition, { useSpeechRecognition } from './webkit-speech-recognition';
import AiAgentIcon from '../../assets/ai-agent-dark.mp4';

const Transcript = ({ transcript }: { transcript: string }) => {
  const transcriptEndRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);
  return (
    <div className="p-6">
      <p>Hey Jarvis,</p>
      <div className="h-24 overflow-y-scroll">
        <p className="text-2xl font-bold">{transcript}</p>
        <div ref={transcriptEndRef} />
      </div>
    </div>
  );
};

const Assistant = () => {
  const video = useRef<HTMLVideoElement>(null);
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const {
    // interimTranscript,
    // finalTranscript,
    transcript,
    listening,
    resetTranscript,
    // browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening) video.current?.pause();
    else video.current?.play();
  }, [listening]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10); // Small delay for smooth animation
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 200); // Wait for animation to complete
    }
  }, [show]);

  const resetListening = () => {
    SpeechRecognition.startListening({ continuous: true });
    setTimeout(() => {
      SpeechRecognition.stopListening();
    }, 60000);
  };

  const handleClose = () => {
    resetTranscript();
    setShow(false);
  };
  const openJarvis = () => {
    resetTranscript();
    setShow(true);
  };

  useEffect(() => {
    resetListening();
  }, []);

  const processCommand = (command: string) => {
    console.log('Process command: ', command);
  };

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (transcript && transcript?.toLowerCase().includes('jarvis') && !show) openJarvis();
    if (transcript) {
      setTimeoutId(
        setTimeout(() => {
          if (show) processCommand(transcript);
          resetTranscript();
        }, 2000)
      );
    }
  }, [transcript]);
  // console.log(listening);
  // console.log(interimTranscript);
  // console.log(finalTranscript);
  // console.log(transcript);

  return (
    <>
      {isVisible && (
        <div
          className={`h-screen w-screen fixed overflow-hidden inset-0 flex items-center justify-center z-50 sm:p-4 transition-all duration-200 ${
            isAnimating ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'
          }`}
          onClick={handleClose}
        >
          <div
            className={`w-9/10 h-140 bg-black rounded-2xl transition-all duration-200 transform ${
              isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Transcript transcript={transcript} />
            <div className="h-80 overflow-hidden">
              <video loop autoPlay muted className="h-110 transform -translate-y-12 object-cover">
                <source src={AiAgentIcon} />
              </video>
            </div>
          </div>
        </div>
      )}
      <div className="relative w-[37px] h-[37px] overflow-hidden rounded-xl bg-black" onClick={openJarvis}>
        <video loop autoPlay muted ref={video} className="absolute top-[3px] h-9 object-cover">
          <source src={AiAgentIcon} />
        </video>
      </div>
      {/* {!browserSupportsSpeechRecognition && <div className='relative'>
        <p className='absolute -bottom-12 right-0 w-99 text-xs text-right'>Your browser does not support speech recognition</p>
      </div>} */}
    </>
  );
};

export default Assistant;
