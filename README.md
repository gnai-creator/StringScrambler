# StringScrambler (SS)

**StringScrambler** é uma biblioteca JavaScript leve e flexível para criar transições dinâmicas entre strings com efeitos de scrambling. Ideal para animações em interfaces de usuário, efeitos visuais de texto e muito mais.

## ✨ Funcionalidades

- **Transições Dinâmicas**: Interpole entre duas strings com efeitos suaves.
- **Modos de Animação**:
  - `random`: Caracteres aleatórios durante a transição.
  - `sequential`: Alterações progressivas, caractere por caractere.
  - `wave`: Efeito de onda durante o scrambling.
- **Configurações Customizáveis**:
  - Duração da animação.
  - Tipos de easing (`linear`, `ease-in`, `ease-out`).
  - Conjunto de caracteres embaralháveis definidos pelo usuário.
- **Loop e Reverso**: Execute animações contínuas ou reverter automaticamente.

## 📦 Instalação

Via **npm**:

```bash
npm install string-scrambler
```

Ou, inclua diretamente no HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/string-scrambler/dist/StringScrambler.min.js"></script>
```

## 🚀 Como Usar

### Usando JavaScript Puro

```javascript
import StringScrambler from 'string-scrambler';

const scrambler = new StringScrambler();

scrambler.scramble({
  start: 'HELLO',
  end: 'WORLD',
  duration: 2000,
  mode: 'wave',
  onUpdate: (value) => console.log(value), // Atualiza a cada frame
  onComplete: () => console.log('Animação completa!'),
});
```

### Usando com React

```javascript
import React, { useEffect, useState } from 'react';
import StringScrambler from 'string-scrambler';

const ScrambleText = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    const scrambler = new StringScrambler();
    scrambler.scramble({
      start: 'Welcome',
      end: 'React Rocks!',
      duration: 3000,
      mode: 'sequential',
      onUpdate: setText,
    });

    return () => scrambler.stop(); // Limpa a animação ao desmontar o componente
  }, []);

  return <h1>{text}</h1>;
};

export default ScrambleText;
```

## ⚙️ Configurações Disponíveis

| Opção         | Tipo        | Padrão            | Descrição                                                     |
|---------------|-------------|-------------------|---------------------------------------------------------------|
| `start`       | `string`    | `''`              | String inicial da transição.                                  |
| `end`         | `string`    | `''`              | String final da transição.                                    |
| `duration`    | `number`    | `1000`            | Duração da animação em milissegundos.                        |
| `onUpdate`    | `function`  | `undefined`       | Callback chamado em cada frame para atualizar a string.       |
| `onComplete`  | `function`  | `undefined`       | Callback chamado ao final da animação.                        |
| `mode`        | `string`    | `'random'`        | Modo de animação: `random`, `sequential` ou `wave`.           |
| `characters`  | `string`    | `'A-Za-z0-9'`     | Conjunto de caracteres embaralháveis.                         |
| `loop`        | `boolean`   | `false`           | Define se a animação deve ser contínua.                       |
| `ease`        | `string`    | `'linear'`        | Tipo de easing: `linear`, `ease-in`, `ease-out`.              |

## 🛠️ Desenvolvimento

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/StringScrambler.git
cd StringScrambler
npm install
```

### Rodar os Testes

```bash
npm test
```

### Lint e Formatação

```bash
npm run lint
npm run format
```

## 📝 Contribuição

1. Faça um fork do repositório.
2. Crie uma branch para sua funcionalidade: `git checkout -b minha-funcionalidade`.
3. Commit suas mudanças: `git commit -m 'Adiciona minha funcionalidade'`.
4. Envie sua branch: `git push origin minha-funcionalidade`.
5. Abra um Pull Request.

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## 🎉 Agradecimentos

Obrigado por usar o **StringScrambler**! Se tiver dúvidas ou sugestões, sinta-se à vontade para contribuir ou abrir uma issue.
