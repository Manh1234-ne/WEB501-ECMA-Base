import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddPage({ destinations = [], setTours }) {
  const navigate = useNavigate();
  const initialFetchRef = useRef(false);

  const [localDestinations, setLocalDestinations] = useState(destinations || []);
  const [loadingDestinations, setLoadingDestinations] = useState(false);

  const [form, setForm] = useState({
    name: "",
    destination: "",
    duration: "",
    price: "",
    image: "",
    description: "",
    available: "",
    category: "Tour nội địa",
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLocalDestinations(destinations || []);
  }, [destinations]);

  useEffect(() => {
    if (!form.destination && localDestinations.length > 0) {
      setForm((f) => ({ ...f, destination: localDestinations[0].name }));
    }
  }, [localDestinations, form.destination]);

  useEffect(() => {
    const fetchFallback = async () => {
      if (initialFetchRef.current) return;
      if ((destinations?.length || 0) > 0) return;
      initialFetchRef.current = true;
      try {
        setLoadingDestinations(true);
        const res = await axios.get("http://localhost:3000/destinations");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLocalDestinations(res.data);
        }
      } catch (err) {
        console.warn("Không lấy được destinations: ", err.message || err);
      } finally {
        setLoadingDestinations(false);
      }
    };

    fetchFallback();
  }, [destinations]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleRetryFetch = async () => {
    try {
      setLoadingDestinations(true);
      const res = await axios.get("http://localhost:3000/destinations");
      setLocalDestinations(res.data || []);
      toast.success("Lấy điểm đến thành công");
    } catch (err) {
      console.error("Lỗi lấy destinations:", err);
      toast.error("Lấy điểm đến thất bại");
    } finally {
      setLoadingDestinations(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên tour.");
      return;
    }
    if (!form.destination) {
      toast.error("Vui lòng chọn điểm đến.");
      return;
    }
    const priceNum = Number(form.price);
    if (!priceNum || priceNum <= 0) {
      toast.error("Giá phải là số dương.");
      return;
    }
    const availableNum = Number(form.available) || 0;

    const newTour = {
      name: form.name,
      destination: form.destination,
      duration: form.duration || "",
      price: priceNum,
      image: form.image || `https://picsum.photos/400/300?random=${Date.now()}`,
      description: form.description || "",
      available: availableNum,
      category: form.category,
      active: !!form.active,
    };

    try {
      setSubmitting(true);
      const res = await axios.post("http://localhost:3000/tours", newTour);
      const created = res.data;
      toast.success("Thêm tour thành công!");

      if (typeof setTours === "function") {
        setTours((prev = []) => [...prev, created]);
      }

      setForm({
        name: "",
        destination: localDestinations.length > 0 ? localDestinations[0].name : "",
        duration: "",
        price: "",
        image: "",
        description: "",
        available: "",
        category: "Tour nội địa",
        active: true,
      });

      setTimeout(() => navigate("/list"), 600);
    } catch (err) {
      console.error("Lỗi khi thêm tour:", err);
      toast.error(err.response?.data?.message || "Thêm tour thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const noDestinations = localDestinations.length === 0;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Thêm mới Tour</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block font-medium mb-1">Tên Tour</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} type="text" className="w-full border rounded-lg px-3 py-2" required />
        </div>

        <div>
          <label htmlFor="destination" className="block font-medium mb-1">Điểm đến</label>
          <select id="destination" name="destination" value={form.destination} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-white" required disabled={noDestinations || loadingDestinations}>
            {noDestinations ? (
              <option value="">-- Không có điểm đến --</option>
            ) : (
              localDestinations.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)
            )}
          </select>

          {noDestinations && (
            <div className="mt-2 text-sm text-gray-600">
              Không có điểm đến. <button type="button" onClick={handleRetryFetch} className="underline text-blue-600">{loadingDestinations ? "Đang thử lại..." : "Thử lấy lại"}</button> hoặc chạy json-server:
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1">json-server --watch db.json --port 3000</pre>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="duration" className="block font-medium mb-1">Thời lượng</label>
          <input id="duration" name="duration" value={form.duration} onChange={handleChange} type="text" placeholder="Ví dụ: 3 ngày 2 đêm" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label htmlFor="price" className="block font-medium mb-1">Giá (VND)</label>
          <input id="price" name="price" value={form.price} onChange={handleChange} type="number" min="0" className="w-full border rounded-lg px-3 py-2" required />
        </div>

        <div>
          <label htmlFor="available" className="block font-medium mb-1">Số lượng còn (available)</label>
          <input id="available" name="available" value={form.available} onChange={handleChange} type="number" min="0" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label htmlFor="image" className="block font-medium mb-1">URL ảnh</label>
          <input id="image" name="image" value={form.image} onChange={handleChange} type="text" placeholder="https://example.com/pic.jpg" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium mb-1">Mô tả</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} rows="4" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <button type="submit" disabled={submitting || noDestinations} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {submitting ? "Đang thêm..." : "Thêm Tour"}
        </button>
      </form>
    </div>
  );
}

export default AddPage;
