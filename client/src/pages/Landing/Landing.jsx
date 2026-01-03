import "./Landing.css"

import { Link } from 'react-router-dom'

const Landing = () => {

  return (
    
    <div className="landing-container">
      {/* <img src="/Assets/brand.png" alt="" style={{height: "100px"}} /> */}
      <h1>Edu-Sangam</h1>
      <img src="/Assets/landing.jfif" alt="" />
      <div className="button-container">
        
        <div className="not-admin">
        <Link to="/studentLogin">
          <button>Login as Student</button>
        </Link>
        
        <Link to="/facultyLogin">
          <button>Login as Faculty</button>
        </Link>
        </div>
        <div className="is-admin">
          <Link to="/adminLogin">
            <button>Login as Admin</button>
          </Link>
        </div>
        <div className="is-admin">
          <Link to="/registerSchool">
            <button>Register School</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Landing