import StringScrambler from '../StringScrambler';

describe('StringScrambler', () => {
  let scrambler;

  beforeEach(() => {
    scrambler = new StringScrambler();
  });

  afterEach(() => {
    scrambler.stop(); // Garante que nenhuma animação fique ativa
  });

  test('should interpolate strings in "random" mode', () => {
    const mockUpdate = jest.fn();

    scrambler.scramble({
      start: 'ABC',
      end: 'XYZ',
      duration: 100,
      onUpdate: mockUpdate,
      mode: 'random',
    });

    // Simula o progresso da animação
    setTimeout(() => {
      expect(mockUpdate).toHaveBeenCalled();
      const updates = mockUpdate.mock.calls.map((call) => call[0]);
      updates.forEach((update) => {
        expect(update.length).toBe(3); // Deve manter o comprimento da string
      });
    }, 150);
  });

  test('should interpolate strings in "sequential" mode', () => {
    const mockUpdate = jest.fn();

    scrambler.scramble({
      start: 'HELLO',
      end: 'WORLD',
      duration: 100,
      onUpdate: mockUpdate,
      mode: 'sequential',
    });

    setTimeout(() => {
      expect(mockUpdate).toHaveBeenCalled();
      const updates = mockUpdate.mock.calls.map((call) => call[0]);
      expect(updates[updates.length - 1]).toBe('WORLD'); // Verifica o resultado final
    }, 150);
  });

  test('should interpolate strings in "wave" mode', () => {
    const mockUpdate = jest.fn();

    scrambler.scramble({
      start: 'HELLO',
      end: 'WORLD',
      duration: 200,
      onUpdate: mockUpdate,
      mode: 'wave',
    });

    setTimeout(() => {
      expect(mockUpdate).toHaveBeenCalled();
      const updates = mockUpdate.mock.calls.map((call) => call[0]);
      updates.forEach((update) => {
        expect(update.length).toBe(5); // O comprimento da string deve permanecer constante
      });
    }, 250);
  });

  test('should handle empty strings gracefully', () => {
    const mockUpdate = jest.fn();

    scrambler.scramble({
      start: '',
      end: 'XYZ',
      duration: 100,
      onUpdate: mockUpdate,
      mode: 'random',
    });

    setTimeout(() => {
      expect(mockUpdate).toHaveBeenCalled();
      const updates = mockUpdate.mock.calls.map((call) => call[0]);
      updates.forEach((update) => {
        expect(update.length).toBe(3); // Deve gerar a string final corretamente
      });
    }, 150);
  });

  test('should handle characters outside default set', () => {
    const mockUpdate = jest.fn();

    scrambler.scramble({
      start: '123',
      end: '@#$',
      duration: 100,
      onUpdate: mockUpdate,
      characters: '@#$%^&*',
      mode: 'random',
    });

    setTimeout(() => {
      expect(mockUpdate).toHaveBeenCalled();
      const updates = mockUpdate.mock.calls.map((call) => call[0]);
      updates.forEach((update) => {
        update.split('').forEach((char) => {
          expect('@#$%^&*').toContain(char); // Verifica caracteres embaralhados
        });
      });
    }, 150);
  });

  test('should stop animation when stop is called', () => {
    const mockUpdate = jest.fn();

    scrambler.scramble({
      start: 'STOP',
      end: 'DONE',
      duration: 500,
      onUpdate: mockUpdate,
    });

    scrambler.stop();

    setTimeout(() => {
      expect(mockUpdate).not.toHaveBeenCalled();
    }, 100);
  });

  test('should loop animation if loop is true', () => {
    const mockUpdate = jest.fn();
    let loopCount = 0;

    scrambler.scramble({
      start: 'LOOP',
      end: 'BACK',
      duration: 100,
      onUpdate: () => {
        loopCount++;
      },
      loop: true,
    });

    setTimeout(() => {
      expect(loopCount).toBeGreaterThan(1); // Deve ter chamado mais de uma vez
      scrambler.stop();
    }, 500);
  });
});
