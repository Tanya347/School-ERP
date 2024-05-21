export const getDeleteURL = (path, id) => {

    if (path==='facVideo'){
        return `http://localhost:5500/api/video/${id}`
    }
    else if (path==='facTests'){
        return `http://localhost:5500/api/tests/${id}`
    }

    else if (path==='facTasks'){
        return `http://localhost:5500/api/tasks/${id}`
    }

    else
        return `http://localhost:5500/api/${path}/${id}`;
}