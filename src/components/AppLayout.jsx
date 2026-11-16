import { Outlet } from 'react-router-dom'
import SidebarNav from './SidebarNav'
import TopBar from './TopBar'

function AppLayout() {
  return (
    <div className="app-layout">
      <SidebarNav />
      <main className="main-panel">
        <TopBar title="Panel principal" />
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
