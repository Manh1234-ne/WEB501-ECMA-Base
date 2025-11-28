import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ListPage({ tours, setTours }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa Tour này chứ?")) return;

    try {
      setDeletingId(id);
      const res = await axios.delete(`http://localhost:3000/tours/${id}`);

      if (res.status === 200 || res.status === 204) {
        if (typeof setTours === "function") {
          setTours((prevTours) => prevTours.filter((t) => String(t.id) !== String(id)));
        }
      } else {
        alert(`Xóa thất bại, server trả về: ${res.status}`);
      }
    } catch (error) {
      console.error("Xóa tour thất bại:", error);
      alert(
        "Xóa tour thất bại: " +
        (error.response?.data?.message ||
          error.response?.statusText ||
          error.message ||
          "Không rõ lỗi")
      );
    } finally {
      setDeletingId(null);
    }
  };

  const truncate = (text, n = 80) => (text && text.length > n ? text.slice(0, n) + "..." : text || "-");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách Tour</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-left">#</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Ảnh</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Tên Tour</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Điểm đến</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Thời lượng</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Giá (VND)</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Số lượng</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Mô tả</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {tours.map((tour, index) => (
              <tr key={tour.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-300">{index + 1}</td>

                <td className="px-4 py-2 border border-gray-300">
                  {tour.image ? (
                    <img src={tour.image} alt={tour.name} className="w-24 h-14 object-cover rounded" />
                  ) : (
                    <div className="w-24 h-14 bg-gray-100 flex items-center justify-center text-xs text-gray-500 rounded">No image</div>
                  )}
                </td>

                <td className="px-4 py-2 border border-gray-300">{tour.name}</td>
                <td className="px-4 py-2 border border-gray-300">{tour.destination}</td>
                <td className="px-4 py-2 border border-gray-300">{tour.duration || "-"}</td>
                <td className="px-4 py-2 border border-gray-300">{tour.price?.toLocaleString?.() ?? tour.price}</td>
                <td className="px-4 py-2 border border-gray-300">{tour.available ?? 0}</td>
                <td className="px-4 py-2 border border-gray-300 text-left">{truncate(tour.description, 100)}</td>

                <td className="px-4 py-2 border border-gray-300">
                  <div className="flex items-center gap-2">
                    <Link to={`/edit/${tour.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Sửa</Link>
                    <button
                      onClick={() => handleDelete(tour.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      disabled={deletingId === tour.id}
                    >
                      {deletingId === tour.id ? "Đang xóa..." : "Xóa"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {tours.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
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
