import React from 'react'
import { ClipLoader } from "react-spinners";
import './loader.scss'

const Loader = ({text}) => {
  return (
    <div className={text ? "create-loader" : "page-loader"}>
        <ClipLoader color="black" size={50} />
        {text || "Loading data..."}
    </div>
  )
}

export default Loader