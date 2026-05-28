import { useState } from 'react';
import LoginScreen from './screens/LoginScreen.jsx';
import AnalystDashboard from './screens/AnalystDashboard.jsx';
import DataEntryForm from './screens/DataEntryForm.jsx';
import ComplianceReports from './screens/ComplianceReports.jsx';
import ExecutiveDashboard from './screens/ExecutiveDashboard.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';

const defaultScreen = {
  analyst: 'dashboard',
  'facility-manager': 'data-entry',
  csuo: 'executive',
};

const showSidebarOn = new Set(['dashboard', 'reports', 'executive']);

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [activeScreen, setActiveScreen] = useState(null);

  const handleAuthenticated = (role) => {
    setAuthenticated(true);
    setCurrentRole(role);
    setActiveScreen(defaultScreen[role]);
  };

  const handleRoleSwitch = (newRole) => {
    setCurrentRole(newRole);
    setActiveScreen(defaultScreen[newRole]);
  };

  if (!authenticated) {
    return <LoginScreen onAuthenticated={handleAuthenticated} />;
  }

  const hasSidebar = showSidebarOn.has(activeScreen);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar
        currentRole={currentRole}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        onRoleSwitch={handleRoleSwitch}
      />

      <div className="flex pt-16">
        {hasSidebar && (
          <Sidebar currentRole={currentRole} activeScreen={activeScreen} />
        )}

        <main
          className={`flex-1 p-6 min-h-[calc(100vh-4rem)] ${hasSidebar ? 'ml-60' : ''}`}
        >
          {activeScreen === 'dashboard' && <AnalystDashboard />}
          {activeScreen === 'data-entry' && <DataEntryForm />}
          {activeScreen === 'reports' && <ComplianceReports currentRole={currentRole} />}
          {activeScreen === 'executive' && <ExecutiveDashboard />}
        </main>
      </div>
    </div>
  );
}

export default App;
