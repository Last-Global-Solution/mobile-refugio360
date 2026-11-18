# Convenções do Refúgio 360 Mobile

## Escopo

- Este repositório contém somente o aplicativo React Native.
- Não altere os repositórios Java ou .NET a partir daqui.
- Não invente endpoints, campos ou estados. Confira os contratos reais dos backends antes de integrar.
- Preserve o foco no MVP acadêmico e evite abstrações sem uso concreto.

## Arquitetura

- Organize telas por funcionalidade em `src/features`.
- Mantenha navegação e seus tipos em `src/navigation`.
- Coloque clientes e funções HTTP em `src/api`.
- Centralize URLs e configuração em `src/config`.
- Centralize tokens visuais em `src/theme`; não replique cores e espaçamentos nas telas.
- Use `src/session` para token e perfil. Nunca armazene senha.
- Tipos compartilhados pertencem a `src/types`; tipos locais devem permanecer próximos ao uso.
- Prefira componentes pequenos e reutilizáveis apenas quando houver repetição real.

## Integração HTTP

- `javaClient` atende recursos Java autenticados e públicos.
- `dotnetPublicClient` atende somente alertas públicos.
- Nunca adicione o token Java ao cliente .NET.
- Leia URLs apenas de `EXPO_PUBLIC_JAVA_API_URL` e `EXPO_PUBLIC_DOTNET_API_URL`.
- Não fixe `localhost`, IPs ou URLs de produção no código.
- Trate os contratos Java paginados por `content`; endpoints públicos .NET retornam arrays.
- Preserve timeouts e normalize falhas de rede antes de apresentá-las ao usuário.

## Sessão

- Armazene o JWT exclusivamente com Expo SecureStore.
- Restaure a sessão validando o token com a API, não apenas pela presença local.
- Em `401`, encerre a sessão e volte ao login.
- Não implemente refresh token enquanto o backend não oferecer esse contrato.
- Logout local deve apagar token, perfil, caches privados e estado de navegação.

## Interface

- Toda tela remota deve tratar loading, erro, vazio e refresh.
- Toda mutação deve tratar submitting e impedir toques duplicados.
- Use áreas de toque com pelo menos 44 pontos.
- Mantenha contraste, rótulos de acessibilidade e mensagens em português claro.
- Não apresente dados fictícios como se viessem das APIs.
- Não remova o aviso de que o aplicativo não substitui canais oficiais de emergência.

## Qualidade

- Mantenha TypeScript estrito e evite `any`.
- Execute `npm run typecheck`, `npm run lint` e `npm run format:check` antes de concluir alterações.
- Use `npx expo install` para dependências nativas compatíveis com o SDK atual.
- Não adicione Redux, bibliotecas de formulário, cache remoto ou testes sem uma necessidade do incremento.
- Não versione `.env`, credenciais, tokens, keystores ou arquivos de assinatura.
- Atualize o README quando comandos, variáveis ou arquitetura mudarem.
