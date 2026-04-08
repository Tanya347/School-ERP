import { useEffect, useState } from "react";
import axiosInterceptor from "../shared/axiosInterceptor"

const useFetch = (url, options = {}) => {
    const {enabled = true, showErrors = false} = options;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        if (!enabled || !url) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axiosInterceptor.get(url);
                setData(res.data.data);
            } catch (err) {
                setError(err);
                // Only log to console, let components handle their own error UI
                console.error('Fetch error:', err);
            }
            setLoading(false);
        };
        fetchData();
    }, [url, enabled]);

    const reFetch = async () => {
        setLoading(true);
        try {
            const res = await axiosInterceptor.get(url);
            setData(res.data);
        } catch (err) {
            setError(err);
            console.error('Fetch error:', err);
        }
        setLoading(false);
    };

    return { data, loading, error, reFetch };
};

export default useFetch;