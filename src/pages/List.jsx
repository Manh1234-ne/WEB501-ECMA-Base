import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ListPage({ sinhviens, setSinhviens }) {
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sinh vien này chứ?")) return;

    try {
      await axios.delete(`http://localhost:3000/sinhviens/${id}`);
      setSinhviens(prev => prev.filter(t => String(t.id) !== String(id)));
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  const handleToggleActive = async (sinhvien) => {
    try {
      const updated = { ...sinhvien, active: !sinhvien.active };
      await axios.put(`http://localhost:3000/tours/${sinhvien.id}`, updated);

      setTours(prev =>
        prev.map(t => t.id === sinhvien.id ? updated : t)
      );
    } catch (err) {
      alert("Cập nhật thất bại");
    }
  };

  // đảm bảo dữ liệu slots không undefined
  const filteredSinhviens = sinhviens.filter(t =>
    t.name.toLowerCase().includes(filterName.toLowerCase()) &&
    (filterStatus === "all" || (filterStatus === "active" ? s.active : !s.active))
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách Sinh vien</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
          className="border px-3 py-1 rounded"
        />

        
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Tên Sinh vien</th>
              <th className="px-4 py-2 border">Tuoi</th>
              <th className="px-4 py-2 border">Mon hoc</th>
              <th className="px-4 py-2 border">Nganh hoc</th>
              <th className="px-4 py-2 border">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredSinhviens.map((sinhvien, index) => (
              <tr key={sinhvien.id}>
                <td className="px-4 py-2 border">{index + 1}</td>

                <td className="px-4 py-2 border">{sinhvien.name}</td>

                <td className="px-4 py-2 border">
                  {Number(sinhvien.age).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">{sinhvien.monhoc}</td>
                <td className="px-4 py-2 border">{sinhvien.nganhhoc}</td>

                

                

                

                <td className="px-4 py-2 border">
                  <Link
                    to={`/edit/${sinhvien.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Sửa
                  </Link>

                  <button
                    onClick={() => handleDelete(sinhvien.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}

            {filteredSinhviens.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-500">
                  Không có sinh vien nào.
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
