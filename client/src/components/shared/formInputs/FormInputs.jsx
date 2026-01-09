const FormInputs = ({
  inputs = [],
  values = {},
  errors = {},
  onChange,
  role = "",
}) => {

  const hasEditAccess = (role, input) => {
    // Never show
    if (input.editAccess === "null") return false;

    // Admin-only fields
    if (input.editAccess === "admin" && role !== "admin") return false;

    return true;
  };

  return (
    <>
      {inputs.map((input) =>
        hasEditAccess(role, input) ? (
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
        ) : null
      )}
    </>
  );
};

export default FormInputs;
