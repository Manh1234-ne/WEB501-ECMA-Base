import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ListPage({ tours, setTours }) {
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa Tour này chứ?")) return;

    try {
      await axios.delete(`http://localhost:3000/tours/${id}`);
      setTours(prev => prev.filter(t => String(t.id) !== String(id)));
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  const handleToggleActive = async (tour) => {
    try {
      const updated = { ...tour, active: !tour.active };
      await axios.put(`http://localhost:3000/tours/${tour.id}`, updated);

      setTours(prev =>
        prev.map(t => t.id === tour.id ? updated : t)
      );
    } catch (err) {
      alert("Cập nhật thất bại");
    }
  };

  // đảm bảo dữ liệu slots không undefined
  const filteredTours = tours.filter(t =>
    t.name.toLowerCase().includes(filterName.toLowerCase()) &&
    (filterStatus === "all" || (filterStatus === "active" ? t.active : !t.active))
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách Tour</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
          className="border px-3 py-1 rounded"
        />

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="all">Tất cả</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Tên tour</th>
              <th className="px-4 py-2 border">Giá</th>
              <th className="px-4 py-2 border">Hình ảnh</th>
              <th className="px-4 py-2 border">Số lượng</th>
              <th className="px-4 py-2 border">Loại tour</th>
              <th className="px-4 py-2 border">Active</th>
              <th className="px-4 py-2 border">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredTours.map((tour, index) => (
              <tr key={tour.id}>
                <td className="px-4 py-2 border">{index + 1}</td>

                <td className="px-4 py-2 border">{tour.name}</td>

                <td className="px-4 py-2 border">
                  {Number(tour.price).toLocaleString()} đ
                </td>

                <td className="px-4 py-2 border">
                  <img
                    src={tour.image}
                    alt=""
                    className="w-16 h-16 rounded object-cover border"
                  />
                </td>

                <td className="px-4 py-2 border">
                  {tour.slots !== undefined && tour.slots !== null
                    ? Number(tour.slots)
                    : "Không có"}
                </td>

                <td className="px-4 py-2 border">{tour.category}</td>

                <td className="px-4 py-2 border">
                  <input
                    type="checkbox"
                    checked={tour.active}
                    onChange={() => handleToggleActive(tour)}
                  />
                </td>

                <td className="px-4 py-2 border">
                  <Link
                    to={`/edit/${tour.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Sửa
                  </Link>

                  <button
                    onClick={() => handleDelete(tour.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}

            {filteredTours.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-500">
                  Không có tour nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListPage;
