import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const useFetch = (url, options = {}) => {
    const {enabled = true} = options;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        if (!enabled || !url) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                // Add a 5 minute (300000 ms) delay for debugging
                // await new Promise(resolve => setTimeout(resolve, 300000));
                const res = await axios.get(`${process.env.REACT_APP_API_URL}${url}`);
                setData(res.data.data);
            } catch (err) {
                setError(err);
                toast.error(
                    <div>
                        <strong>Fetch Failed</strong>
                        <div>{err.response?.data?.message || err.message || 'Unknown error'}</div>
                    </div>
                );
            }
            setLoading(false);
        };
        fetchData();
    }, [url]);

    const reFetch = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}${url}`);
            setData(res.data);
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { data, loading, error, reFetch };
};

export default useFetch;