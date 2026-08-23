---
name: git-workflow
description: >-
  Instruções e padrões para inspecionar alterações, gerar commits semânticos
  (Conventional Commits), gerenciar branches e abrir Pull Requests detalhados via GitHub CLI (gh).
---

# Git & Pull Request Workflow

Esta skill define as diretrizes e procedimentos para inspecionar alterações, criar commits atômicos e abrir Pull Requests de qualidade.

---

## 1. Verificação e Criação de Commits

### Checklist pré-commit
1. Execute `git status` e `git diff` para revisar com precisão o que foi alterado.
2. Certifique-se de não commitar arquivos temporários, segredos (`.env`), chaves de API, logs ou pastas de build (`dist/`, `build/`, `.expo/`, etc.).
3. Garanta que o projeto esteja compilando e que linters/testes relevantes não estejam quebrados.

### Padrão de Mensagem (Conventional Commits)
Utilize o padrão: `<tipo>(<escopo opcional>): <descrição no imperativo/presente>`

Tipos permitidos:
- `feat`: Nova funcionalidade para o usuário ou sistema.
- `fix`: Correção de bug.
- `refactor`: Refatoração de código sem alteração de comportamento externo.
- `perf`: Melhoria de performance.
- `docs`: Atualizações ou adições na documentação.
- `style`: Ajustes de formatação, linting, imports ou espaçamento (sem mudança de lógica).
- `test`: Criação ou ajuste de testes automatizados.
- `chore`: Atualização de dependências, scripts de build ou configurações gerais.

Exemplo de commit:
```bash
git add <arquivos-específicos>
git commit -m "feat(auth): adicionar suporte a login biométrico com expo-local-authentication"
```

---

## 2. Gerenciamento de Branches

- Crie branches a partir da branch base atualizada (`main` / `develop`):
  ```bash
  git checkout -b <tipo>/<nome-da-feature-ou-fix>
  ```
  Exemplos:
  - `feat/biometric-auth`
  - `fix/camera-permission-crash`
  - `refactor/navigation-flow`

---

## 3. Criação de Pull Requests (usando GitHub CLI `gh`)

Ao finalizar uma tarefa e ter os commits organizados:

1. **Enviar as alterações para o repositório remoto**:
   ```bash
   git push -u origin HEAD
   ```

2. **Criar o Pull Request**:
   Use o comando `gh pr create` estruturado com título e descrição markdown:
   ```bash
   gh pr create --title "feat(auth): suporte a autenticação biométrica" --body "## 📌 Descrição
   Breve resumo das alterações e objetivo do Pull Request.

   ## 🛠️ Alterações Realizadas
   - Implementado fluxo de verificação biométrica.
   - Adicionado fallback para autenticação por senha.
   - Tratados erros de hardware não suportado.

   ## 🧪 Como Testar
   1. Abrir a tela de login.
   2. Acionar a validação biométrica.
   3. Simular sucesso e falha de leitura.

   ## ⚠️ Breaking Changes / Observações
   - Nenhuma.
   "
   ```

3. **Verificar status do PR**:
   ```bash
   gh pr view
   ```
