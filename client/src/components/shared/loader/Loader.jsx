import './loader.scss'

import { ClipLoader } from "react-spinners";

const Loader = ({text, type}) => {
  return (
    <div className={type === "global" ? "page-loader" : "create-loader"}>
        <ClipLoader color="black" size={50} />
        {text}
    </div>
  )
}

export default Loader