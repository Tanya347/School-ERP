import React from 'react'
import { ClipLoader } from "react-spinners";
import './loader.scss'

const Loader = ({text, type}) => {
  return (
    <div className={type === "global" ? "page-loader" : "create-loader"}>
        <ClipLoader color="black" size={50} />
        {text}
    </div>
  )
}

export default Loader