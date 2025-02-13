import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Role {
  id: string;
  name: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('roles').select('*');
      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      toast.error('Error fetching roles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addRole = async () => {
    if (!newRole.trim()) {
      toast.error('Role name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('roles').insert([{ name: newRole.trim() }]);
      if (error) throw error;
      toast.success('Role added successfully');
      setNewRole('');
      fetchRoles();
    } catch (error) {
      toast.error('Error adding role');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('roles').delete().eq('id', id);
      if (error) throw error;
      toast.success('Role deleted successfully');
      fetchRoles();
    } catch (error) {
      toast.error('Error deleting role');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Roles</h1>
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="New Role"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          disabled={loading}
        />
        <Button onClick={addRole} disabled={loading}>Add Role</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.id}</TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => deleteRole(role.id)} disabled={loading}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
