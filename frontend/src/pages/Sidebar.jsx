import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const baseClass = 'px-3 py-2 rounded-md hover:bg-[#2c2c3a] transition-colors';
  const activeClass = 'text-yellow-300 font-bold bg-[#2c2c3a]';

  return (
    <div className="w-60 min-h-screen bg-[#1f1f2e] text-white p-6">
      <h1 className="text-xl font-bold mb-6">🎸 Guitara</h1>
      <nav className="flex flex-col gap-2 text-sm">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : 'text-white'}`
          }
        >
          🏠 Home
        </NavLink>

        <NavLink
          to="/metronome"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : 'text-white'}`
          }
        >
          🎵 Metronome
        </NavLink>

        <NavLink
          to="/tuner"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : 'text-white'}`
          }
        >
          🎸 Tuner
        </NavLink>

        <NavLink
          to="/rhythm-trainer"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : 'text-white'}`
          }
        >
          🥁 Rhythm Trainer
        </NavLink>

        <NavLink
          to="/mypage"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : 'text-white'}`
          }
        >
          👤 My Page
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
