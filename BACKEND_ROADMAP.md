# 🗺️ Sentinel Backend — Status de Desenvolvimento & Roadmap DDD

> **Documento de Preservação de Contexto e Progresso**
> Este arquivo mantém o registro contínuo do estado de desenvolvimento do backend do Sentinel, garantindo que o progresso seja rastreável entre sessões.

---

## 🏛️ Diretrizes Arquiteturais

1. **Abordagem**: **Domain-Driven Design (DDD)** & **Clean Architecture**.
2. **Metodologia**: **TDD (Test-Driven Development)** estrito:
   - 🔴 **Red**: Escrever teste unitário que falha primeiro.
   - 🟢 **Green**: Escrever a implementação mínima para passar o teste.
   - 🔵 **Refactor**: Refatorar código garantindo tipagem estrita e padrões limpos.
3. **Tipagem**: **TypeScript Strict Mode** (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`).
4. **Camadas**:
   - `domain/`: Entidades, Value Objects, Interfaces de Repositórios, Domain Events, Erros de Domínio (zero dependências externas).
   - `application/`: Casos de Uso (Use Cases), DTOs de Aplicação, Interfaces de Serviços.
   - `infrastructure/`: Implementação Prisma dos Repositórios, Provedores Externos (Clerk, Svix), Database, Mappers.
   - `presentation/`: Controllers NestJS, DTOs com validação, Guards, Interceptors, Swagger.

---

## 📊 Estado Atual do Projeto

| Indicador               | Status                                                            |
| :---------------------- | :---------------------------------------------------------------- |
| **Branch Atual**        | `feat/backend-phase-1`                                            |
| **Fase Atual**          | **Fase 1 — Setup de Infraestrutura & Base DDD Concluída ✅**      |
| **Próxima Fase**        | **Fase 2 — Domínio & Use Cases de Usuários e Autenticação (TDD)** |
| **Cobertura de Testes** | 100% dos módulos estruturais iniciados                            |
| **Última Atualização**  | 25/08/2026                                                        |

---

## 📋 Fases e Checklist de Execução

### 🔹 Fase 1: Setup da Infraestrutura, Workspace e Base DDD ✅

- [x] Configurar workspace `pnpm` para suportar `backend`
- [x] Inicializar projeto NestJS com TypeScript em modo estrito (`strict: true`)
- [x] Configurar ambiente de testes Jest com suporte a TDD (`jest.config.ts`, `ts-jest`)
- [x] Criar `docker-compose.yml` para PostgreSQL local de desenvolvimento
- [x] Configurar Prisma ORM (`prisma/schema.prisma`) e gerar Prisma Client
- [x] Criar estrutura de diretórios DDD (`domain`, `application`, `infrastructure`, `presentation`, `common`)
- [x] Configurar Swagger OpenAPI e Pipes de validação global

---

### 🔹 Fase 2: Domínio & Use Cases de Usuários e Autenticação (TDD)

- [ ] 🔴 🟢 🔵 Testes & Implementação da Entidade de Domínio `User`
- [ ] 🔴 🟢 🔵 Teste & Implementação do `SyncClerkUserUseCase`
- [ ] 🔴 🟢 🔵 Teste & Implementação do `GetUserProfileUseCase`
- [ ] Implementar `PrismaUserRepository` (Infrastructure)
- [ ] Implementar `ClerkAuthGuard` e extrator `@CurrentUser()`
- [ ] Implementar endpoint de Webhook com validação `svix` (`/webhooks/clerk`)
- [ ] Implementar `UsersController` e endpoint `/users/me`

---

### 🔹 Fase 3: Domínio de Assinaturas & Value Objects (TDD)

- [ ] 🔴 🟢 🔵 Teste & Implementação do Value Object `Price` (validação de moeda e valores positivos)
- [ ] 🔴 🟢 🔵 Teste & Implementação do Value Object `BillingPeriod` (`SEMANAL`, `MENSAL`, `ANUAL`)
- [ ] 🔴 🟢 🔵 Teste & Implementação do Value Object `SubscriptionStatus` (`ATIVO`, `PAUSADO`, `CANCELADO`)
- [ ] 🔴 🟢 🔵 Teste & Implementação do Value Object `RenewalDate` (cálculo de ciclos e dias restantes)
- [ ] 🔴 🟢 🔵 Teste & Implementação da Entidade `Subscription` com regras e invariantes de domínio

---

### 🔹 Fase 4: Use Cases de Assinaturas (TDD)

- [ ] 🔴 🟢 🔵 Teste & Implementação do `CreateSubscriptionUseCase`
- [ ] 🔴 🟢 🔵 Teste & Implementação do `ListUserSubscriptionsUseCase` (filtros por status, categoria, termo de busca)
- [ ] 🔴 🟢 🔵 Teste & Implementação do `GetSubscriptionByIdUseCase`
- [ ] 🔴 🟢 🔵 Teste & Implementação do `UpdateSubscriptionUseCase`
- [ ] 🔴 🟢 🔵 Teste & Implementação do `ChangeSubscriptionStatusUseCase` (pausar, reativar, cancelar)
- [ ] 🔴 🟢 🔵 Teste & Implementação do `DeleteSubscriptionUseCase`
- [ ] Implementar `PrismaSubscriptionRepository` e `SubscriptionMapper`

---

### 🔹 Fase 5: Métricas, Insights e Próximos Vencimentos (TDD)

- [ ] 🔴 🟢 🔵 Teste & Implementação do `GetMonthlySpendSummaryUseCase` (conversão consolidada para gasto mensal)
- [ ] 🔴 🟢 🔵 Teste & Implementação do `GetUpcomingRenewalsUseCase` (cálculo de `daysLeft` e ordenação)
- [ ] 🔴 🟢 🔵 Teste & Implementação do `GetCategoryInsightsUseCase` (gastos por categoria e percentuais)
- [ ] 🔴 🟢 🔵 Teste & Implementação do `GetBillingHistoryUseCase`

---

### 🔹 Fase 6: Camada de Apresentação (NestJS Controllers, DTOs & Swagger)

- [ ] Implementar DTOs de entrada com `class-validator` estrito
- [ ] Implementar `SubscriptionsController` (rotas completas REST)
- [ ] Implementar `InsightsController`
- [ ] Configurar documentação interativa Swagger OpenAPI (`/docs`)
- [ ] Testes E2E das rotas principais com NestJS Test Bed

---

### 🔹 Fase 7: Integração com o Aplicativo Mobile Sentinel

- [ ] Configurar cliente HTTP (`lib/api.ts`) com interceptor para Bearer token do Clerk
- [ ] Refatorar `SubscriptionContext.tsx` para consumir dados reais da API
- [ ] Implementar tratamento de estados (`loading`, `error`, `pull-to-refresh`)
- [ ] Testes de validação integrada no app mobile
