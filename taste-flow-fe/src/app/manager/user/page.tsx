"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { userMock } from "@/app/utils/mockApi";
import { User, UserStatus, UserRole } from "@/app/utils/type";

// Mock API functions
const fetchUsers = async () => {
  return Promise.resolve(userMock);
  // When backend is ready:
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

const createUser = async (userData: User) => {
  return Promise.resolve({ id: Date.now().toString(), ...userData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  // When backend is ready:
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

const updateUser = async (id: string, userData: User) => {
  return Promise.resolve({ id, ...userData, updatedAt: new Date().toISOString() });
  // When backend is ready:
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

const deleteUser = async (id: string) => {
  return Promise.resolve({ success: true });
  // When backend is ready:
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
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    status: 'ACTIVE' as UserStatus,
    role: 'CUSTOMER' as UserRole,
  });
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
    if (!formData.email.trim() || !formData.password.trim() || !formData.name.trim()) {
      alert('Please fill all required fields (email, password, name)');
      return;
    }
    try {
      setIsLoading(true);
      const userData = { ...formData };
      if (selectedUser?.id) {
        const updatedUser = await updateUser(selectedUser.id, userData);
        setUsers(users.map(user => user.id === selectedUser.id ? updatedUser : user));
      } else {
        const newUser = await createUser(userData);
        setUsers([...users, newUser]);
      }
      setIsModalOpen(false);
      setFormData({ email: '', password: '', name: '', phone: '', address: '', status: 'ACTIVE', role: 'CUSTOMER' });
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({ ...user });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      setIsLoading(true);
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ email: '', password: '', name: '', phone: '', address: '', status: 'ACTIVE', role: 'CUSTOMER' });
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button variant="default" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
          Add User
        </Button>
      </div>
      <div className="bg-[#2A2A2A] rounded-2xl border border-[#3A3A3A] p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#3A3A3A]">
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Address</th>
                <th className="py-2 px-4">Created At</th>
                <th className="py-2 px-4">Updated At</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#3A3A3A]">
                  <td className="py-2 px-4">{user.id}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.phone}</td>
                  <td className="py-2 px-4">{user.address}</td>
                  <td className="py-2 px-4">{user.createdAt}</td>
                  <td className="py-2 px-4">{user.updatedAt}</td>
                  <td className="py-2 px-4">{user.status}</td>
                  <td className="py-2 px-4">{user.role}</td>
                  <td className="py-2 px-4">
                    <Button variant="outline" className="mr-2 bg-black text-white hover:bg-gray-800" onClick={() => handleEdit(user)} disabled={isLoading}>
                      Edit
                    </Button>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(user.id)} disabled={isLoading}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedUser?.id ? "Edit User" : "Add User"}>
        <div className="space-y-4">
          <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="w-full" disabled={isLoading} />
          <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Password" className="w-full" disabled={isLoading} />
          <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="w-full" disabled={isLoading} />
          <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" className="w-full" disabled={isLoading} />
          <Input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Address" className="w-full" disabled={isLoading} />
          <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })} className="w-full p-2 bg-[#3A3A3A] border border-[#4A4A4A] rounded" disabled={isLoading}>
            {Object.values(UserStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })} className="w-full p-2 bg-[#3A3A3A] border border-[#4A4A4A] rounded" disabled={isLoading}>
            {Object.values(UserRole).map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseModal} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave} disabled={isLoading || !formData.email.trim() || !formData.password.trim() || !formData.name.trim()}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}