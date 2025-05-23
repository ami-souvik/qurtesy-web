import { useState, useRef, useEffect } from 'react';
import wavEncoder from 'wav-encoder';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Mic, MicOff, Loader2, MessageSquare } from 'lucide-react';
import { queueTranscribe } from '../webservices/transcribes-ws';

const AudioRecorder = () => {
  const [transcripts, setTranscripts] = useState({});
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const db = getDatabase();
    const realdbRef = ref(db, 'transcribes');
    onValue(realdbRef, (snapshot) => {
      const data = snapshot.val();
      setTranscripts(data);
      setIsProcessing(false);
    });
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sampleRate = 16000; // Set sample rate to 16 kHz

      // Configure MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const wavBlob = await convertToWav(audioBlob, sampleRate);
        setAudioBlob(wavBlob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const transcribe = () => {
    if (audioBlob) {
      setIsProcessing(true);
      queueTranscribe(new File([audioBlob], 'audio.wav', { type: 'audio/wav' }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      transcribe();
    }
  };

  const convertToWav = async (audioBlob, sampleRate) => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await new AudioContext({ sampleRate }).decodeAudioData(arrayBuffer);

    const wavData = await wavEncoder.encode({
      sampleRate,
      channelData: [audioBuffer.getChannelData(0)], // Mono audio
    });

    return new Blob([wavData], { type: 'audio/wav' });
  };

  const toggleRecording = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  return (
    <div className="space-y-6">
      {/* Voice Recording Card */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Voice Assistant</span>
          </h2>
          {isProcessing && (
            <div className="flex items-center space-x-2 text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          )}
        </div>

        {/* Recording Button */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={toggleRecording}
            className={`
              relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105
              ${
                recording
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20'
                  : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/20'
              }
            `}
            disabled={isProcessing}
          >
            {recording ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}

            {recording && <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20"></div>}
          </button>

          <div className="text-center">
            {recording ? (
              <div className="flex items-center space-x-2 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording...</span>
              </div>
            ) : (
              <span className="text-sm text-slate-400">
                {isProcessing ? 'Processing audio...' : 'Tap to record transaction'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Transcription Results */}
      {transcripts && Object.keys(transcripts).length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-md font-medium text-white mb-4">Recent Transcriptions</h3>
          <div className="space-y-3 max-h-32 overflow-y-auto">
            {Object.keys(transcripts)
              .reverse()
              .slice(0, 3)
              .map((key: string) => (
                <div key={key} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                  <p className="text-sm text-slate-300">{transcripts[key]}</p>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {new Date(parseInt(key)).toLocaleTimeString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
