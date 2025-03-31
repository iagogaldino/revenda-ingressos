
# Documentação do Frontend - Sistema de Venda de Ingressos

## Visão Geral
Este projeto é um sistema de venda de ingressos desenvolvido em Angular. Abaixo está a documentação detalhada de cada componente e suas funcionalidades.

## Componentes

### AppComponent
- **Função**: Componente raiz da aplicação
- **Responsabilidades**: 
  - Gerencia o layout principal
  - Provê a estrutura base para navegação

### HomeComponent
- **Função**: Página inicial da aplicação
- **Responsabilidades**:
  - Exibe eventos em destaque
  - Apresenta seção de boas-vindas
  - Fornece acesso rápido à lista de eventos

### TicketListComponent
- **Função**: Exibe lista de ingressos disponíveis
- **Responsabilidades**:
  - Lista todos os ingressos disponíveis
  - Integra com TicketFilterComponent para filtrar resultados
  - Renderiza TicketCardComponent para cada ingresso

### TicketCardComponent
- **Função**: Card individual de ingresso
- **Responsabilidades**:
  - Exibe informações do ingresso (preço, data, local)
  - Calcula e mostra descontos
  - Manipula interações do usuário (compra)
  - Gera avaliação em estrelas
  - Trata erros de carregamento de imagem

### TicketDetailComponent
- **Função**: Página de detalhes do ingresso
- **Responsabilidades**:
  - Mostra informações detalhadas do evento
  - Exibe local e data do evento
  - Permite compra do ingresso

### TicketFilterComponent
- **Função**: Filtro de busca de ingressos
- **Responsabilidades**:
  - Filtra ingressos por categoria
  - Permite busca por faixa de preço
  - Fornece filtros personalizados

### PurchaseModalComponent
- **Função**: Modal de compra de ingresso
- **Responsabilidades**:
  - Exibe detalhes da compra
  - Gera QR Code para o ingresso
  - Implementa contador regressivo após geração do QR Code
  - Gerencia estado da transação
  - Controla fluxo de exibição do timer

### AboutComponent
- **Função**: Página sobre a plataforma
- **Responsabilidades**:
  - Apresenta informações sobre o sistema
  - Exibe políticas e termos de uso

## Funcionalidades Principais

### Sistema de QR Code
- Geração dinâmica de QR Code para cada ingresso
- Timer regressivo para conclusão da compra
- Validação de dados do ingresso

### Sistema de Filtros
- Busca por categoria
- Filtro por preço
- Ordenação de resultados

### Gestão de Compras
- Modal interativo
- Validação de dados
- Timer para conclusão da transação

## Tecnologias Utilizadas
- Angular 19.2.4
- Bootstrap 5.3.3
- NgBootstrap 18.0.0
- QRCode
