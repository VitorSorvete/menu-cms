import { useState } from "react";

import { CategoriesPage } from "./pages/categories";
import { ProductsPage } from "./pages/products";
import { GuestChecksPage } from "./pages/guest-checks";
import { SpotsPage } from "./pages/spots";
import { OrdersPage } from "./pages/orders";

type Page =
  | "categorias"
  | "produtos"
  | "mesas"
  | "comandas"
  | "pedidos";

function App() {
  const [page, setPage] = useState<Page>("mesas");

  const buttonClass = (currentPage: Page) =>
    `rounded-md px-4 py-2 text-sm font-medium ${
      page === currentPage
        ? "bg-black text-white"
        : "border hover:bg-muted"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold">Menu CMS</h1>

          <nav className="flex flex-wrap gap-2">
            <button
              onClick={() => setPage("categorias")}
              className={buttonClass("categorias")}
            >
              Categorias
            </button>

            <button
              onClick={() => setPage("produtos")}
              className={buttonClass("produtos")}
            >
              Produtos
            </button>

            <button
              onClick={() => setPage("mesas")}
              className={buttonClass("mesas")}
            >
              Mesas
            </button>

            <button
              onClick={() => setPage("comandas")}
              className={buttonClass("comandas")}
            >
              Comandas
            </button>

            <button
              onClick={() => setPage("pedidos")}
              className={buttonClass("pedidos")}
            >
              Pedidos
            </button>
          </nav>
        </div>
      </header>

      <main>
        {page === "categorias" && <CategoriesPage />}
        {page === "produtos" && <ProductsPage />}
        {page === "mesas" && <SpotsPage />}
        {page === "comandas" && <GuestChecksPage />}
        {page === "pedidos" && <OrdersPage />}
      </main>
    </div>
  );
}

export default App;