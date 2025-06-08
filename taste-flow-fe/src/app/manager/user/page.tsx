"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { userMock } from "@/app/utils/mockApi";

// Mock API functions
const fetchUsers = async () => {
  return Promise.resolve(userMock);
  // Khi backend sẵn sàng, thay bằng API thật:
  /*
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  */
};

const createUser = async (userData) => {
  return Promise.resolve({ id: Date.now().toString(), ...userData });
  // Khi backend sẵn sàng:
  /*
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
  */
};

const updateUser = async (id, userData) => {
  return Promise.resolve({ id, ...userData });
  // Khi backend sẵn sàng:
  /*
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
  */
};

const deleteUser = async (id) => {
  return Promise.resolve({ success: true });
  // Khi backend sẵn sàng:
  /*
  try {
    const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete user');
    return await response.json();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
  */
};

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên người dùng');
      return;
    }
    try {
      setIsLoading(true);
      const userData = { name: name.trim(), status };
      if (selectedUser?.id) {
        const updatedUser = await updateUser(selectedUser.id, userData);
        setUsers(users.map(user => user.id === selectedUser.id ? updatedUser : user));
      } else {
        const newUser = await createUser(userData);
        setUsers([...users, newUser]);
      }
      setIsModalOpen(false);
      setName("");
      setStatus(true);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Không thể lưu người dùng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setStatus(user.status);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này không?')) return;
    try {
      setIsLoading(true);
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Không thể xóa người dùng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName("");
    setStatus(true);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Người Dùng</h1>
        <Button variant="default" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
          Thêm Người Dùng
        </Button>
      </div>
      <div className="bg-[#2A2A2A] rounded-2xl border border-[#3A3A3A] p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-400">Đang tải...</div>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#3A3A3A]">
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Tên</th>
                <th className="py-2 px-4">Trạng Thái</th>
                <th className="py-2 px-4">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#3A3A3A]">
                  <td className="py-2 px-4">{user.id}</td>
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.status ? 'Hoạt động' : 'Không hoạt động'}</td>
                  <td className="py-2 px-4">
                    <Button variant="outline" className="mr-2" onClick={() => handleEdit(user)} disabled={isLoading}>
                      Sửa
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(user.id)} disabled={isLoading}>
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedUser?.id ? "Sửa Người Dùng" : "Thêm Người Dùng"}>
        <div className="space-y-4">
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên người dùng" className="w-full" disabled={isLoading} />
          <div className="flex items-center gap-2">
            <label>Trạng thái:</label>
            <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} disabled={isLoading} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseModal} disabled={isLoading}>
              Hủy
            </Button>
            <Button variant="default" onClick={handleSave} disabled={isLoading || !name.trim()}>
              {isLoading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}