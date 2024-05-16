export const getDeleteURL = (path, id) => {
    console.log(path)
    console.log(id)
    if (path==='facVideo'){
        return `http://localhost:5500/api/video/${id}`
    }
    else
        return `http://localhost:5500/api/${path}/${id}`;
}