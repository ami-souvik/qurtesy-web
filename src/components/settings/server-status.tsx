import { useDispatch, useSelector } from 'react-redux';
import { setBaseUrl } from '../../slices/state-slice';
import { RootState } from '../../store.types';
import { Settings } from 'lucide-react';

// Server status component
export const ServerStatus = () => {
  const baseUrl = useSelector(({ state }: RootState) => state.baseUrl);
  const dispatch = useDispatch();

  if (!baseUrl) {
    return null;
  }

  return (
    <div className="glass-card mx-auto mt-8 p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-6 w-6 text-blue-400" />
        <h2 className="font-semibold text-white">Server Configuration</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-slate-300">Server URL:</label>
          <p className="glass-input rounded p-2 text-white">{baseUrl}</p>
        </div>
      </div>

      <button
        onClick={() => dispatch(setBaseUrl(''))}
        className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Clear Configuration
      </button>

      <div className="mt-4 p-3 bg-orange-500/20 rounded text-sm">
        <p>
          <strong>Note:</strong> Your webservices will now use this URL as the base URL for all API calls.
        </p>
      </div>
    </div>
  );
};
