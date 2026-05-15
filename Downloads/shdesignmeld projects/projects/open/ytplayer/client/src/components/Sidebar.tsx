import { Music2, Heart, Clock, ListMusic, PlusCircle, Radio } from 'lucide-react';

import { Link, useLocation } from 'react-router-dom';
import { usePlaylistStore } from '../store/usePlaylistStore';

const Sidebar = () => {
  const location = useLocation();
  const { playlists, createPlaylist } = usePlaylistStore();

  const isActive = (path: string) => location.pathname === path;

  const handleCreatePlaylist = () => {
    const name = prompt('Playlist name:');
    if (name?.trim()) createPlaylist(name.trim());
  };

  return (
    <aside
      className="hidden md:flex flex-col w-56 flex-shrink-0 h-full"
      style={{
        background: 'var(--bg)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--primary)' }}
        >
          <Music2 size={16} className="text-white" />
        </div>
        <span className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
          WaveTube
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-5 no-scrollbar">

        {/* Discover */}
        <div>
          <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-3)' }}>
            Discover
          </p>
          <div className="space-y-0.5">
            {[
              { icon: Radio, label: 'Browse', path: '/' },
            ].map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${isActive(path) ? 'active' : ''}`}
              >
                <Icon size={16} className={isActive(path) ? 'text-primary' : ''} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Library */}
        <div>
          <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-3)' }}>
            Library
          </p>
          <div className="space-y-0.5">
            <Link to="/library" className={`nav-link ${isActive('/library') ? 'active' : ''}`}>
              <Heart size={16} className={isActive('/library') ? 'text-primary' : ''} />
              Liked Songs
            </Link>
            <Link to="/recently-played" className={`nav-link ${isActive('/recently-played') ? 'active' : ''}`}>
              <Clock size={16} className={isActive('/recently-played') ? 'text-primary' : ''} />
              Recently Played
            </Link>

          </div>
        </div>

        {/* Playlists */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-3)' }}>
              Playlists
            </p>
            <button
              onClick={handleCreatePlaylist}
              className="w-5 h-5 flex items-center justify-center rounded transition-colors hover:text-white"
              style={{ color: 'var(--text-3)' }}
              title="New playlist"
            >
              <PlusCircle size={13} />
            </button>
          </div>
          <div className="space-y-0.5">
            {playlists.length === 0 ? (
              <button
                onClick={handleCreatePlaylist}
                className="w-full text-left px-3 py-2 rounded-lg text-[12px] transition-colors hover:text-white"
                style={{ color: 'var(--text-3)' }}
              >
                + Create a playlist
              </button>
            ) : (
              playlists.map(playlist => (
                <Link
                  key={playlist._id}
                  to={`/playlist/${playlist._id}`}
                  className={`nav-link ${isActive(`/playlist/${playlist._id}`) ? 'active' : ''}`}
                >
                  <ListMusic size={15} className={isActive(`/playlist/${playlist._id}`) ? 'text-primary' : ''} />
                  <span className="truncate">{playlist.name}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
