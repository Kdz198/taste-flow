"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { dishMock } from "@/app/utils/mockApi";

// Mock API functions
const fetchDishes = async () => {
  return Promise.resolve(dishMock);
  // When backend is ready:
  /*
  try {
    const response = await fetch('/api/dishes');
    if (!response.ok) throw new Error('Failed to fetch dishes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return [];
  }
  */
};

const createDish = async (dishData) => {
  return Promise.resolve({ id: Date.now().toString(), ...dishData });
  // When backend is ready:
  /*
  try {
    const response = await fetch('/api/dishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dishData),
    });
    if (!response.ok) throw new Error('Failed to create dish');
    return await response.json();
  } catch (error) {
    console.error('Error creating dish:', error);
    throw error;
  }
  */
};

const updateDish = async (id, dishData) => {
  return Promise.resolve({ id, ...dishData });
  // When backend is ready:
  /*
  try {
    const response = await fetch(`/api/dishes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dishData),
    });
    if (!response.ok) throw new Error('Failed to update dish');
    return await response.json();
  } catch (error) {
    console.error('Error updating dish:', error);
    throw error;
  }
  */
};

const deleteDish = async (id) => {
  return Promise.resolve({ success: true });
  // When backend is ready:
  /*
  try {
    const response = await fetch(`/api/dishes/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete dish');
    return await response.json();
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw error;
  }
  */
};

export default function DishPage() {
  const [dishes, setDishes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      setIsLoading(true);
      const data = await fetchDishes();
      setDishes(data);
    } catch (error) {
      console.error('Error loading dishes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a dish name');
      return;
    }
    try {
      setIsLoading(true);
      const dishData = { name: name.trim(), status };
      if (selectedDish?.id) {
        const updatedDish = await updateDish(selectedDish.id, dishData);
        setDishes(dishes.map(dish => dish.id === selectedDish.id ? updatedDish : dish));
      } else {
        const newDish = await createDish(dishData);
        setDishes([...dishes, newDish]);
      }
      setIsModalOpen(false);
      setName("");
      setStatus(true);
      setSelectedDish(null);
    } catch (error) {
      console.error('Error saving dish:', error);
      alert('Failed to save dish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (dish) => {
    setSelectedDish(dish);
    setName(dish.name);
    setStatus(dish.status);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    try {
      setIsLoading(true);
      await deleteDish(id);
      setDishes(dishes.filter(dish => dish.id !== id));
    } catch (error) {
      console.error('Error deleting dish:', error);
      alert('Failed to delete dish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName("");
    setStatus(true);
    setSelectedDish(null);
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dish Management</h1>
        <Button variant="default" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
          Add Dish
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
              {dishes.map((dish) => (
                <tr key={dish.id} className="border-b border-[#3A3A3A]">
                  <td className="py-2 px-4">{dish.id}</td>
                  <td className="py-2 px-4">{dish.name}</td>
                  <td className="py-2 px-4">{dish.status ? 'Active' : 'Inactive'}</td>
                  <td className="py-2 px-4">
                    <Button variant="outline" className="mr-2" onClick={() => handleEdit(dish)} disabled={isLoading}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(dish.id)} disabled={isLoading}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedDish?.id ? "Edit Dish" : "Add Dish"}>
        <div className="space-y-4">
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dish name" className="w-full" disabled={isLoading} />
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