import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import ExperienceList from './ExperienceList'
import ExperienceForm from './ExperienceForm'
import ProjectList from './ProjectList'
import ProjectForm from './ProjectForm'

const AdminLayout = () => {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-lg transition-colors ${
      isActive ? 'bg-accent text-bg' : 'text-body hover:text-accent'
    }`

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-muted/10 p-6 flex flex-col">
        <h1 className="font-heading text-xl font-bold text-heading mb-8">
          Admin<span className="text-accent">.</span>
        </h1>
        <nav className="flex flex-col gap-2 flex-1">
          <NavLink to="/admin/experiences" className={linkClass}>Experiences</NavLink>
          <NavLink to="/admin/projects" className={linkClass}>Projects</NavLink>
        </nav>
        <div className="space-y-2">
          <a href="/" className="block text-sm text-muted hover:text-accent transition-colors">
            &larr; View Portfolio
          </a>
          <button onClick={logout} className="text-sm text-red-400 hover:text-red-300 transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route index element={
            <div className="text-heading">
              <h2 className="font-heading text-2xl font-bold mb-4">Dashboard</h2>
              <p className="text-body">Select a section from the sidebar to manage your portfolio content.</p>
            </div>
          } />
          <Route path="experiences" element={<ExperienceList />} />
          <Route path="experiences/new" element={<ExperienceForm />} />
          <Route path="experiences/:id/edit" element={<ExperienceForm />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id/edit" element={<ProjectForm />} />
        </Routes>
      </main>
    </div>
  )
}

export default AdminLayout
