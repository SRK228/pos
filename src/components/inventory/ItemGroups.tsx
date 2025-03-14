import React, { useState, useEffect, lazy, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, ArrowRight } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load the detail component to improve performance
const ItemGroupDetail = lazy(() => import("./ItemGroupDetail"));

interface ItemGroup {
  id: string;
  name: string;
  variants: number;
  createdAt: string;
}

const ItemGroups = () => {
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([
    {
      id: "1",
      name: "Baby Clothing Set",
      variants: 3,
      createdAt: "2024-05-01",
    },
    {
      id: "2",
      name: "Diaper Bundle",
      variants: 2,
      createdAt: "2024-05-02",
    },
    {
      id: "3",
      name: "Toy Collection",
      variants: 4,
      createdAt: "2024-05-03",
    },
    {
      id: "4",
      name: "Maternity Essentials",
      variants: 5,
      createdAt: "2024-05-04",
    },
  ]);

  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const handleCreateGroup = () => {
    if (newGroupName.trim() === "") {
      alert("Please enter a group name");
      return;
    }

    const newGroup: ItemGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName,
      variants: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setItemGroups([...itemGroups, newGroup]);
    setNewGroupName("");
    setShowNewGroupDialog(false);
  };

  // Initialize component after mount to prevent hydration issues
  useEffect(() => {
    // Small timeout to ensure DOM is ready and prevent flickering
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const filteredGroups = itemGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isLoaded) {
    return (
      <div className="p-8 flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner size="lg" color="#db2777" />
        <p>Loading item groups...</p>
      </div>
    );
  }

  // If a group is selected, show the detail view
  if (selectedGroup) {
    const group = itemGroups.find((g) => g.id === selectedGroup);
    return (
      <Suspense
        fallback={
          <div className="p-8 flex flex-col items-center justify-center space-y-4">
            <LoadingSpinner size="lg" color="#db2777" />
            <p>Loading group details...</p>
          </div>
        }
      >
        <ItemGroupDetail
          groupId={selectedGroup}
          groupName={group?.name}
          onBack={() => setSelectedGroup(null)}
        />
      </Suspense>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Item Groups
        </h1>
        <div className="text-sm text-muted-foreground">
          Meera Maternity & Fertility Store
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col items-center justify-center text-center h-auto sm:h-80">
          <div className="w-24 h-24 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect
                x="20"
                y="20"
                width="40"
                height="60"
                rx="4"
                fill="#f9a8d4"
              />
              <rect
                x="30"
                y="30"
                width="40"
                height="60"
                rx="4"
                fill="#f472b6"
              />
              <rect
                x="40"
                y="40"
                width="40"
                height="60"
                rx="4"
                fill="#db2777"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Item Groups</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Create multiple variants of the same item using Item Groups
          </p>
          <Dialog
            open={showNewGroupDialog}
            onOpenChange={setShowNewGroupDialog}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-meera hover:bg-pink-700 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> New Item Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Item Group</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNewGroupDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup}>Create Group</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center h-auto sm:h-80">
          <div className="w-24 h-24 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect
                x="20"
                y="30"
                width="60"
                height="60"
                rx="4"
                fill="#f9a8d4"
              />
              <path d="M50,20 L70,40 L30,40 Z" fill="#db2777" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Items</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Create standalone items and services that you buy and sell
          </p>
          <Button className="bg-gradient-meera hover:bg-pink-700 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> New Item
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col items-center justify-center text-center h-auto sm:h-80">
          <div className="w-24 h-24 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect
                x="20"
                y="20"
                width="30"
                height="40"
                rx="4"
                fill="#f9a8d4"
              />
              <rect
                x="50"
                y="20"
                width="30"
                height="40"
                rx="4"
                fill="#db2777"
              />
              <rect
                x="20"
                y="60"
                width="60"
                height="20"
                rx="4"
                fill="#f472b6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Composite Items</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Group different items together and sell them as a single item
          </p>
          <Button variant="outline" className="w-full sm:w-auto">
            Enable Now
          </Button>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center h-auto sm:h-80">
          <div className="w-24 h-24 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect
                x="20"
                y="20"
                width="60"
                height="60"
                rx="4"
                fill="#f9a8d4"
              />
              <path d="M30,50 L50,30 L70,50 L50,70 Z" fill="#db2777" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Price Lists</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Tweak your item prices for specific contacts or transactions
          </p>
          <Button variant="outline" className="w-full sm:w-auto">
            Enable Now
          </Button>
        </Card>
      </div>

      {filteredGroups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Item Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2 w-full max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search item groups..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGroups.map((group) => (
                <Card
                  key={group.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-pink-100 rounded-md flex items-center justify-center">
                        <span className="text-lg font-bold text-pink-800">
                          {group.name.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium truncate">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {group.variants} variants
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ItemGroups;
