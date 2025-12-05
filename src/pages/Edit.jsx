import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function EditPage({ destinations, setTours }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    destinationId: "",
    category: "",
    slots: "",
    active: true
  });

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/tours/${id}`);
        setForm({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
          image: res.data.image,
          destinationId: res.data.destinationId,
          category: res.data.category || "",
          slots: res.data.slots || 0,
          active: res.data.active
        });
      } catch (err) {
        toast.error("Không tải được dữ liệu tour");
      }
    };
    fetchTour();
  }, [id]);

  const validate = () => {
    if (!form.name || form.name.length < 5 || form.name.length > 100) {
      toast.error("Tên tour phải từ 5 đến 100 ký tự");
      return false;
    }
    if (!form.description || form.description.length < 10 || form.description.length > 1000) {
      toast.error("Mô tả phải từ 10 đến 1000 ký tự");
      return false;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error("Giá phải > 0");
      return false;
    }
    try {
      new URL(form.image);
    } catch {
      toast.error("URL hình ảnh không hợp lệ");
      return false;
    }
    if (!form.destinationId) {
      toast.error("Chọn điểm đến");
      return false;
    }
    if (!form.category) {
      toast.error("Chọn loại tour");
      return false;
    }
    if (!form.slots || Number(form.slots) < 0) {
      toast.error("Số lượng chỗ ≥ 0");
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
        price: Number(form.price),
        slots: Number(form.slots)
      };

      await axios.put(`http://localhost:3000/tours/${id}`, updated);

      setTours(prev =>
        prev.map(t => String(t.id) === id ? { ...t, ...updated } : t)
      );

      toast.success("Cập nhật tour thành công");
      navigate("/list");
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Chỉnh sửa Tour</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="space-y-4">

            <div>
              <label className="block mb-1">Tên Tour</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1">Mô tả</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 h-28"
              ></textarea>
            </div>

            <div>
              <label className="block mb-1">Giá</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1">Hình ảnh (URL)</label>
              <input
                type="text"
                name="image"
                value={form.image}
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
              <label className="block mb-1">Điểm đến</label>
              <select
                name="destinationId"
                value={form.destinationId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Chọn điểm đến --</option>
                {destinations.map(dest => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Loại tour</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Chọn loại tour --</option>
                <option value="tour nội địa">Tour nội địa</option>
                <option value="tour quốc tế">Tour quốc tế</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Số lượng chỗ</label>
              <input
                type="number"
                name="slots"
                value={form.slots}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              <label>Đang hoạt động</label>
            </div>

            
          </div>

        </div>
      </form>
    </div>
  );
}

export default EditPage;
