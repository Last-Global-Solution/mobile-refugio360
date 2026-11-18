# Refúgio 360 Mobile

Aplicativo React Native do Refúgio 360, projeto acadêmico da Global Solution 2026/2 da FIAP. A plataforma busca apoiar cidadãos durante emergências, inicialmente enchentes, por meio de ocorrências, locais seguros, alertas e orientações.

## Estado atual

Este repositório contém o Incremento 2 do mobile:

- shell Expo com TypeScript;
- navegação pública e área principal;
- oito áreas de tela previstas no escopo;
- tema e componentes de estado reutilizáveis;
- cadastro e login integrados à API Java;
- sessão JWT persistida com Expo SecureStore;
- restauração da sessão validada por `/api/auth/me`;
- logout local e tratamento global de expiração;
- clientes Java autenticado e .NET público isolados;
- testes automatizados da autenticação e da sessão.

O CRUD e as consultas de domínio ainda não estão implementados. Em desenvolvimento, o botão de visualização abre a área principal sem criar sessão e sem liberar operações protegidas.

## Tecnologias

- Expo SDK 58
- React Native 0.88
- React 19
- TypeScript 6 em modo estrito
- React Navigation 7
- Axios
- React Native Safe Area Context
- Expo SecureStore
- ESLint e Prettier

## Estrutura

```text
src/
  api/          clientes HTTP Java e .NET
  components/   componentes visuais reutilizáveis
  config/       configuração centralizada de ambiente
  features/     telas organizadas por funcionalidade
  navigation/   stacks, abas e tipos de navegação
  session/      contexto e armazenamento seguro de sessão
  theme/        cores, espaçamentos, tipografia e tema de navegação
  types/        tipos compartilhados
  utils/        normalização de erros e utilitários
```

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Expo Go compatível com SDK 58 ou emulador Android/iOS configurado

O projeto foi instalado inicialmente com Node.js 24.14.0 e npm 11.9.0.

## Instalação

```bash
npm install
cp .env.example .env
```

Edite `.env` com URLs alcançáveis pelo dispositivo. O arquivo não deve conter credenciais e não é versionado.

## Configuração das APIs

```dotenv
EXPO_PUBLIC_JAVA_API_URL=https://java-api.exemplo.com
EXPO_PUBLIC_DOTNET_API_URL=https://dotnet-api.exemplo.com
```

- A API Java será usada para autenticação, usuários, ocorrências, locais seguros, pontos de risco e orientações.
- A API .NET será usada somente para alertas públicos.
- O cliente .NET não recebe o token da sessão Java.
- Não use `localhost` como URL para aparelho físico. Em desenvolvimento local, use um endereço de rede acessível pelo dispositivo ou o endereço apropriado do emulador.
- Prefira HTTPS em ambientes compartilhados e publicados.

`EXPO_PUBLIC_JAVA_API_URL` é obrigatória para cadastro, login e restauração da sessão. A URL .NET poderá permanecer ausente até a integração de alertas. A tela de perfil mostra se cada URL foi configurada.

## Autenticação

Contratos utilizados:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Cadastro e login enviam somente `email` e `senha`. A resposta contém o JWT, sua expiração e o perfil do usuário. A senha nunca é persistida pelo aplicativo.

Para testar manualmente:

1. Configure `EXPO_PUBLIC_JAVA_API_URL` com uma API Java alcançável pelo dispositivo.
2. Inicie o Expo com `npm start`.
3. Crie uma conta com e-mail válido e senha entre 8 e 72 caracteres.
4. Confirme a entrada automática na área principal.
5. Feche e reabra o aplicativo para validar a restauração via `/api/auth/me`.
6. Use a tela Perfil para encerrar a sessão.

O JWT local dura uma hora. O aplicativo salva `accessToken` e `expiresAt` no SecureStore, rejeita localmente tokens expirados e confirma tokens válidos em `/api/auth/me`. Como o backend não oferece refresh token, uma sessão expirada retorna o usuário ao login.

O interceptor adiciona Bearer somente às chamadas Java protegidas. Login e cadastro não recebem token, e o cliente público .NET nunca recebe a credencial Java.

## Execução

```bash
npm start
npm run android
npm run ios
npm run web
```

O comando para iOS requer macOS e Xcode. O suporte web pode exigir dependências adicionais do Expo e não é o alvo principal deste incremento.

## Qualidade

```bash
npm run typecheck
npm run lint
npm test
npm run format:check
npm run format
```

Os testes usam Jest e Axios Mock Adapter. Eles não dependem de credenciais, rede ou serviços externos.

## Navegação

Área pública:

- Login
- Cadastro
- Sobre

Área principal:

- Início
- Minhas ocorrências
- Locais seguros
- Alertas
- Perfil
- Sobre

A sessão autenticada troca automaticamente o fluxo público pela área principal. Durante a restauração, uma tela de carregamento impede flashes de conteúdo protegido. O modo de visualização permanece disponível somente em desenvolvimento.

## Limitações

- Não existe refresh token.
- O logout é local; um token copiado continua válido no servidor até expirar.
- Não há recuperação ou alteração de senha.
- Não há edição de perfil.
- Não há CRUD de ocorrências.
- As telas de dados exibem estados informativos, não mocks.
- Não há detalhes de ocorrência, local ou alerta neste incremento.
- Não há configuração do Firebase App Distribution.
- O aplicativo ainda não foi validado em aparelho físico.

## Próximos passos

1. Implementar listagem paginada e detalhe das próprias ocorrências.
2. Implementar criação de ocorrência com bloqueio de submissão duplicada.
3. Conectar edição e exclusão quando as permissões Java estiverem prontas.
4. Conectar locais seguros e alertas públicos.
5. Preparar build Android e Firebase App Distribution.
