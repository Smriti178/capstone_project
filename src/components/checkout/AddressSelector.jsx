import React, { useState } from "react";
import { MapPin, Plus, Check, Edit2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

/**
 * Lets the user pick an existing address or add a new one.
 * Calls onSelect(address) when a choice is confirmed.
 */
const AddressSelector = ({ selectedId, onSelect }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // address being edited
  const [form, setForm] = useState({
    label: "", name: "", line1: "", line2: "",
    city: "", state: "", zip: "", country: "US",
  });
  const [addresses, setAddresses] = useState(user?.addresses ?? []);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openAdd = () => {
    setEditTarget(null);
    setForm({ label: "Home", name: user?.name ?? "", line1: "", line2: "", city: "", state: "", zip: "", country: "US" });
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (addr) => {
    setEditTarget(addr.id);
    setForm({ label: addr.label, name: addr.name, line1: addr.line1, line2: addr.line2 ?? "", city: addr.city, state: addr.state, zip: addr.zip, country: addr.country });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.line1.trim()) e.line1 = "Street address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.state.trim()) e.state = "State is required.";
    if (!form.zip.trim()) e.zip = "ZIP code is required.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    if (editTarget) {
      setAddresses((prev) =>
        prev.map((a) => a.id === editTarget ? { ...a, ...form } : a)
      );
    } else {
      const newAddr = { ...form, id: `addr-${Date.now()}`, isDefault: addresses.length === 0 };
      setAddresses((prev) => [...prev, newAddr]);
      onSelect(newAddr);
    }
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <MapPin size={16} className="text-[#1e3a5f]" /> Delivery Address
        </h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 text-sm text-[#1e3a5f] hover:underline font-medium"
        >
          <Plus size={14} /> Add new
        </button>
      </div>

      {/* Address cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addresses.map((addr) => {
          const isSelected = selectedId === addr.id;
          return (
            <div key={addr.id} className="flex flex-col gap-1">
              {/* Card button — selecting the address */}
              <button
                onClick={() => onSelect(addr)}
                className={`relative text-left rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-[#1e3a5f] bg-[#1e3a5f]/5 ring-1 ring-[#1e3a5f]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {/* Selected check */}
                {isSelected && (
                  <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#1e3a5f]">
                    <Check size={11} className="text-white" />
                  </span>
                )}
                <p className="text-xs font-semibold text-[#1e3a5f] uppercase tracking-wide mb-1">
                  {addr.label}
                  {addr.isDefault && <span className="ml-2 normal-case text-gray-400 font-normal">(default)</span>}
                </p>
                <p className="text-sm font-medium text-gray-900">{addr.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                <p className="text-xs text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
              </button>
              {/* Edit button — separate from card to avoid nested interactive elements */}
              <button
                onClick={() => openEdit(addr)}
                className="self-start flex items-center gap-1 text-xs text-gray-400 hover:text-[#1e3a5f] transition-colors px-1"
                aria-label={`Edit ${addr.label} address`}
              >
                <Edit2 size={11} /> Edit
              </button>
            </div>
          );
        })}
      </div>

      {/* Add/Edit modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editTarget ? "Edit Address" : "Add New Address"}
        maxWidth="max-w-lg"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input id="addr-label" label="Label (e.g. Home)" value={form.label} onChange={set("label")} placeholder="Home" />
            <Input id="addr-name" label="Full name" value={form.name} onChange={set("name")} error={errors.name} />
          </div>
          <Input id="addr-line1" label="Street address" value={form.line1} onChange={set("line1")} error={errors.line1} />
          <Input id="addr-line2" label="Apt, suite, etc. (optional)" value={form.line2} onChange={set("line2")} />
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <Input id="addr-city" label="City" value={form.city} onChange={set("city")} error={errors.city} />
            </div>
            <div className="col-span-1">
              <Input id="addr-state" label="State" value={form.state} onChange={set("state")} error={errors.state} />
            </div>
            <div className="col-span-1">
              <Input id="addr-zip" label="ZIP" value={form.zip} onChange={set("zip")} error={errors.zip} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? "Save Changes" : "Add Address"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddressSelector;
