document.addEventListener('DOMContentLoaded', () => {
    const textElements = document.querySelectorAll('.hover-font, h1'); // Target zowel .hover-font als h3

    // Lijst met beschikbare fonts
    const fonts = [
        'Patriot, sans-serif',
        'Dearest, monospace',
        'Arizonia, serif',
        'Bilbo, Charcoal, sans-serif',
        'ShadowHand, Geneva, sans-serif',
        'Agnes, Times, serif',
        'PicNic, Geneva, sans-serif',
        'Knighthings Spikeless, Geneva, sans-serif',
    ];

    function getRandomFont() {
        const randomIndex = Math.floor(Math.random() * fonts.length);
        return fonts[randomIndex];
    }

    let interval;

    function changeFontLetterByLetter(spans) {
        let index = 0;

        // Start interval om letter voor letter het font te veranderen
        interval = setInterval(() => {
            if (index >= spans.length) {
                clearInterval(interval); // Stop als alle letters zijn veranderd
                return;
            }

            const span = spans[index];
            if (span.textContent.trim() !== '') {
                span.style.fontFamily = getRandomFont(); // Verander font van de huidige letter
            }
            index++;
        }, 100); // Verander elke letter elke 100 ms
    }

    function wrapTextWithSpans(element) {
        const text = element.textContent;
        element.innerHTML = ''; // Verwijder de originele tekst
        // Wikkel de tekst in een span voor elke letter
        for (const char of text) {
            const span = document.createElement('span');
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
            }
            element.appendChild(span);
        }
    }

    textElements.forEach((element) => {
        wrapTextWithSpans(element); // Wikkel de tekst in spans voor alle geselecteerde elementen

        // Start de font-verandering bij hover
        element.addEventListener('mouseenter', () => {
            const spans = element.querySelectorAll('span');
            changeFontLetterByLetter(spans); // Start de letter voor letter font wijziging
        });

        // Stop de font-verandering wanneer de muis weggaat
        element.addEventListener('mouseleave', () => {
            clearInterval(interval); // Stop het interval direct als de muis weg is
            const spans = element.querySelectorAll('span');
            spans.forEach(span => {
                span.style.fontFamily = ''; // Reset naar originele font
            });
        });
    });
});