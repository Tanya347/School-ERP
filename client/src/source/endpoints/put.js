
const api_url = "http://localhost:5500/api"

export const putURLs = (path, id) => {
    return `${api_url}/${path}/${id}`;
}