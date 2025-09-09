import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import API from './pages/API'
import PromptDetail from './pages/PromptDetail'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/api" element={<API />} />
        <Route path="/prompt/:name" element={<PromptDetail />} />
      </Routes>
    </Layout>
  )
}

export default App
