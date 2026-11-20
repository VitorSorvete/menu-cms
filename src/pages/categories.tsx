import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { useCategories, useDeleteCategory } from "../cases/categories/hooks/use-category";
import { CategoryForm } from "../cases/categories/components/category-form";
import type { CategoryDTO } from "../cases/categories/dtos/category.dto";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();
  const deleteCategory = useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | undefined>();

  function handleNew() {
    setSelectedCategory(undefined);
    setOpen(true);
  }

  function handleEdit(category: CategoryDTO) {
    setSelectedCategory(category);
    setOpen(true);
  }

  function handleDelete(id: string) {
    if (window.confirm("Deseja realmente excluir esta categoria?")) {
      deleteCategory.mutate(id);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as categorias dos produtos.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nova categoria
          </Button>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCategory ? "Editar categoria" : "Nova categoria"}
              </DialogTitle>
            </DialogHeader>

            <CategoryForm
              category={selectedCategory}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p>Carregando categorias...</p>}

      {isError && (
        <p className="text-sm text-red-500">
          Erro ao carregar categorias.
        </p>
      )}

      {!isLoading && !isError && categories?.length === 0 && (
        <p>Nenhuma categoria cadastrada.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{category.name}</CardTitle>

              <span className="text-sm text-muted-foreground">
                {category.active ? "Ativa" : "Inativa"}
              </span>
            </CardHeader>

            <CardContent className="flex items-center justify-between">
              {category.icon ? (
                <img
                  src={category.icon}
                  alt={category.name}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <span className="text-sm text-muted-foreground">
                  Sem ícone
                </span>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(category.id)}
                  disabled={deleteCategory.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}