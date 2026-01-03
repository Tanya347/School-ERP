import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../../store/slices/notificationSlice";

const NotificationsListener = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    dispatch(fetchNotifications(user));

    // Poll every 2 minutes
    const interval = setInterval(() => {
      dispatch(fetchNotifications(user));
    }, 1 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [user, dispatch]);

  return null;
};

export default NotificationsListener;
