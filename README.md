# Refúgio 360 Mobile

Aplicativo React Native do Refúgio 360, projeto acadêmico da Global Solution 2026/2 da FIAP. A plataforma busca apoiar cidadãos durante emergências, inicialmente enchentes, por meio de ocorrências, locais seguros, alertas e orientações.

## Estado atual

Este repositório contém o Incremento 1 do mobile:

- shell Expo com TypeScript;
- navegação pública e área principal;
- oito áreas de tela previstas no escopo;
- tema e componentes de estado reutilizáveis;
- clientes HTTP preparados, ainda sem chamadas;
- armazenamento seguro preparado, ainda sem sessão real.

Autenticação, CRUD e consumo das APIs ainda não estão implementados. O botão de visualização da tela de login abre a área principal em um modo explicitamente identificado, sem criar usuário ou sessão fictícia.

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

O aplicativo inicia sem essas variáveis porque não realiza chamadas neste incremento. A tela de perfil mostra se cada URL foi configurada.

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
npm run format:check
npm run format
```

Não há biblioteca ou suíte de testes automatizados neste incremento. A estrutura por features e os componentes sem dependência das APIs permitem adicionar testes quando os primeiros fluxos de negócio forem implementados.

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

A troca entre as áreas usa atualmente o modo de visualização. A futura sessão autenticada substituirá essa transição sem alterar a estrutura dos navegadores.

## Limitações

- Login e cadastro não enviam dados.
- Não há token, usuário autenticado ou logout de servidor.
- Não existem chamadas às APIs.
- Não há CRUD de ocorrências.
- As telas de dados exibem estados informativos, não mocks.
- Não há detalhes de ocorrência, local ou alerta neste incremento.
- Não há testes automatizados nem configuração do Firebase App Distribution.
- O aplicativo ainda não foi validado em aparelho físico.

## Próximos passos

1. Implementar cadastro e login pela API Java.
2. Persistir o JWT com SecureStore e restaurar a sessão via `/api/auth/me`.
3. Adicionar o token somente ao cliente Java.
4. Implementar listagem, criação e detalhe de ocorrências.
5. Conectar locais seguros e alertas públicos.
6. Preparar build Android e Firebase App Distribution.
