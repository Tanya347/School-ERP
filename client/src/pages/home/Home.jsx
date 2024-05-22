import "./home.scss";

// calling all the components on the page
import Navbar from "../../components/navbar/Navbar";
import AdminNavbar from "../../components/navbar/AdminNavbar"
import FacultyButton from "../../components/buttons/FacultyButton"
import AdminWidgets from "../../components/adminWidgets/AdminWidgets";
import AdminButton from "../../components/buttons/AdminButton"
import Table from "../../components/table/UpdateTable";

// type specifies the admin side or user side 
const Home = ({ type }) => {

  return (
    <div className="home">
      <div className="AdminHomeContainer">
        {/* Navbar according to the type of user */}
        {(type === "Admin") ? (<AdminNavbar />) : (<Navbar />)}

        <div className="welcome">
          <img src="/Assets/brand.png" alt="" />
          <div className="text">
            <h1>Welcome to Edu-Sangam</h1>
            <p>Providing seamless navigation for your learning via our portal</p>
          </div>
        </div>

        {type==="Admin" && <div className="widgets">
          <AdminWidgets />
        </div>}


        <div className="mainContainer">

          {/* Latest Updates */}
          <div className="AdminListContainer">
            <div className="listTitle">Latest Notifications</div>
            <Table type="updates" />
          </div>

          {/* Shortcut Buttons */}
          {type === "Admin" ? (<div className="AdminButtons">
            <AdminButton />
          </div>) : (
            <div className="FacultyButtons">
              <FacultyButton />
            </div>
          )}

        </div>
        

        {/* <iframe src="https://drive.google.com/file/d/1O0i1yYkclXOuZ6xY_SAXjp5PsL0KFvJj/preview"
          width="800"
          height="400"
        /> */}

        {/* total revenue and charts */}
        {/* <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div> */}

      </div>
    </div>
  );
};

export default Home;
