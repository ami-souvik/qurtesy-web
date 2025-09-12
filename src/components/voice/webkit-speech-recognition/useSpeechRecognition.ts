export const useSpeechRecognition = () => {
  return {
    interimTranscript: '',
    finalTranscript: '',
    transcript: '',
    listening: false,
    resetTranscript: () => {},
    browserSupportsSpeechRecognition: false,
  };
};
