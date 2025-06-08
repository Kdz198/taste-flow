"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { userMock } from "@/app/utils/mockApi";

// Mock API functions
const fetchUsers = async () => {
  return Promise.resolve(userMock);
  // When backend is ready, replace with real API:
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

const updateUser = async (id, userData) => {
  return Promise.resolve({ id, ...userData });
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

const deleteUser = async (id) => {
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
      alert('Please enter a user name');
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
      alert('Failed to save user. Please try again.');
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
    setName("");
    setStatus(true);
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
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#3A3A3A]">
                  <td className="py-2 px-4">{user.id}</td>
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.status ? 'Active' : 'Inactive'}</td>
                  <td className="py-2 px-4">
                    <Button variant="outline" className="mr-2" onClick={() => handleEdit(user)} disabled={isLoading}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(user.id)} disabled={isLoading}>
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
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="User name" className="w-full" disabled={isLoading} />
          <div className="flex items-center gap-2">
            <label>Status:</label>
            <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} disabled={isLoading} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseModal} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave} disabled={isLoading || !name.trim()}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}