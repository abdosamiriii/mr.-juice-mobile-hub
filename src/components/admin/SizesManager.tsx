import { useState } from "react";
import { useSizes, useUpdateSize, DbSize } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";

export const SizesManager = () => {
  const { data: sizes, isLoading } = useSizes();
  const updateSize = useUpdateSize();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<DbSize | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price_modifier: 0,
    ml: 0,
    is_active: true,
  });

  const handleEdit = (size: DbSize) => {
    setEditingSize(size);
    setFormData({
      name: size.name,
      price_modifier: size.price_modifier,
      ml: size.ml,
      is_active: size.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSize) {
      await updateSize.mutateAsync({
        id: editingSize.id,
        ...formData,
      });
    }
    
    setIsDialogOpen(false);
    setEditingSize(null);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading sizes...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sizes ({sizes?.length || 0})</CardTitle>
        <CardDescription>
          Configure the available sizes for drinks. The price modifier is added to the base price.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Volume (ml)</TableHead>
                <TableHead className="text-right">Price Modifier</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizes?.map((size) => (
                <TableRow key={size.id}>
                  <TableCell className="font-medium">{size.name}</TableCell>
                  <TableCell className="text-right">{size.ml} ml</TableCell>
                  <TableCell className="text-right">
                    {size.price_modifier > 0 ? `+${size.price_modifier}` : size.price_modifier} EGP
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${size.is_active ? "bg-green-500" : "bg-red-500"}`} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(size)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Size</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ml">Volume (ml)</Label>
                  <Input
                    id="ml"
                    type="number"
                    min="0"
                    value={formData.ml}
                    onChange={(e) => setFormData({ ...formData, ml: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price_modifier">Price Modifier (EGP)</Label>
                  <Input
                    id="price_modifier"
                    type="number"
                    step="0.01"
                    value={formData.price_modifier}
                    onChange={(e) => setFormData({ ...formData, price_modifier: parseFloat(e.target.value) || 0 })}
                  />
                </div>
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
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateSize.isPending}>
                  Update
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
