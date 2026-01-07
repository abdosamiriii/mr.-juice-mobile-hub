import { useState } from "react";
import { useAddOns, useCreateAddOn, useUpdateAddOn, useDeleteAddOn, DbAddOn } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const AddOnsManager = () => {
  const { data: addOns, isLoading } = useAddOns();
  const createAddOn = useCreateAddOn();
  const updateAddOn = useUpdateAddOn();
  const deleteAddOn = useDeleteAddOn();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState<DbAddOn | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "➕",
    price: 0,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      icon: "➕",
      price: 0,
      is_active: true,
    });
    setEditingAddOn(null);
  };

  const handleEdit = (addOn: DbAddOn) => {
    setEditingAddOn(addOn);
    setFormData({
      name: addOn.name,
      icon: addOn.icon,
      price: addOn.price,
      is_active: addOn.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAddOn) {
      await updateAddOn.mutateAsync({
        id: editingAddOn.id,
        ...formData,
      });
    } else {
      await createAddOn.mutateAsync(formData);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading add-ons...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Add-ons ({addOns?.length || 0})</CardTitle>
          <CardDescription>
            Extra ingredients customers can add to their drinks.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Add-on
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAddOn ? "Edit Add-on" : "Add New Add-on"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="text-center text-xl"
                    maxLength={4}
                  />
                </div>
                
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (EGP)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createAddOn.isPending || updateAddOn.isPending}>
                  {editingAddOn ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addOns?.map((addOn) => (
                <TableRow key={addOn.id}>
                  <TableCell className="text-2xl">{addOn.icon}</TableCell>
                  <TableCell className="font-medium">{addOn.name}</TableCell>
                  <TableCell className="text-right">
                    {addOn.price > 0 ? `+${addOn.price} EGP` : "Free"}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${addOn.is_active ? "bg-green-500" : "bg-red-500"}`} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(addOn)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Add-on</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{addOn.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteAddOn.mutate(addOn.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
