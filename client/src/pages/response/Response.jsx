import React, { useEffect, useState } from 'react'
import './response.css'
import Navbar from '../../components/navbar/Navbar'
import { AuthContext } from '../../config/context/AuthContext'
import { useContext } from 'react'
import useFetch from '../../config/hooks/useFetch'

const Response = () => {

  const {user} = useContext(AuthContext);  
  const queries = useFetch("/queries").data;
  const [query, setQuery] = useState([]);

  useEffect(() => {
    setQuery(queries.filter(item => item.author === user.name))
  }, [queries, user.name])


  return (
    <div className="response">
        <Navbar />
        <div className="queries-container">
                {
                  query.map((item) => (
                    <div className="query">
                      <div className="query-box">
                        <h2 className="qTitle">{item.title}</h2>
                        <h3 className='qTo'>To: {item.teacher}</h3>
                        <p className='qDesc'>{item.description}</p>
                      </div>
                      {item.response && <div className="response-box">
                        <h2>Response</h2>
                        <p className='rDesc'>{item.response}</p>
                      </div>}
                    </div>
                  ))
                }
        </div>
    </div>
  )
}

export default Response