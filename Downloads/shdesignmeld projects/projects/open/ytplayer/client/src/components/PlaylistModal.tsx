import { X, PlusCircle, Check, ListMusic } from 'lucide-react';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useState } from 'react';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackToAdd: any;
}

export const PlaylistModal = ({ isOpen, onClose, trackToAdd }: PlaylistModalProps) => {
  const { playlists, createPlaylist, addToPlaylist } = usePlaylistStore();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);

  if (!isOpen || !trackToAdd) return null;

  const handleCreate = async () => {
    if (!newPlaylistName.trim()) return;
    setCreating(true);
    await createPlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
    setCreating(false);
  };

  const handleAdd = async (playlistId: string) => {
    if (addedIds.has(playlistId)) return;
    await addToPlaylist(playlistId, trackToAdd);
    setAddedIds(prev => new Set([...prev, playlistId]));
    setTimeout(onClose, 700);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl overflow-hidden scale-in"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <ListMusic size={16} className="text-primary" />
            <h3 className="text-[15px] font-bold" style={{ color: 'var(--text-1)' }}>
              Add to Playlist
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
            style={{ color: 'var(--text-2)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Track preview */}
        <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <img
            src={trackToAdd.thumbnail}
            alt={trackToAdd.title}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <p
              className="text-[13px] font-semibold truncate"
              style={{ color: 'var(--text-1)' }}
              dangerouslySetInnerHTML={{ __html: trackToAdd.title }}
            />
            <p className="text-[11px] truncate" style={{ color: 'var(--text-2)' }}>
              {trackToAdd.artist}
            </p>
          </div>
        </div>

        {/* Playlist list */}
        <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
          {playlists.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <ListMusic size={28} style={{ color: 'var(--text-3)' }} />
              <p className="text-[13px]" style={{ color: 'var(--text-2)' }}>No playlists yet</p>
            </div>
          ) : (
            playlists.map(pl => (
              <button
                key={pl._id}
                onClick={() => handleAdd(pl._id)}
                className="w-full flex items-center justify-between px-5 py-3 transition-colors hover:bg-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--surface-3)' }}
                  >
                    <ListMusic size={14} style={{ color: 'var(--text-2)' }} />
                  </div>
                  <span
                    className="text-[13px] font-medium truncate"
                    style={{ color: 'var(--text-1)' }}
                  >
                    {pl.name}
                  </span>
                </div>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: addedIds.has(pl._id) ? 'var(--primary)' : 'var(--surface-3)',
                    border: `1px solid ${addedIds.has(pl._id) ? 'var(--primary)' : 'var(--border)'}`,
                  }}
                >
                  {addedIds.has(pl._id) && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Create new playlist */}
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="New playlist name…"
              className="flex-1 px-3 py-2 rounded-lg text-[13px] outline-none transition-all"
              style={{
                background: 'var(--surface-3)',
                border: '1px solid var(--border)',
                color: 'var(--text-1)',
                caretColor: 'var(--primary)',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(250,36,60,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
            <button
              onClick={handleCreate}
              disabled={!newPlaylistName.trim() || creating}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-all disabled:opacity-40"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              <PlusCircle size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
