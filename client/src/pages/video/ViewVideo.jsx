import React, { useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
// import "./searchPage.css";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useFetch from "../../hooks/useFetch.js";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";
import "./viewVideo.scss"
import Navbar from "../../components/navbar/Navbar.jsx";

function StuVideo() {
    const { user } = useContext(AuthContext)
    console.log(user.class);
  const [querys, setquerys] = useState("");
  const { data, loading } = useFetch(`/video/student/${user.class}`);
  console.log(data);

  const keys = ["topic"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(querys))
    );
  };

  // useEffect(() => {
  //   Aos.init({duration: 1000});
  // },[])

  return (
    <div className="viewVideoContainer">

      <Navbar />
    <div className="searchContainer">

      <div className="search">
        <div className="searchBar">
          <h2>Search Videos</h2>
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setquerys(e.target.value)}
              />
              <SearchIcon className="icon" />
            {/* <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} /> */}
          </div>
        </div>
      </div>

      <div className="searchedVideos">
        {loading ? (
          <>
            <div className="p" style={{color: "white", "fontFamily": "'Kaushan Script', cursive"}}>Loading...</div>
          </>
        ) : (
          <>
            {search(data).map((item, i) => (
              <div className="card" key={i} data-aos="fade-up">
                <div class="content">
                  <iframe height="200" src={item.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                  <h3>{item.topic}</h3>
                  <p>{item.subject.name}</p>
                </div>
              </div>
            ))}
          </>
        )}
        </div>
      </div>
    </div>
  );
}

export default StuVideo;