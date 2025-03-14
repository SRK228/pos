import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, Edit, Trash2, UserPlus } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive";
  joinDate: string;
}

const StaffPage = () => {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh@meera.com",
      phone: "9876543210",
      role: "Store Manager",
      status: "active",
      joinDate: "2023-01-15",
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya@meera.com",
      phone: "9876543211",
      role: "Sales Associate",
      status: "active",
      joinDate: "2023-03-10",
    },
    {
      id: "3",
      name: "Amit Patel",
      email: "amit@meera.com",
      phone: "9876543212",
      role: "Inventory Manager",
      status: "active",
      joinDate: "2023-02-05",
    },
    {
      id: "4",
      name: "Sneha Gupta",
      email: "sneha@meera.com",
      phone: "9876543213",
      role: "Cashier",
      status: "inactive",
      joinDate: "2023-04-20",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    role: "Sales Associate",
    status: "active",
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!newStaff.name || newStaff.name.trim() === "") {
      errors.name = "Name is required";
    }
    if (!newStaff.email || newStaff.email.trim() === "") {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(newStaff.email)) {
      errors.email = "Invalid email format";
    }
    if (!newStaff.phone || newStaff.phone.trim() === "") {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(newStaff.phone)) {
      errors.phone = "Phone must be 10 digits";
    }
    if (!newStaff.role) {
      errors.role = "Role is required";
    }
    if (!newStaff.joinDate) {
      errors.joinDate = "Join date is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStaff = () => {
    if (validateForm()) {
      const newStaffMember: StaffMember = {
        id: (staff.length + 1).toString(),
        name: newStaff.name!,
        email: newStaff.email!,
        phone: newStaff.phone!,
        role: newStaff.role!,
        status: newStaff.status as "active" | "inactive",
        joinDate: newStaff.joinDate || new Date().toISOString().split("T")[0],
      };

      setStaff([...staff, newStaffMember]);
      setShowAddStaffDialog(false);
      setNewStaff({
        role: "Sales Associate",
        status: "active",
      });
      setFormErrors({});
    }
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      setStaff(staff.filter((member) => member.id !== id));
    }
  };

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Staff Management</h1>
        <div className="text-sm text-muted-foreground">
          Meera Maternity & Fertility Store
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 w-full max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Dialog
              open={showAddStaffDialog}
              onOpenChange={setShowAddStaffDialog}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-meera hover:bg-pink-700">
                  <UserPlus className="mr-2 h-4 w-4" /> Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name*</Label>
                    <Input
                      id="name"
                      value={newStaff.name || ""}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, name: e.target.value })
                      }
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address*</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStaff.email || ""}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, email: e.target.value })
                      }
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number*</Label>
                    <Input
                      id="phone"
                      value={newStaff.phone || ""}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, phone: e.target.value })
                      }
                    />
                    {formErrors.phone && (
                      <p className="text-sm text-red-500">{formErrors.phone}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role*</Label>
                    <Select
                      value={newStaff.role}
                      onValueChange={(value) =>
                        setNewStaff({ ...newStaff, role: value })
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Store Manager">
                          Store Manager
                        </SelectItem>
                        <SelectItem value="Sales Associate">
                          Sales Associate
                        </SelectItem>
                        <SelectItem value="Inventory Manager">
                          Inventory Manager
                        </SelectItem>
                        <SelectItem value="Cashier">Cashier</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.role && (
                      <p className="text-sm text-red-500">{formErrors.role}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newStaff.status as string}
                      onValueChange={(value) =>
                        setNewStaff({
                          ...newStaff,
                          status: value as "active" | "inactive",
                        })
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="joinDate">Join Date*</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={newStaff.joinDate || ""}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, joinDate: e.target.value })
                      }
                    />
                    {formErrors.joinDate && (
                      <p className="text-sm text-red-500">
                        {formErrors.joinDate}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddStaffDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-meera hover:bg-pink-700"
                    onClick={handleAddStaff}
                  >
                    Add Staff
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No staff members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            member.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.status === "active" ? "Active" : "Inactive"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(member.joinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteStaff(member.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffPage;
