import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Input, Select } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function EditSubcategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    type: "",
    instrumenttype: "",
    name: "",
    hsn: "",
    critical: "0",
    unit: "",
    expiry: "",
    reorder: "",
    min: "",
    tax: "",
    cost: "",
  });

  // Error and touched states for required fields
  const [errors, setErrors] = useState({
    category: "",
    type: "",
    name: "",
    unit: "",
    reorder: "",
    min: "",
    tax: "",
    cost: "",
  });

  const [touched, setTouched] = useState({
    category: false,
    type: false,
    name: false,
    unit: false,
    reorder: false,
    min: false,
    tax: false,
    cost: false,
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [instrumentTypeOptions, setInstrumentTypeOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [cat, typ, inst, unit, tax] = await Promise.all([
          axios.get("/inventory/category-list"),
          axios.get("/get-type"),
          axios.get("/get-instrument-type"),
          axios.get("/master/units-list"),
          axios.get("/master/get-taxslab-list"),
        ]);

        setCategoryOptions(cat.data.data || []);
        setTypeOptions(typ.data.data || []);
        setInstrumentTypeOptions(inst.data.data || []);
        setUnitOptions(unit.data.data || []);
        setTaxOptions(tax.data.data || []);

        const response = await axios.get(`/inventory/subcategory-byid/${id}`);
        const result = response.data;

        if (result.status === "true" && result.data) {
          setFormData({
            category: result.data.category?.toString() || "",
            type: result.data.type?.toString() || "",
            instrumenttype: result.data.instrumenttype?.toString() || "",
            name: result.data.name || "",
            hsn: result.data.hsn || "",
            critical: result.data.critical?.toString() || "0",
            unit: result.data.unit?.toString() || "",
            expiry: result.data.expiry?.toString() || "",
            reorder: result.data.reorder?.toString() || "",
            min: result.data.min?.toString() || "",
            tax: result.data.tax?.toString() || "",
            cost: result.data.cost?.toString() || "",
          });
        } else {
          toast.error(result.message || "Failed to load subcategory data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changed: ${name} => ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing/selecting
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle field blur to show validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    validateField(name, value);
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    let error = "";
    
    // Check if field is required
    const requiredFields = ['category', 'type', 'name', 'unit', 'reorder', 'min', 'tax', 'cost'];
    
    if (requiredFields.includes(fieldName)) {
      if (!value || value.toString().trim() === "") {
        error = "This field is required";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));

    return error === "";
  };

  // Validate all required fields
  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};
    let isValid = true;

    const requiredFields = [
      { field: 'category', label: 'Category' },
      { field: 'type', label: 'Type' },
      { field: 'name', label: 'Name' },
      { field: 'unit', label: 'Unit' },
      { field: 'reorder', label: 'Reorder Level' },
      { field: 'min', label: 'Min Level' },
      { field: 'tax', label: 'Tax Slab' },
      { field: 'cost', label: 'Cost' },
    ];

    requiredFields.forEach(({ field }) => {
      newTouched[field] = true;
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(newTouched);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    console.log("🔍 Sending form data:", formData);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          form.append(key, value);
        }
      });

      console.log("📦 Final payload:", Array.from(form.entries()));

      const response = await axios.post(
        `/inventory/subcategory-update/${id}`,
        form,
      );
      const result = response.data;

      if (result.status === "true") {
        toast.success("Subcategory updated successfully ✅");
        navigate("/dashboards/inventory/subcategories");
      } else {
        toast.error(result.message || "Update failed ❌");
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Error during update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Edit Subcategory">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Subcategory</h2>
          <Button
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => navigate("/dashboards/inventory/subcategories")}
          >
            Back
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Subcategory Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name && touched.name ? "border-red-500" : ""}
            />
            {errors.name && touched.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              label="HSN"
              name="hsn"
              value={formData.hsn}
              onChange={handleChange}
            />
          </div>

          <div>
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.category && touched.category ? "border-red-500" : ""}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            {errors.category && touched.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.type && touched.type ? "border-red-500" : ""}
            >
              <option value="">Select Type</option>
              {typeOptions.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
            {errors.type && touched.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>

          <div>
            <Select
              label="Instrument Type"
              name="instrumenttype"
              value={formData.instrumenttype}
              onChange={handleChange}
            >
              <option value="">Select Instrument Type</option>
              {instrumentTypeOptions.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Select
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.unit && touched.unit ? "border-red-500" : ""}
            >
              <option value="">Select Unit</option>
              {unitOptions.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
            {errors.unit && touched.unit && (
              <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
            )}
          </div>

          <div>
            <Select
              label="Tax Slab"
              name="tax"
              value={formData.tax}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.tax && touched.tax ? "border-red-500" : ""}
            >
              <option value="">Select Tax</option>
              {taxOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {`${t.name} (${t.percentage}%)`}
                </option>
              ))}
            </Select>
            {errors.tax && touched.tax && (
              <p className="text-red-500 text-sm mt-1">{errors.tax}</p>
            )}
          </div>

          <div>
            <Select
              label="Critical"
              name="critical"
              value={formData.critical}
              onChange={handleChange}
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </Select>
          </div>

          <div>
            <Input
              label="Expiry"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
            />
          </div>

          <div>
            <Input
              label="Reorder Level"
              name="reorder"
              value={formData.reorder}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.reorder && touched.reorder ? "border-red-500" : ""}
            />
            {errors.reorder && touched.reorder && (
              <p className="text-red-500 text-sm mt-1">{errors.reorder}</p>
            )}
          </div>

          <div>
            <Input
              label="Min Level"
              name="min"
              value={formData.min}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.min && touched.min ? "border-red-500" : ""}
            />
            {errors.min && touched.min && (
              <p className="text-red-500 text-sm mt-1">{errors.min}</p>
            )}
          </div>

          <div>
            <Input
              label="Cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.cost && touched.cost ? "border-red-500" : ""}
            />
            {errors.cost && touched.cost && (
              <p className="text-red-500 text-sm mt-1">{errors.cost}</p>
            )}
          </div>

          <Button type="submit" color="primary" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                  />
                </svg>
                Updating...
              </div>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </div>
    </Page>
  );
}