import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const repos = [
  { name: 'Dnier', description: 'GitHub IDE in your browser', language: 'JavaScript', stars: 0, updated: 'just now', private: false },
  { name: 'NoriFX', description: 'Graphics and experiments', language: 'Java', stars: 0, updated: '2 days ago', private: true },
  { name: 'Tsents', description: 'Messaging project', language: 'TypeScript', stars: 0, updated: '5 days ago', private: false },
  { name: 'CatLua', description: 'Lua tooling', language: 'Lua', stars: 0, updated: '1 week ago', private: false },
]

const files = [
  { name: 'src', type: 'folder', meta: 'folder' },
  { name: 'public', type: 'folder', meta: 'folder' },
  { name: 'README.md', type: 'file', meta: 'markdown' },
  { name: 'package.json', type: 'file', meta: 'json' },
  { name: 'vite.config.js', type: 'file', meta: 'javascript' },
]

function App() {
  const [page, setPage] = useState('repositories')
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

  const filteredRepos = useMemo(() => repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase()) || repo.description.toLowerCase().includes(search.toLowerCase())
  ), [search])

  const openRepo = (repo) => {
    setSelectedRepo(repo)
    setPage('code')
    setMobileMenu(false)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => { setPage('repositories'); setSelectedRepo(null) }} aria-label="Dnier home">
          <span className="brand-mark">D</span><span>Dnier</span>
        </button>
        <div className="top-search">
          <span>⌕</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search repositories..." />
          <kbd>⌘ K</kbd>
        </div>
        <div className="top-actions">
          <button className="icon-button" title="Notifications">♢</button>
          <button className="avatar" title="Account">N</button>
          <button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)}>☰</button>
        </div>
      </header>

      <div className="layout">
        <aside className={`sidebar ${mobileMenu ? 'mobile-open' : ''}`}>
          <nav>
            <button className={page === 'repositories' ? 'nav-item active' : 'nav-item'} onClick={() => { setPage('repositories'); setSelectedRepo(null); setMobileMenu(false) }}>▣ <span>Repositories</span></button>
            <button className="nav-item" onClick={() => setPage('issues')}>◇ <span>Issues</span></button>
            <button className="nav-item" onClick={() => setPage('pulls')}>⑂ <span>Pull Requests</span></button>
            <button className="nav-item" onClick={() => setPage('actions')}>▷ <span>Actions</span></button>
          </nav>
          <div className="sidebar-section">
            <div className="section-title">FAVORITES <button>＋</button></div>
            {repos.slice(0, 3).map((repo) => <button className="favorite" key={repo.name} onClick={() => openRepo(repo)}>★ {repo.name}</button>)}
          </div>
          <div className="sidebar-bottom">
            <button className="nav-item">⚙ <span>Settings</span></button>
            <button className="nav-item">? <span>Help</span></button>
          </div>
        </aside>

        <main className="main">
          {page === 'repositories' && <Repositories repos={filteredRepos} onOpen={openRepo} search={search} />}
          {page === 'code' && <CodeView repo={selectedRepo} />}
          {page === 'issues' && <EmptyPage icon="◇" title="Issues" text="Issues will be available in the next Dnier version." />}
          {page === 'pulls' && <EmptyPage icon="⑂" title="Pull Requests" text="Pull Requests will be available in the next Dnier version." />}
          {page === 'actions' && <EmptyPage icon="▷" title="Actions" text="GitHub Actions will be available in the next Dnier version." />}
        </main>
      </div>
    </div>
  )
}

function Repositories({ repos: list, onOpen, search }) {
  return <div className="content">
    <div className="page-heading">
      <div><p className="eyebrow">GITHUB WORKSPACE</p><h1>Your repositories</h1><p className="muted">Manage your code without the GitHub clutter.</p></div>
      <button className="primary">＋ New repository</button>
    </div>
    <div className="toolbar"><span className="count">{list.length} repositories</span><button className="filter">All ▾</button><button className="filter">Updated ▾</button></div>
    <div className="repo-grid">
      {list.map((repo) => <button className="repo-card" key={repo.name} onClick={() => onOpen(repo)}>
        <div className="repo-card-top"><span className="repo-icon">{repo.private ? '🔒' : '◈'}</span><span className="repo-name">{repo.name}</span><span className="chevron">›</span></div>
        <p>{repo.description}</p>
        <div className="repo-meta"><span><i className={`dot ${repo.language.toLowerCase()}`}></i>{repo.language}</span><span>★ {repo.stars}</span><span>{repo.updated}</span></div>
      </button>)}
      {!list.length && <div className="empty-search">No repositories found for “{search}”.</div>}
    </div>
  </div>
}

function CodeView({ repo }) {
  return <div className="code-page">
    <div className="repo-header">
      <div><button className="back">‹ Repositories</button><h1>{repo?.name || 'Repository'} <span className="visibility">{repo?.private ? 'Private' : 'Public'}</span></h1><p className="muted">{repo?.description}</p></div>
      <div className="repo-actions"><button>↓ Download</button><button>＋ New</button></div>
    </div>
    <div className="repo-tabs"><button className="tab active">Code</button><button className="tab">Branches</button><button className="tab">Commits</button><button className="tab">Settings</button></div>
    <div className="code-layout">
      <section className="file-panel">
        <div className="file-toolbar"><button className="branch">main ▾</button><button>＋</button></div>
        <div className="breadcrumbs">{repo?.name} /</div>
        {files.map((file) => <button className="file-row" key={file.name}><span>{file.type === 'folder' ? '▰' : '□'}</span><strong>{file.name}</strong><small>{file.meta}</small></button>)}
      </section>
      <section className="welcome-editor">
        <div className="editor-top"><span>README.md</span><span>Markdown</span></div>
        <div className="editor-body"><span className="line">1</span><div><span className="hash">#</span> Welcome to <strong>{repo?.name}</strong><br/><br/><span className="comment">This is where the Dnier editor will open files.</span><br/><br/><button className="edit-button">✎ Edit file</button></div></div>
      </section>
    </div>
  </div>
}

function EmptyPage({ icon, title, text }) {
  return <div className="empty-page"><div className="empty-icon">{icon}</div><h1>{title}</h1><p>{text}</p></div>
}

createRoot(document.getElementById('root')).render(<App />)
