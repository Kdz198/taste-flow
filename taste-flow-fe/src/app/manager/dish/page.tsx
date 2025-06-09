"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { dishMock } from "@/app/utils/mockApi";
import { Dish, UserStatus } from "@/app/utils/type";
import { categoryMock } from "@/app/utils/mockApi";

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

const createDish = async (dishData: Dish) => {
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

const updateDish = async (id: string, dishData: Dish) => {
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

const deleteDish = async (id: string) => {
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
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    status: 'ACTIVE' as UserStatus,
    category: [] as string[],
    receipt: [] as string[],
    image: '',
  });
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
    if (!formData.name.trim() || formData.price <= 0) {
      alert('Please enter a valid name and price (> 0)');
      return;
    }
    try {
      setIsLoading(true);
      const dishData = { ...formData };
      if (selectedDish?.id) {
        const updatedDish = await updateDish(selectedDish.id, dishData);
        setDishes(dishes.map(dish => dish.id === selectedDish.id ? updatedDish : dish));
      } else {
        const newDish = await createDish(dishData);
        setDishes([...dishes, newDish]);
      }
      setIsModalOpen(false);
      setFormData({ name: '', price: 0, status: 'ACTIVE', category: [], receipt: [], image: '' });
      setSelectedDish(null);
    } catch (error) {
      console.error('Error saving dish:', error);
      alert('Failed to save dish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (dish: Dish) => {
    setSelectedDish(dish);
    setFormData({ ...dish });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
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
    setFormData({ name: '', price: 0, status: 'ACTIVE', category: [], receipt: [], image: '' });
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
              <tr className="border-b border-[#3A3A3A]"><th className="py-2 px-4">ID</th><th className="py-2 px-4">Name</th><th className="py-2 px-4">Price</th><th className="py-2 px-4">Status</th><th className="py-2 px-4">Categories</th><th className="py-2 px-4">Receipt</th><th className="py-2 px-4">Image</th><th className="py-2 px-4">Actions</th></tr>
            </thead>
            <tbody>
              {dishes.map((dish) => (
                <tr key={dish.id} className="border-b border-[#3A3A3A]">
                  <td className="py-2 px-4">{dish.id}</td>
                  <td className="py-2 px-4">{dish.name}</td>
                  <td className="py-2 px-4">${dish.price ? dish.price.toFixed(2) : '0.00'}</td>
                  <td className="py-2 px-4">{dish.status}</td>
                  <td className="py-2 px-4">{dish.category?.join(', ') || 'N/A'}</td>
                  <td className="py-2 px-4">{dish.receipt?.join(', ') || 'N/A'}</td>
                  <td className="py-2 px-4">{dish.image || 'N/A'}</td>
                  <td className="py-2 px-4">
                    <Button variant="outline" className="mr-2 bg-black text-white hover:bg-gray-800" onClick={() => handleEdit(dish)} disabled={isLoading}>
                      Edit
                    </Button>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(dish.id)} disabled={isLoading}>
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
          <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="w-full" disabled={isLoading} />
          <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} placeholder="Price" className="w-full" disabled={isLoading} step="0.01" min="0.01" />
          <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })} className="w-full p-2 bg-[#3A3A3A] border border-[#4A4A4A] rounded" disabled={isLoading}>
            {Object.values(UserStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select multiple value={formData.category} onChange={(e) => setFormData({ ...formData, category: Array.from(e.target.selectedOptions, option => option.value) })} className="w-full p-2 bg-[#3A3A3A] border border-[#4A4A4A] rounded" disabled={isLoading}>
            {categoryMock.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <Input type="text" value={formData.receipt.join(', ')} onChange={(e) => setFormData({ ...formData, receipt: e.target.value.split(', ') })} placeholder="Receipt (comma-separated)" className="w-full" disabled={isLoading} />
          <Input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="Image URL" className="w-full" disabled={isLoading} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseModal} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave} disabled={isLoading || !formData.name.trim() || formData.price <= 0}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}