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
   * @param {number} options.duration - Duração da animação (em ms).
   * @param {function} options.onUpdate - Callback para atualizar a string durante a animação.
   * @param {function} [options.onComplete] - Callback para o término da animação.
   * @param {string} [options.mode] - Modo de scrambling ("random", "sequential", "wave").
   * @param {string} [options.characters] - Conjunto de caracteres permitidos no scrambling.
   * @param {boolean} [options.loop] - Define se a animação será contínua.
   * @param {string} [options.ease] - Tipo de easing ("linear", "ease-in", "ease-out").
   */
  scramble({
    start = "",
    end = "",
    duration = 1000,
    onUpdate,
    onComplete,
    mode = "random",
    characters = this.defaultCharacters,
    loop = false,
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

    const step = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      let progress = Math.min(elapsedTime / duration, 1);
      progress = easing(progress);

      const interpolated = this.interpolateStrings({
        start,
        end,
        progress,
        maxLength,
        mode,
        characters,
      });

      if (onUpdate) onUpdate(interpolated);

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      } else if (loop) {
        this.scramble({ start, end, duration, onUpdate, onComplete, mode, characters, loop, ease });
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
