

export const putURLs = (path, id) => {
    return `${process.env.REACT_APP_API_URL}/${path}/${id}`;
}