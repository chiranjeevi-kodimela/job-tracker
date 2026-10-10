import { useId } from "react";
function Field({ label, as: Control = "input", hint, children, ...props }) {
  const id = useId();

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Control id={id} {...props}>
        {children}
      </Control>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export default Field;
