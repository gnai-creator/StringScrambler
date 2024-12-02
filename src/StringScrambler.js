class StringScrambler {
  constructor() {
    this.animationFrame = null; // Controle da animação
    this.defaultCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  }

  /**
   * Inicia a animação de scrambling.
   * @param {Object} options - Configurações da animação.
   * @param {string} options.start - String inicial.
   * @param {string} options.end - String final.
   * @param {number} options.duration - Duração total da animação (em ms).
   * @param {number} [options.swapSpeed] - Velocidade em ms para troca de letras durante a animação.
   * @param {number} [options.pauseDuration] - Tempo de pausa entre loops ou reversões (em ms).
   * @param {function} options.onUpdate - Callback para atualizar a string durante a animação.
   * @param {function} [options.onComplete] - Callback para o término da animação.
   * @param {string} [options.mode] - Modo de scrambling ("random", "sequential", "wave").
   * @param {string} [options.characters] - Conjunto de caracteres permitidos no scrambling.
   * @param {boolean} [options.loop] - Define se a animação será contínua (volta automaticamente).
   * @param {boolean} [options.autoReverse] - Faz loop automático alternando entre `start` e `end`.
   * @param {string} [options.ease] - Tipo de easing ("linear", "ease-in", "ease-out").
   */
  scramble({
    start = "",
    end = "",
    duration = 1000,
    swapSpeed = 50, // Velocidade padrão de troca de letras (em ms)
    pauseDuration = 500, // Pausa padrão entre loops (em ms)
    onUpdate,
    onComplete,
    mode = "random",
    characters = this.defaultCharacters,
    loop = false,
    autoReverse = false,
    ease = "linear",
  }) {
    const startTime = performance.now();
    const maxLength = Math.max(start.length, end.length);

    const easingFunctions = {
      linear: (t) => t,
      "ease-in": (t) => t * t,
      "ease-out": (t) => t * (2 - t),
    };

    const easing = easingFunctions[ease] || easingFunctions.linear;

    let lastSwapTime = 0; // Controle de tempo para trocas de letras

    const step = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      let progress = Math.min(elapsedTime / duration, 1);
      progress = easing(progress);

      // Atualiza letras apenas se passar o tempo de swapSpeed
      if (currentTime - lastSwapTime >= swapSpeed) {
        lastSwapTime = currentTime;

        const interpolated = this.interpolateStrings({
          start,
          end,
          progress,
          maxLength,
          mode,
          characters,
        });

        if (onUpdate) onUpdate(interpolated);
      }

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      } else if (autoReverse) {
        // Alterna entre as strings se autoReverse estiver ativado
        setTimeout(() => {
          this.scramble({
            start: end,
            end: start,
            duration,
            swapSpeed,
            pauseDuration,
            onUpdate,
            onComplete,
            mode,
            characters,
            loop,
            autoReverse,
            ease,
          });
        }, pauseDuration);
      } else if (loop) {
        // Reinicia o loop com uma pausa
        setTimeout(() => {
          this.scramble({
            start,
            end,
            duration,
            swapSpeed,
            pauseDuration,
            onUpdate,
            onComplete,
            mode,
            characters,
            loop,
            ease,
          });
        }, pauseDuration);
      } else if (onComplete) {
        onComplete();
      }
    };

    this.animationFrame = requestAnimationFrame(step);
  }

  /**
   * Interpola as strings com base no progresso e no modo de animação.
   * @param {Object} options - Configurações de interpolação.
   * @param {string} options.start - String inicial.
   * @param {string} options.end - String final.
   * @param {number} options.progress - Progresso atual (0 a 1).
   * @param {number} options.maxLength - Comprimento máximo das strings.
   * @param {string} options.mode - Modo de interpolação ("random", "sequential", "wave").
   * @param {string} options.characters - Conjunto de caracteres embaralháveis.
   * @returns {string} String interpolada.
   */
  interpolateStrings({ start, end, progress, maxLength, mode, characters }) {
    const result = [];

    for (let i = 0; i < maxLength; i++) {
      const startChar = start[i] || " ";
      const endChar = end[i] || " ";

      if (startChar === endChar || progress === 1) {
        result.push(endChar);
        continue;
      }

      if (mode === "random") {
        result.push(this.randomChar(characters));
      } else if (mode === "sequential") {
        const midPoint = Math.floor(maxLength * progress);
        result.push(i <= midPoint ? endChar : this.randomChar(characters));
      } else if (mode === "wave") {
        const waveEffect = Math.sin((i / maxLength + progress) * Math.PI * 2);
        result.push(waveEffect > 0.5 ? endChar : this.randomChar(characters));
      }
    }

    return result.join("");
  }

  /**
   * Gera um caractere aleatório do conjunto fornecido.
   * @param {string} characters - Conjunto de caracteres permitidos.
   * @returns {string} Um caractere aleatório.
   */
  randomChar(characters) {
    const index = Math.floor(Math.random() * characters.length);
    return characters[index];
  }

  /**
   * Cancela a animação atual.
   */
  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
}

export default StringScrambler;

export { StringScrambler };
