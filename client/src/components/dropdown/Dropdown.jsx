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

    const renderedOptions = url ? dynamicOptions : options;

    return (
        <div className="formInput">
            <label>{title}</label>
            <select id={id} onChange={onChange}>
            <option value="">-</option>
                {renderedOptions.map((opt, index) => (
                    <option key={index} value={opt._id}>
                        {opt.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Dropdown