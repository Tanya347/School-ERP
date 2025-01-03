import React from 'react';
import useFetch from '../../config/service/useFetch';
import "./dropdown.scss"

const Dropdown = ({
    url = null,
    options = [],
    title,
    id = '',
    onChange,
}) => {

    const { data: dynamicOptions = [] } = useFetch(url || '');

    const renderedOptions = url
    ? dynamicOptions.map((item) => ({
        value: item._id, // Assuming the data has `_id` as value
        label: item.name, // Assuming the data has `name` as label
      }))
    : options;

    return (
        <div className="formInput">
            <label>{title}</label>
            <select id={id} onChange={onChange}>
            <option value="">-</option>
                {renderedOptions.map((opt, index) => (
                    <option key={index} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Dropdown