import "./dropdown.scss";

import useFetch from '../../../config/service/useFetch';

const Dropdown = ({
  url,
  options = [],
  title,
  id = '',
  onChange,
  value = ""
}) => {

  const { data: dynamicOptions = [], loading } = useFetch(url, {
    enabled: !!url
  });

  const renderedOptions = url ? dynamicOptions : options;

  return (
    <div className="form-input">
      <label className='dropdown-label'>{title}</label>
      <select
        id={id}
        onChange={onChange}
        disabled={loading}
        value={value}
      >
        <option value="">
          {loading ? 'Loading...' : '-'}
        </option>
        {renderedOptions?.map((opt, index) => (
          <option key={index} value={opt._id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
