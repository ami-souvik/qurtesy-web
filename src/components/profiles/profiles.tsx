import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Users, Plus, Edit2, Trash2, User, Check, X, AlertCircle } from 'lucide-react';
import { Profile, CreateProfile, UpdateProfile } from '../../types/daily-expenses';
import { Modal } from '../ui/modal';

export const Profiles = forwardRef(function Profiles(props, ref) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { getProfiles } = await import('../../webservices/daily-expenses-ws');
      const profileData = await getProfiles();
      setProfiles(profileData);
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
      setError('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingProfile(null);
    setError(null);
  };

  const handleAdd = () => {
    setEditingProfile(null);
    setIsModalOpen(true);
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    handleClose();
    fetchProfiles();
  };

  const handleDelete = async (profileId: number) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      try {
        const { deleteProfile } = await import('../../webservices/daily-expenses-ws');
        await deleteProfile(profileId);
        fetchProfiles();
      } catch (error) {
        console.error('Failed to delete profile:', error);
        setError('Failed to delete profile');
      }
    }
  };

  useImperativeHandle(ref, () => ({
    handleAdd,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-slate-400" />
          <h2 className="text-xl font-semibold text-white">Profiles</h2>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Profile</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Creation/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingProfile ? 'Edit Profile' : 'Create Profile'}
        size="md"
      >
        <ProfileForm profile={editingProfile} onSuccess={handleSuccess} onCancel={handleClose} />
      </Modal>

      {/* Profiles List */}
      <div className="flex-1 overflow-auto">
        {profiles.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <p>No profiles found</p>
              <p className="text-sm text-slate-500 mt-1">Create your first profile above</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="group bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg p-4 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white flex items-center">
                        {profile.name}
                        {profile.is_self && (
                          <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                      {profile.email && <p className="text-sm text-slate-400">{profile.email}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(profile)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                      title="Edit profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!profile.is_self && (
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                        title="Delete profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {profile.phone && <p className="text-sm text-slate-400 mb-2">{profile.phone}</p>}

                {profile.default_account && (
                  <div className="text-xs text-slate-500">Default Account: {profile.default_account.value}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

interface ProfileFormProps {
  profile?: Profile | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function ProfileForm({ profile, onSuccess, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    avatar_url: profile?.avatar_url || '',
    default_account_id: profile?.default_account?.id || '',
    is_self: profile?.is_self || false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (profile) {
        // Update existing profile
        const { updateProfile } = await import('../../webservices/daily-expenses-ws');
        const updateData: UpdateProfile = {
          name: formData.name.trim(),
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          avatar_url: formData.avatar_url || undefined,
          default_account_id: formData.default_account_id ? Number(formData.default_account_id) : undefined,
        };
        await updateProfile(profile.id, updateData);
      } else {
        // Create new profile
        const { createProfile } = await import('../../webservices/daily-expenses-ws');
        const createData: CreateProfile = {
          name: formData.name.trim(),
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          avatar_url: formData.avatar_url || undefined,
          default_account_id: formData.default_account_id ? Number(formData.default_account_id) : undefined,
          is_self: formData.is_self,
        };
        await createProfile(createData);
      }

      onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter profile name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter email address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter phone number"
        />
      </div>

      {!profile && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_self"
            checked={formData.is_self}
            onChange={(e) => setFormData({ ...formData, is_self: e.target.checked })}
            className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_self" className="text-sm text-slate-300">
            This is my profile
          </label>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>{profile ? 'Update' : 'Create'} Profile</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
