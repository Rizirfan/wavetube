import { Home, Heart, ListMusic } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const { pathname } = useLocation();

  const links = [
    { icon: Home,      label: 'Home',      path: '/' },
    { icon: Heart,     label: 'Liked',     path: '/library' },
    { icon: ListMusic, label: 'Playlists', path: '/playlists' },
  ];

  return (
    <nav
      className="fixed bottom-[var(--player-h)] left-0 w-full z-40 flex md:hidden"
      style={{
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {links.map(({ icon: Icon, label, path }) => {
        const active = pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors"
            style={{ color: active ? 'var(--primary)' : 'var(--text-3)' }}
          >
            <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
