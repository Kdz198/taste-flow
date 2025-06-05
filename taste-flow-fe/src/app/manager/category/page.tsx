"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { categoryMock } from "@/app/utils/mockApi";

// Comment: Mock API - Will be replaced with backend API later
const fetchCategories = async () => {
  return Promise.resolve(categoryMock);
  
  // Uncomment when backend is ready:
  /*
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  */
};

// Comment: Create category API - Will be implemented when backend is ready
const createCategory = async (categoryData) => {
  // Mock implementation - just return the data with a generated ID
  return Promise.resolve({ 
    id: Date.now().toString(), 
    ...categoryData 
  });
  
  // Uncomment when backend is ready:
  /*
  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return await response.json();
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
  */
};

// Comment: Update category API - Will be implemented when backend is ready
const updateCategory = async (id, categoryData) => {
  // Mock implementation - just return the updated data
  return Promise.resolve({ id, ...categoryData });
  
  // Uncomment when backend is ready:
  /*
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return await response.json();
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
  */
};

// Comment: Delete category API - Will be implemented when backend is ready
const deleteCategory = async (id) => {
  // Mock implementation - just return success
  return Promise.resolve({ success: true });
  
  // Uncomment when backend is ready:
  /*
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return await response.json();
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
  */
};

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      setIsLoading(true);
      const categoryData = { name: name.trim(), count };

      if (selectedCategory?.id) {
        // Update existing category
        const updatedCategory = await updateCategory(selectedCategory.id, categoryData);
        setCategories(categories.map(cat => 
          cat.id === selectedCategory.id ? updatedCategory : cat
        ));
      } else {
        // Create new category
        const newCategory = await createCategory(categoryData);
        setCategories([...categories, newCategory]);
      }

      // Reset form and close modal
      setIsModalOpen(false);
      setName("");
      setCount(0);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setName(category.name);
    setCount(category.count);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName("");
    setCount(0);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Button 
          variant="default" 
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
        >
          Add Category
        </Button>
      </div>

      {/* Table */}
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
                <th className="py-2 px-4">Count</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-[#3A3A3A]">
                  <td className="py-2 px-4">{category.id}</td>
                  <td className="py-2 px-4">{category.name}</td>
                  <td className="py-2 px-4">{category.count}</td>
                  <td className="py-2 px-4">
                    <Button 
                      variant="outline" 
                      className="mr-2" 
                      onClick={() => handleEdit(category)}
                      disabled={isLoading}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleDelete(category.id)}
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCategory?.id ? "Edit Category" : "Add Category"}
      >
        <div className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="w-full"
            disabled={isLoading}
          />
          <Input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            placeholder="Count"
            className="w-full"
            disabled={isLoading}
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={handleCloseModal}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleSave}
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}