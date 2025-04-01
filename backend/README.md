
# Backend - Sistema de Venda de Ingressos

## Visão Geral
Backend do sistema de venda de ingressos desenvolvido em TypeScript com Express.js. Fornece APIs para gerenciamento de ingressos e autenticação de usuários.

## Tecnologias
- Node.js
- Express.js
- TypeScript
- Multer (upload de arquivos)
- CORS

## Estrutura do Projeto
```
backend/
├── src/
│   ├── controllers/      # Controladores da aplicação
│   ├── data/            # Dados mock para desenvolvimento
│   ├── routes/          # Definição das rotas
│   ├── types/           # Tipos TypeScript
│   └── server.ts        # Arquivo principal do servidor
├── uploads/             # Pasta para arquivos enviados
└── package.json
```

## APIs Disponíveis

### Saúde da Aplicação
```
GET /api/health
Retorno: { status: 'ok', message: 'Backend is running' }
```

### Ingressos

#### Criar Ingresso
```
POST /api/seller/tickets
Content-Type: multipart/form-data

Campos:
- eventName: string (required)
- category: string (required)
- location: string (required)
- venue: string (required)
- eventDate: string (required)
- price: number (required)
- quantity: number (required)
- file: File (opcional, max 5MB)
```

#### Listar Ingressos
```
GET /api/tickets
Query params:
- category: string
- minPrice: number
- maxPrice: number
```

#### Listar Categorias
```
GET /api/categories
Retorno: string[]
```

#### Ingressos do Vendedor
```
GET /api/seller/tickets
```

## Configuração de Desenvolvimento

1. Instalar dependências:
```bash
npm install
```

2. Iniciar em modo desenvolvimento:
```bash
npm run dev
```

O servidor estará disponível em `http://0.0.0.0:5000`

## Validações
- Campos obrigatórios para criação de ingressos
- Preço e quantidade devem ser positivos
- Limite de arquivo: 5MB
- Tipos de arquivo permitidos: JPG, PNG, PDF

## Observações
- Sistema atual usa dados mock para demonstração
- Implementação de autenticação básica
- Upload de arquivos configurado com multer
- CORS habilitado para desenvolvimento
