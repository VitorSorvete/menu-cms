# Menu CMS

Sistema de gerenciamento de cardápio desenvolvido como projeto acadêmico.

## Sobre o projeto

O Menu CMS permite gerenciar os principais recursos de um estabelecimento, facilitando o controle de produtos, categorias, mesas, comandas e pedidos.

## Funcionalidades

- **Categorias:** cadastro, edição e exclusão de categorias.
- **Produtos:** cadastro, edição, exclusão e filtro por categoria.
- **Mesas:** cadastro, edição e controle de mesas ativas e inativas.
- **Comandas:** visualização e fechamento de comandas abertas.
- **Pedidos:** visualização dos pedidos e atualização de status.

## Tecnologias utilizadas

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Axios

### Backend
- NestJS
- TypeScript
- TypeORM
- PostgreSQL

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/VitorSorvete/menu-cms.git
```

### 2. Acessar a pasta

```bash
cd menu-cms
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do frontend com:

```env
VITE_API_URL=http://localhost:3000
```

### 5. Executar o frontend

```bash
npm run dev
```

O backend também precisa estar configurado e em execução para que o sistema funcione corretamente.

## Autor

Desenvolvido por Vitor Moreira.