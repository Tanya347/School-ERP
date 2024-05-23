export const getDeleteURL = (path, id) => {
    return `${process.env.REACT_APP_API_URL}i/${path}/${id}`;
}