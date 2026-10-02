# Título
AuthService com HttpClient

## Data
2026-09-30

## Status
Aceito

## Contexto
O frontend precisa enviar dados de login ao backend, e essa comunicação com a API deve estar centralizada em um ponto único. Isso facilita manutenção, testes e a reutilização da lógica de autenticação.

## Decisão
Foi criado o serviço `AuthService`, que usa `HttpClient` para fazer o `POST` para `http://localhost:8080/api/auth/login`. A chamada HTTP fica no serviço e não diretamente no componente.

Arquivo principal:
- `src/app/services/auth.ts`

Trecho relevante:
```ts
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/auth/login';

  login(login: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, { login, senha });
  }
}
```

## Alternativas consideradas
- Colocar o `HttpClient` diretamente no componente.
- Criar um arquivo separado para cada chamada de API e perder a organização.

## Consequências
Pontos positivos:
- Código mais organizado.
- Facilidade para trocar a API ou testar a camada de serviço.
- Componentes mais focados na interface.

Pontos negativos:
- É mais um arquivo para manter.
- Requer cuidado para não misturar lógica de interface com lógica de acesso à API.

## Explicação para iniciantes
É como ter um atendente especializado na comunicação com a cozinha do restaurante: o cliente conversa com o garçom, e não precisa ir até a cozinha para pedir a comida. O serviço faz essa ponte de forma organizada.
