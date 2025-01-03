import "./home.scss";

// calling all the components on the page
import FacultyButton from "../../components/buttons/FacultyButton"
import AdminWidgets from "../../components/adminWidgets/AdminWidgets";
import AdminButton from "../../components/buttons/AdminButton"
import useFetch from "../../config/service/useFetch";
import { getTableURL } from "../../config/endpoints/get";
import { useAuth } from "../../config/context/AuthContext";
import GenericTable from "../../components/table/Table";
import { updateColumns } from "../../config/tableSource/updateColumns";

// type specifies the admin side or user side 
const Home = ({ type }) => {

  const {user} = useAuth();
  const { data } = useFetch(getTableURL(user));

  

  return (
    <div className="home">
      <div className="AdminHomeContainer">
        {/* Navbar according to the type of user */}

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
            <GenericTable columns={updateColumns} rows = {data} rowKey="id" isScrollable={true}/>
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
      </div>
    </div>
  );
};

export default Home;
