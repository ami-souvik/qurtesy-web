import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { setBaseUrl } from '../../slices/state-slice';
import { Icon } from '../ui/icon';

type ServerConfigFormData = {
  serverUrl: string;
};

// Server configuration component
export const ServerConfigForm = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<ServerConfigFormData>();
  const onSubmit = async ({ serverUrl }: ServerConfigFormData) => {
    dispatch(setBaseUrl(serverUrl));
  };

  return (
    <div className="h-screen flex flex-col gap-y-6 items-center justify-center">
      <div>
        <Icon className="h-16 w-16" />
        <p className="text-md text-center">qurtesy</p>
      </div>
      <div className="mx-4 p-4 glass-card rounded-lg shadow-md">
        <h2 className="text-xl mt-2 mb-4 text-center">Server Configuration</h2>
        <form>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Server URL</label>
              <input
                type="url"
                {...register('serverUrl')}
                placeholder="https://api.example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">Enter the base URL of your server (with or without https://)</p>
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set Server URL
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p className="font-medium mb-1">Examples:</p>
          <ul className="space-y-1 text-xs">
            <li>• https://api.myserver.com</li>
            <li>• http://localhost:3000</li>
            <li>• myserver.herokuapp.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
