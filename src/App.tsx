import Nav from "./components/nav/Nav"
import Banner from "./components/banner/Banner"
import About from "./components/about/About"
import Exp from "./components/exp/Experiencias"
import Projects from "./components/projects/Projects"
import Skills from "./components/skills/Skills"
import Contact from "./components/contact/Contact"
import Footer from "./components/footer/Footer"
import { useState } from "react"


function App() {
  const [dark, setDark] = useState(false)
  const toggleTheme = () => {
    setDark(!dark)
    document.body.classList.toggle('dark')
  }

  return (
    <div className="bg-white dark:bg-black pr-0 lg:px-60">
      <div className="" >
        <Nav toggleTheme={toggleTheme}/>
      </div>
      <div id="Home" className="">
        <Banner/>
      </div>
      <div id="About" className="">
        <About/>
      </div>
      <div id="Exp" className="">
        <Exp/>
      </div>
      <div id="Projects" className="">
        <Projects/>
      </div>
      <div id="Skills" className="">
        <Skills/>
      </div>
      <div id="Contact" className="">
        <Contact/>
      </div>
      <div className="">
        <Footer/>
      </div>
    </div>
  )
}

export default App
