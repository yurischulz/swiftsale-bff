# Padrão de Testes Unitários - SwiftSale BFF

## Estrutura Geral

- **Use `jest.mock`** para mockar dependências externas (ex: models do Mongoose).
- **Cubra cenários de sucesso e erro** para cada função da service.
- **Limpe os mocks** usando `jest.clearAllMocks()` no `afterEach`.
- **Estruture os testes** em blocos `describe` por função e `it` por cenário.
- **Garanta cobertura total**: teste branches de erro, listas vazias, etc.
- **Verifique chamadas dos mocks** com `expect`.

---

## Exemplo de Mock para Models

```typescript
jest.mock('~/models/Model', () => {
  const mockSave = jest.fn();
  const mockFind = jest.fn();
  const mockFindByIdAndUpdate = jest.fn();
  const mockFindByIdAndDelete = jest.fn();

  // Suporte a métodos estáticos e instância
  const Model = jest.fn().mockImplementation(() => ({
    save: mockSave,
  }));

  Model.find = mockFind;
  Model.findByIdAndUpdate = mockFindByIdAndUpdate;
  Model.findByIdAndDelete = mockFindByIdAndDelete;

  return { Model };
});
```

## Estrutura Recomendada de Teste

```typescript
describe('NomeDaService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('nomeDaFuncao', () => {
    it('deve fazer algo em caso de sucesso', async () => {
      // Arrange
      // Mock do método necessário

      // Act
      // Chamada da função

      // Assert
      // Verificações com expect
    });

    it('deve tratar erro corretamente', async () => {
      // Arrange
      // Mock para lançar erro

      // Act & Assert
      await expect(nomeDaFuncao(...)).rejects.toThrow('mensagem de erro');
    });
  });
});
```

## Boas Práticas

- Sempre cubra todos os fluxos possíveis (sucesso, erro, listas vazias, etc).
- Use nomes descritivos para os testes.
- Prefira mocks explícitos a mocks globais.
- Garanta que todos os métodos mockados sejam verificados com expect.

## Observação

Este padrão deve ser seguido para todos os testes unitários de services, controllers e utils do projeto.
