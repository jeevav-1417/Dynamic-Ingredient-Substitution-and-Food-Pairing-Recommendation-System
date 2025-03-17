import React from 'react';
import { User } from 'lucide-react';

interface UserFormProps {
  userData: any;
  setUserData: (data: any) => void;
  onNext: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ userData, setUserData, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <User className="h-8 w-8 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">Welcome!</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            value={userData.gender}
            onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default UserForm;