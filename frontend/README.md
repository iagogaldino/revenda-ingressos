
# Sistema de Venda de Ingressos - Frontend

## Visão Geral
Este é o frontend de um sistema de venda de ingressos desenvolvido em Angular 19. O sistema permite que usuários comprem e vendam ingressos para diversos tipos de eventos.

## Tecnologias Utilizadas
- Angular 19.2.4
- Bootstrap 5.3.3
- NgBootstrap 18.0.0
- TypeScript 5.8.2

## Estrutura de Componentes

### TicketCreateComponent
- **Função**: Criação de novos ingressos
- **Responsabilidades**:
  - Formulário para cadastro de ingressos
  - Validação de campos obrigatórios
  - Upload de imagens
  - Integração com backend para salvar ingressos

### ProfileComponent
- **Função**: Gerenciamento do perfil do usuário
- **Responsabilidades**:
  - Exibição de informações do usuário
  - Lista de ingressos do usuário
  - Funcionalidade de logout
  - Criação de novos ingressos via modal

### PurchaseModalComponent
- **Função**: Modal para finalização de compra
- **Responsabilidades**: 
  - Exibição dos detalhes do ingresso
  - Geração de QR Code para pagamento
  - Timer para conclusão da compra
  - Informações do evento e preço

## Serviços

### AuthService
- **Função**: Gerenciamento de autenticação
- **Responsabilidades**:
  - Armazenamento do token JWT
  - Controle de sessão do usuário
  - Login/Logout

### TicketService
- **Função**: Gerenciamento de ingressos
- **Responsabilidades**:
  - CRUD de ingressos
  - Listagem de ingressos do usuário
  - Filtros e categorização

## Características Principais

### Autenticação
- Sistema de login/registro
- Proteção de rotas
- Gerenciamento de token JWT

### Gestão de Ingressos
- Criação de ingressos
- Listagem com filtros
- Detalhes do evento
- Sistema de compra com QR Code

### Interface Responsiva
- Design mobile-first
- Compatibilidade com diferentes dispositivos
- Componentes Bootstrap para melhor UX

## Como Executar

1. Instale as dependências:
```bash
cd frontend
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
ng serve --host 0.0.0.0 --port 4200 --disable-host-check
```

O frontend estará disponível em `http://0.0.0.0:4200`

## Estrutura de Arquivos
```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   ├── assets/
│   └── styles/
└── package.json
```
