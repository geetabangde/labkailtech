import PropTypes from "prop-types";
import ReactSelect from "react-select";

export const Select = ({
  name,
  label,
  options,
  isMulti = false,
  onChange,
  value,
}) => {
  const getValue = () => {
    if (isMulti) {
      return options.filter((option) =>
        Array.isArray(value) ? value.includes(option.value) : false
      );
    } else {
      return options.find((option) => option.value === value) || null;
    }
  };

  const handleChange = (selected) => {
    if (isMulti) {
      // Return array of selected values like: ["val1", "val2"]
      const selectedValues = selected ? selected.map((item) => item.value) : [];
      onChange(selectedValues);
    } else {
      // Return single value like: "val1"
      onChange(selected ? selected.value : null);
    }
  };

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <ReactSelect
        name={name}
        options={options}
        isMulti={isMulti}
        onChange={handleChange}
        value={getValue()}
        classNamePrefix="react-select"
        className="react-select-container"
      />
    </div>
  );
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};
