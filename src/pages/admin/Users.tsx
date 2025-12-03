import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users as UsersIcon, 
  Briefcase, 
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchUsers = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setLoading(true);
    const url = filter 
      ? `${API_BASE_URL}/admin-portal/users/?role=${filter}`
      : `${API_BASE_URL}/admin-portal/users/`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setUsers(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin-portal/users/${userToDelete.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast({
          title: 'User Deleted',
          description: `${userToDelete.email} has been removed from the platform.`,
        });
        fetchUsers(); // Refresh the list
      } else {
        const data = await res.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete user.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filterButtons = [
    { value: '', label: 'All', icon: UsersIcon },
    { value: 'USER', label: 'Users', icon: UsersIcon },
    { value: 'LAWYER', label: 'Lawyers', icon: Briefcase },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin-portal/dashboard">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Users</h1>
            <p className="text-slate-400 mt-1">Manage platform users</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <div className="flex gap-2">
            {filterButtons.map(btn => (
              <Button
                key={btn.value}
                variant="ghost"
                size="sm"
                onClick={() => setFilter(btn.value)}
                className={`${
                  filter === btn.value
                    ? 'bg-amber-500 text-slate-900 hover:bg-amber-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <btn.icon className="h-4 w-4 mr-1" />
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Email</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Name</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Role</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Status</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Joined</th>
                    <th className="text-right p-4 text-slate-400 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 text-white font-medium">{user.email}</td>
                      <td className="p-4 text-slate-300">{user.full_name || '—'}</td>
                      <td className="p-4">
                        <Badge 
                          className={`${
                            user.role === 'LAWYER' 
                              ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {user.role === 'LAWYER' ? (
                            <Briefcase className="h-3 w-3 mr-1" />
                          ) : (
                            <UsersIcon className="h-3 w-3 mr-1" />
                          )}
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {user.is_verified ? (
                          <span className="text-green-400 flex items-center text-sm">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="text-slate-500 flex items-center text-sm">
                            <XCircle className="h-4 w-4 mr-1" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="p-12 text-center">
                  <UsersIcon className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-500">No users found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Stats */}
      <div className="text-sm text-slate-500 text-right">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete <span className="text-white font-medium">{userToDelete?.email}</span>? 
              This action cannot be undone and will permanently remove the user and all their data from the platform.
              {userToDelete?.role === 'LAWYER' && (
                <span className="block mt-2 text-amber-400">
                  This will also delete their lawyer profile and all associated consultations.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
              disabled={deleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
