interface SidebarItem {
  key: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  items: SidebarItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  bottomItems?: SidebarItem[];
}

export default function Sidebar({ items, activeKey, onSelect, bottomItems }: SidebarProps) {
  const renderItem = (item: SidebarItem) => {
    const isActive = item.key === activeKey;
    return (
      <button
        key={item.key}
        onClick={() => onSelect(item.key)}
        title={item.label}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.625rem 0.5rem',
          borderRadius: '0.75rem',
          border: 'none',
          background: isActive ? '#16a34a' : 'transparent',
          color: isActive ? 'white' : 'var(--text-muted)',
          cursor: 'pointer',
          width: '100%',
          transition: 'all 0.15s',
          fontSize: '1.1rem',
        }}
      >
        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{item.icon}</span>
        <span style={{ fontSize: '0.6rem', fontWeight: 600, lineHeight: 1 }}>{item.label}</span>
      </button>
    );
  };

  return (
    <aside
      style={{
        width: '64px',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.75rem 0.375rem',
        gap: '0.25rem',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {items.map(renderItem)}
      {bottomItems && (
        <>
          <div style={{ flex: 1 }} />
          {bottomItems.map(renderItem)}
        </>
      )}
    </aside>
  );
}
