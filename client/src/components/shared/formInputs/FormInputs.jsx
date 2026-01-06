const FormInputs = ({
  inputs = [],
  values = {},
  errors = {},
  onChange,
}) => {
  return (
    <>
      {inputs.map((input) => (
        <div className="form-input" key={input.id}>
          <label>{input.label}</label>

          <input
            id={input.id}
            type={input.type}
            placeholder={input.placeholder}
            value={values[input.id] || ""}
            onChange={onChange}
            className={errors[input.id] ? "error-input" : ""}
          />

          {errors[input.id] && (
            <span className="error-message">{errors[input.id]}</span>
          )}
        </div>
      ))}
    </>
  );
};

export default FormInputs;
