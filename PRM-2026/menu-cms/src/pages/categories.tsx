import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { useCategories } from "../cases/hooks/use.category";

export function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return <p className="p-6">Carregando categorias...</p>;
  }

  if (isError) {
    return (
      <p className="p-6 text-red-500">
        Erro ao carregar categorias.
      </p>
    );
  }

  return (
    <main className="min-h-screen bg-muted/40 p-8">
      <div className="mx-auto max-w-6xl space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categorias</h1>
            <p className="text-muted-foreground">
              Gerencie as categorias do cardápio.
            </p>
          </div>

          <Button>
            <Plus />
            Nova categoria
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Categorias cadastradas ({categories?.length ?? 0})
            </CardTitle>
          </CardHeader>

          <CardContent>
            {categories?.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                Nenhuma categoria cadastrada.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ícone</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {categories?.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        {category.icon ? (
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={category.active ? "default" : "secondary"}
                        >
                          {category.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" aria-label="Editar categoria">
                            <Pencil />
                          </Button>

                          <Button variant="destructive" size="icon" aria-label="Excluir categoria">
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
