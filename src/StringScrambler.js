class StringScrambler {
  constructor() {
    this.animationFrame = null;
    this.defaultCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  }

  scramble({
    start = "",
    end = "",
    duration = 1000,
    swapSpeed = 50,
    initialPause = 500,
    transitionPause = 500,
    onUpdate,
    onComplete,
    mode = "random",
    characters = this.defaultCharacters,
    loop = false,
    autoReverse = false,
    ease = "linear",
  }) {
    this.stop(); // Cancela qualquer animação anterior

    const startTime = performance.now();
    const maxLength = Math.max(start.length, end.length);
    let currentProgress = 0;
    let hasCompletedFirstCycle = false; // Flag para garantir que a primeira animação terminou

    // Função de easing (transição suave)
    const easingFunctions = {
      linear: (t) => t,
      "ease-in": (t) => t * t,
      "ease-out": (t) => t * (2 - t),
    };
    const easing = easingFunctions[ease] || easingFunctions.linear;

    // Função para atualizar a animação
    const step = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      currentProgress = Math.min(elapsedTime / duration, 1);
      currentProgress = easing(currentProgress);

      // Atualiza as letras de acordo com o swapSpeed
      if (elapsedTime - (this.lastSwapTime || 0) >= swapSpeed) {
        this.lastSwapTime = elapsedTime;

        const interpolated = this.interpolateStrings({
          start,
          end,
          progress: currentProgress,
          maxLength,
          mode,
          characters,
        });

        if (onUpdate) onUpdate(interpolated);
      }

      // Se não completou a animação, continua
      if (currentProgress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      } else {
        // A animação terminou
        setTimeout(() => {
          if (autoReverse && !hasCompletedFirstCycle) {
            // A reversão só deve ocorrer após a primeira animação completa
            hasCompletedFirstCycle = true; // Marca a primeira animação como concluída
            // Inicia a reversão após a animação normal
            this.scramble({
              start: end,
              end: start,
              duration,
              swapSpeed,
              initialPause,
              transitionPause,
              onUpdate,
              onComplete,
              mode,
              characters,
              loop,
              autoReverse,
              ease,
            });
          } else if (loop) {
            // Repete a animação
            this.scramble({
              start,
              end,
              duration,
              swapSpeed,
              initialPause,
              transitionPause,
              onUpdate,
              onComplete,
              mode,
              characters,
              loop,
              autoReverse,
              ease,
            });
          } else if (onComplete) {
            // Chama o callback quando a animação terminar
            onComplete();
          }
        }, transitionPause);
      }
    };

    // Pausa inicial antes de começar a transição
    setTimeout(() => {
      this.animationFrame = requestAnimationFrame(step);
    }, initialPause);
  }

  interpolateStrings({ start, end, progress, maxLength, mode, characters }) {
    const result = [];

    for (let i = 0; i < maxLength; i++) {
      const startChar = start[i] || " "; // Preenche com espaço caso a string seja menor
      const endChar = end[i] || " ";

      if (progress === 1) {
        result.push(endChar); // Se o progresso é 1, a transição terminou
      } else if (progress === 0) {
        result.push(startChar); // Se o progresso é 0, exibe startChar
      } else if (startChar === endChar) {
        // Se as letras forem iguais, mantém o startChar
        result.push(startChar);
      } else {
        if (mode === "random") {
          result.push(Math.random() < progress ? endChar : startChar);
        } else if (mode === "sequential") {
          const threshold = Math.floor(progress * maxLength);
          result.push(i <= threshold ? endChar : startChar);
        } else if (mode === "wave") {
          const waveProgress = 0.5 * (1 - Math.cos(Math.PI * progress)); // Função de onda suave
          result.push(waveProgress < 1 ? startChar : endChar);
        }
      }
    }

    return result.join("");
  }

  stop() {
    cancelAnimationFrame(this.animationFrame); // Cancela o quadro da animação
  }
}
