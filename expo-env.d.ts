/// <reference types="expo/types" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPO_PUBLIC_JAVA_API_URL?: string;
    readonly EXPO_PUBLIC_DOTNET_API_URL?: string;
  }
}
