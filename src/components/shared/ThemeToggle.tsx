interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ dark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: dark ? '#1e293b' : '#f1f5f9',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
        borderRadius: '9999px',
        width: '2.25rem',
        height: '2.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
