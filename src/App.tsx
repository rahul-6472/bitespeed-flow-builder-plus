import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ReactFlowProvider } from 'reactflow'

import FlowCanvas from './features/FlowCanvas'


export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
      <ToastContainer position="top-right" autoClose={3000}/>
    </ReactFlowProvider>
  )
}
