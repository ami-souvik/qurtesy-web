import { forwardRef, useImperativeHandle, useState } from 'react';
import { Edit2, Plus, Save, Trash2, User, Users, X } from 'lucide-react';
import { Profile, UpdateProfile } from '../../types';
import { Button } from '../action/button';
import { sqlite } from '../../config';

export const Participants = forwardRef(function Participants(_props, ref) {
  const profiles = sqlite.profiles.get<Profile>();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
  const [newProfile, setNewProfile] = useState({ name: '', email: '', phone: '' });
  const [editProfile, setEditProfile] = useState<UpdateProfile>({ id: 0, name: '', email: '', phone: '' });

  const addParticipant = async () => {
    if (newProfile.name.trim()) {
      sqlite.profiles.create(newProfile);
      setNewProfile({ name: '', email: '', phone: '' });
      setIsCreatingProfile(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (editProfile.name?.trim()) {
      sqlite.profiles.update(editProfile);
      setEditingProfileId(null);
      setEditProfile({ id: 0, name: '', email: '', phone: '' });
    }
  };

  const handleDeleteProfile = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this participant? This action cannot be undone.')) {
      sqlite.profiles.delete(id);
    }
  };

  const startEditingProfile = (profile: Profile) => {
    setEditingProfileId(profile.id);
    setEditProfile({
      id: profile.id,
      name: profile.name,
      email: profile.email || '',
      phone: profile.phone || '',
    });
  };
  const handleAdd = () => {
    setIsCreatingProfile(true);
  };
  useImperativeHandle(ref, () => ({
    handleAdd,
  }));
  return (
    <div className="space-y-6">
      {/* Create Profile Form */}
      {isCreatingProfile && (
        <div className="glass-card rounded-lg p-6 border border-green-500/30">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-green-400" />
            Add New Participant
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
              <input
                type="text"
                placeholder="Full Name"
                value={newProfile.name}
                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={newProfile.email || ''}
                onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
              <input
                type="text"
                placeholder="+1 (555) 123-4567"
                value={newProfile.phone || ''}
                onChange={(e) => setNewProfile({ ...newProfile, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <Button onClick={addParticipant} leftIcon={<Save className="h-4 w-4" />}>
              Add Participant
            </Button>
            <Button variant="outline" onClick={() => setIsCreatingProfile(false)} leftIcon={<X className="h-4 w-4" />}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Participants List */}
      <div className="space-y-3">
        {profiles.length === 0 ? (
          <div className="glass-card rounded-lg p-8 text-center">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Participants Yet</h3>
            <p className="text-slate-400 mb-4">Add participants for split expenses and lending</p>
            <Button onClick={handleAdd} leftIcon={<Plus className="h-4 w-4" />}>
              Add Your First Participant
            </Button>
          </div>
        ) : (
          profiles.map((profile: Profile) => {
            const isEditing = editingProfileId === profile.id;
            return (
              <div
                key={profile.id}
                className="glass-card rounded-lg p-4 hover:bg-slate-800/60 transition-colors border border-slate-700/50"
              >
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                        <input
                          type="text"
                          value={editProfile.name || ''}
                          onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input
                          type="email"
                          value={editProfile.email || ''}
                          onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                        <input
                          type="text"
                          value={editProfile.phone || ''}
                          onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button onClick={handleUpdateProfile} leftIcon={<Save className="h-4 w-4" />}>
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingProfileId(null)}
                        leftIcon={<X className="h-4 w-4" />}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <User className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white flex items-center">
                          {profile.name}
                          {profile.is_self && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                              You
                            </span>
                          )}
                        </h3>
                        <div className="text-xs text-slate-400">
                          {profile.email && <p>Email: {profile.email}</p>}
                          {profile.phone && <p>Phone: {profile.phone}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingProfile(profile)}
                        className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Edit Participant"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {!profile.is_self && (
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Participant"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});
