import "./dropdown.scss";

const Dropdown = ({
  options = [],
  title,
  id = '',
  onChange,
  value = "",
  loading = false,
  getLabel
}) => {

  return (
    <div className="form-input">
      <label className='dropdown-label'>{title}</label>
      <select
        id={id}
        onChange={onChange}
        disabled={loading}
        value={value}
      >
        <option value="">-</option>
        {options?.map((opt, index) => (
          <option key={index} value={opt._id}>
            {getLabel ? getLabel(opt) : opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
