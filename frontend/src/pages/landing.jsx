import React from 'react'
import "../App.css"
import { Link } from 'react-router-dom'
export default function LandingPage(){
    return (
        <div className='landingPageContainer'> 
        <nav>
            <div className ='navHeader'>
                <div className='callioLogo'>
                    <span>C</span>
                </div>
                <h2>CALLIO</h2>
            </div>
            <div className ='navlist'>
                <p>Join as Guest</p>
                <p>Register</p>
                <div role='button'>
                    <p className='navBtn'>Login</p>
                </div>

            </div>
        </nav>

        <div className="landingMainContainer">

  {/* <div className="left">
    <img src="/left.png" alt="" className="leftImage" />
  </div> */}

  <div className="center">
    <h1 className='centercontent'>
      Where <span style={{ color: "#63b9e7" }}>conversations</span>
    </h1>
    <h1 className="tagline">come alive.</h1>

    <p>Talk like you're there!</p>
    <div role="button">
        <Link to={"/auth"} className='center-btn'>Get Started</Link>
    </div>
  </div>

  {/* <div className="right">
    <img src="/right.png" alt="" className="rightImage" />
  </div><div className="right"> */}
    {/* <img src="/right.png" alt="" className="rightImage" />
  </div> */}

</div>
        </div>
    )
}