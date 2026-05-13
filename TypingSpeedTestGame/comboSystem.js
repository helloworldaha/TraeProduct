const ComboSystem = (() => {
    let combo = 0;
    let maxCombo = 0;
    let eventTarget = null;

    const init = (target) => {
        eventTarget = target;
        combo = 0;
        maxCombo = 0;
        updateDisplay();
    };

    const increment = () => {
        combo++;
        if (combo > maxCombo) {
            maxCombo = combo;
        }
        updateDisplay();
        triggerEffects();
        
        if (eventTarget) {
            eventTarget.dispatchEvent(new CustomEvent('comboUpdate', {
                detail: { combo, maxCombo }
            }));
        }
    };

    const updateDisplay = () => {
        const comboElement = document.getElementById('combo');
        const maxComboElement = document.getElementById('maxCombo');
        const finalMaxComboElement = document.getElementById('finalMaxCombo');
        
        if (comboElement) {
            comboElement.textContent = `x${combo}`;
        }
        if (maxComboElement) {
            maxComboElement.textContent = maxCombo;
        }
        if (finalMaxComboElement) {
            finalMaxComboElement.textContent = maxCombo;
        }
    };

    const triggerEffects = () => {
        const comboContainer = document.querySelector('.combo-container');
        const comboDisplay = document.querySelector('.combo-display');
        const comboValue = document.querySelector('.combo-value');
        
        removeAllEffectClasses();

        if (combo >= 10) {
            comboContainer.classList.add('combo-level-10');
        }
        if (combo >= 30) {
            comboContainer.classList.add('combo-level-30');
        }
        if (combo >= 50) {
            comboContainer.classList.add('combo-level-50');
        }
        if (combo >= 100) {
            comboContainer.classList.add('combo-level-100');
        }

        if (combo === 10) {
            triggerLevel10Effect();
        }
        if (combo === 30) {
            triggerLevel30Effect();
        }
        if (combo === 50) {
            triggerLevel50Effect();
        }
        if (combo === 100) {
            triggerLevel100Effect();
        }

        if (combo >= 10 && combo % 10 === 0) {
            comboDisplay.classList.add('combo-milestone');
            setTimeout(() => {
                comboDisplay.classList.remove('combo-milestone');
            }, 500);
        }

        comboValue.classList.add('combo-pulse');
        setTimeout(() => {
            comboValue.classList.remove('combo-pulse');
        }, 300);
    };

    const removeAllEffectClasses = () => {
        const comboContainer = document.querySelector('.combo-container');
        comboContainer.classList.remove('combo-level-10', 'combo-level-30', 'combo-level-50', 'combo-level-100');
    };

    const triggerLevel10Effect = () => {
        const comboContainer = document.querySelector('.combo-container');
        comboContainer.classList.add('combo-highlight-brief');
        setTimeout(() => {
            comboContainer.classList.remove('combo-highlight-brief');
        }, 800);
    };

    const triggerLevel30Effect = () => {
        const comboContainer = document.querySelector('.combo-container');
        comboContainer.classList.add('combo-glow-pulse');
        setTimeout(() => {
            comboContainer.classList.remove('combo-glow-pulse');
        }, 1500);
    };

    const triggerLevel50Effect = () => {
        triggerParticleEffect(12);
        triggerRainbowEffect(1.5);
    };

    const triggerLevel100Effect = () => {
        triggerParticleEffect(25);
        triggerRainbowEffect(2.5);
    };

    const triggerRainbowEffect = (duration = 1.5) => {
        const comboContainer = document.querySelector('.combo-container');
        comboContainer.classList.add('rainbow-glow');
        setTimeout(() => {
            comboContainer.classList.remove('rainbow-glow');
        }, duration * 1000);
    };

    const triggerParticleEffect = (particleCount = 12) => {
        const comboContainer = document.querySelector('.combo-container');
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'combo-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 0.5}s`;
            particle.style.backgroundColor = getRandomRainbowColor();
            comboContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1500);
        }
    };

    const breakCombo = () => {
        if (combo > 0) {
            combo = 0;
            removeAllEffectClasses();
            updateDisplay();
        }
    };

    const reset = () => {
        combo = 0;
        removeAllEffectClasses();
        updateDisplay();
    };

    const getRandomRainbowColor = () => {
        const colors = [
            '#ff0000', '#ff7f00', '#ffff00', '#00ff00',
            '#0000ff', '#4b0082', '#9400d3', '#ff1493'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const getMaxCombo = () => maxCombo;

    return {
        init,
        reset,
        increment,
        breakCombo,
        getMaxCombo
    };
})();
