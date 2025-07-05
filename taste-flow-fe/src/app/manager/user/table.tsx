
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, UserRole, UserStatus } from "@/utils/type";
import { Calendar, Edit2, Eye, Mail, MapPin, MoreHorizontal, Phone, Trash2 } from "lucide-react";
import React from "react";

interface UserTableProps {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  searchTerm: string;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getRoleBadgeVariant = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "destructive";
    case UserRole.MANAGER:
      return "default";
    default:
      return "secondary";
  }
};

const UserTable: React.FC<UserTableProps> = ({ users, filteredUsers, isLoading, searchTerm, onEdit, onDelete }) => {
  if (isLoading && !users.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-400">Loading users...</div>
      </div>
    );
  }
  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">No users found</p>
        {searchTerm && <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter criteria</p>}
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredUsers.map((user) => (
        <Card key={user.id} className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#323232] transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white">{user.name}</h3>
                  <p className="text-sm text-gray-400">ID: {user.id}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#2A2A2A] border-[#3A3A3A]">
                  <DropdownMenuItem onClick={() => onEdit(user)} className="text-white hover:bg-[#3A3A3A]">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-red-400 hover:bg-red-600/20">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-gray-400" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {user.phone}
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {user.address}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="w-4 h-4 text-gray-400" />
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant={user.status === UserStatus.ACTIVE ? "default" : "secondary"}>{user.status}</Badge>
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserTable;
