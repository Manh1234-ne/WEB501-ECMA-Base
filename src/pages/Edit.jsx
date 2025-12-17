import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function EditPage({ setSinhviens }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    monhoc: "",
    nganhhoc: "",
  });

  useEffect(() => {
    const fetchSinhvien = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/sinhviens/${id}`);
        setForm({
          name: res.data.name,
          age: res.data.age,
          monhoc: res.data.monhoc,
          nganhhoc: res.data.nganhhoc,

        });
      } catch (err) {
        toast.error("Không tải được dữ liệu sinh vien");
      }
    };
    fetchSinhvien();
  }, [id]);

  const validate = () => {
    if (!form.name) {
      toast.error("Hay nhap ten");
      return false;
    }

    if (!form.age || Number(form.age) <= 0) {
      toast.error("Tuoi phải > 0");
      return false;
    }
    if (!form.monhoc) {
      toast.error("Hay nhap mon hoc");
      return false;
    }
    if (!form.nganhhoc) {
      toast.error("Hay nhap nganh hoc");
      return false;
    }

    return true;
  };

  const handleChange = e => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const updated = {
        ...form,
        price: Number(form.age),
      };

      await axios.put(`http://localhost:3000/sinhviens/${id}`, updated);

      setSinhviens(prev =>
        prev.map(t => String(t.id) === id ? { ...t, ...updated } : t)
      );

      toast.success("Cập nhật sinh vien thành công");
      navigate("/list");
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Chỉnh sửa sinh vien</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="space-y-4">

            <div>
              <label className="block mb-1">Tên sinh vien</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>



            <div>
              <label className="block mb-1">Tuoi</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>


            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mt-4"
            >
              Cập nhật Tour
            </button>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Mon hoc</label>
              <input
                type="text"
                name="monhoc"
                value={form.monhoc}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            

            <div>
              <label className="block mb-1">Nganh hoc</label>
              <select
                name="nganhhoc"
                value={form.nganhhoc}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Chọn nganh hoc --</option>
                <option value="FE">FE</option>
                <option value="BE">BE</option>
                <option value="MOBILE">MOBILE</option>
              </select>
            </div>

            


          </div>

        </div>
      </form>
    </div>
  );
}

export default EditPage;
