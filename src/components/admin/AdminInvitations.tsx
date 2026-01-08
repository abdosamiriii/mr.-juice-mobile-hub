import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserPlus, Shield, Trash2, Mail, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  email?: string;
}

export function AdminInvitations() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all admins
  const { data: admins, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "admin");

      if (error) throw error;

      // Fetch email for each admin from profiles or just show user_id
      const adminsWithEmail: AdminUser[] = [];
      for (const role of roles || []) {
        // Try to get profile info
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", role.user_id)
          .maybeSingle();

        adminsWithEmail.push({
          ...role,
          email: profile?.full_name || role.user_id.slice(0, 8),
        });
      }

      return adminsWithEmail;
    },
  });

  // Add admin by email
  const addAdmin = useMutation({
    mutationFn: async (emailToAdd: string) => {
      // First, find the user by email using auth.users approach
      // Since we can't directly query auth.users, we'll use a different approach:
      // Look for a profile with matching user_id pattern or ask admin to use user_id
      
      // For now, we'll use user_id directly if it looks like a UUID, otherwise search profiles
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(emailToAdd);
      
      let userId: string;
      
      if (isUUID) {
        userId = emailToAdd;
      } else {
        // Search by full_name in profiles (as a workaround since we can't search auth.users)
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .ilike("full_name", `%${emailToAdd}%`)
          .maybeSingle();

        if (profileError || !profile) {
          throw new Error("User not found. Please enter the user's UUID or their registered name.");
        }
        
        userId = profile.user_id;
      }

      // Check if already admin
      const { data: existing } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (existing) {
        throw new Error("This user is already an admin");
      }

      // Add admin role
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin",
        });

      if (error) throw error;

      return { userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Admin added successfully");
      setEmail("");
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error("Failed to add admin", { description: error.message });
    },
  });

  // Remove admin
  const removeAdmin = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Admin removed");
    },
    onError: (error: Error) => {
      toast.error("Failed to remove admin", { description: error.message });
    },
  });

  const handleAddAdmin = () => {
    if (!email.trim()) {
      toast.error("Please enter a name or user ID");
      return;
    }
    addAdmin.mutate(email.trim());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admin Management
            </CardTitle>
            <CardDescription>
              Manage who has admin access to the dashboard
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="email">User Name or ID</Label>
                  <Input
                    id="email"
                    placeholder="Enter user's name or UUID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter the user's registered name or their user ID (UUID)
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={handleAddAdmin}
                  disabled={addAdmin.isPending}
                >
                  {addAdmin.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Make Admin
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading admins...</div>
          ) : admins?.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No admins found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins?.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{admin.email}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {admin.user_id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                          Admin
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(admin.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Admin Access?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove admin privileges from this user. They will no longer be able to access the admin dashboard.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => removeAdmin.mutate(admin.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
