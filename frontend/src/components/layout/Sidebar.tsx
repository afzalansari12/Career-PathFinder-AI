export default function Sidebar() {
    return (
      <aside className="w-64 border-r min-h-screen p-6">
        <h2 className="text-2xl font-bold">CareerPath AI</h2>
  
        <nav className="mt-8 space-y-4">
          <a href="/dashboard" className="block hover:text-blue-600">
            Dashboard
          </a>
  
          <a href="/upload" className="block hover:text-blue-600">
            Resume
          </a>
  
          <a href="/roadmap" className="block hover:text-blue-600">
            Roadmap
          </a>
  
          <a href="/jobs" className="block hover:text-blue-600">
            Jobs
          </a>
  
          <a href="/interview" className="block hover:text-blue-600">
            Interview
          </a>
  
          <a href="/profile" className="block hover:text-blue-600">
            Profile
          </a>
        </nav>
      </aside>
    );
  }