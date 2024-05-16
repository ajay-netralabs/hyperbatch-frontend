import './App.css'

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import WizardHome from './pages/wizard/WizardHome'
// import { CreateWizard, Dashboard } from './pages';
import ProjectHome from './pages/Projects/ProjectHome'
import { CreateProject, CreateVariable, CreateWizard, Dashboard, Login, NotFound, Signup, VariableHome } from './pages';

import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import NavbarLayout from './NavbarLayout'
import { Protected } from './components/Auth/Protected'

function App() {

  return (
    <MantineProvider>
    <>
          <ToastContainer position="top-center"
              autoClose={2000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route element={<Protected  children={<NavbarLayout />}/>} >
          <Route path="/" element={<Protected children={<Dashboard />} />} />
          <Route path="/jobs/create" element={<Protected children={<CreateWizard />}/>} />
          <Route path="/jobs" element={<Protected children={<WizardHome />}/>} />
          <Route path="/projects/create" element={<Protected children={<CreateProject />}/>} />
          <Route path="/projects" element={<Protected children={<ProjectHome />}/>} />
          <Route path="/variables" element={<Protected children={<VariableHome />}/>} />
          <Route path="/variables/create" element={<Protected children={<CreateVariable />} />} />
        </Route>
          <Route path="*" element={<NotFound />} />
      </Routes>
    </>
    </MantineProvider>
  )
}

export default App
