import './adminWidgets.scss';

import { Link } from 'react-router-dom';

import useFetch from '../../utils/service/useFetch.js';
import { getAllCount } from '../../utils/endpoints/get.js';

import Loader from '../shared/loader/Loader';
import { ADMIN_WIDGETS } from './adminwidgets.js';

const AdminWidgets = () => {
  const { data = {}, loading } = useFetch(getAllCount);

  return (
    <div className="widgets">
      <div className="admin-widgets">
        {ADMIN_WIDGETS.map(({ key, label, link, Icon, bg, color }) => (
          <div className="widget" key={key}>
            {loading ? (
              <Loader type="global" />
            ) : (
              <Link
                to={link}
                className="widget-link"
              >
                <div className="left-widget-container">
                  <Icon
                    className="icon"
                    style={{
                      backgroundColor: bg,
                      color,
                    }}
                  />
                </div>

                <div className="right-widget-container">
                  <h2>{data[key] ?? 0}</h2>
                  <h4>{label}</h4>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminWidgets;