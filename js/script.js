const themeButton = document.getElementById("theme-toggle");
const audio = document.getElementById("audio");
const musicButton = document.getElementById("music-button");
const progressBar = document.getElementById("progress-bar");

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
}

function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme || "dark";
    const newTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem("theme", newTheme);
}

if (themeButton) {
    themeButton.addEventListener("click", toggleTheme);

    themeButton.addEventListener("touchend", (e) => {
        e.preventDefault();
        toggleTheme();
    });
}

if (musicButton && audio) {
    musicButton.addEventListener("click", async () => {
        if (audio.paused) {
            try {
                await audio.play();
                musicButton.textContent = "❚❚";
                musicButton.setAttribute("aria-label", "Pausar música");
            } catch {
                musicButton.textContent = "▶";
            }
        } else {
            audio.pause();
            musicButton.textContent = "▶";
            musicButton.setAttribute("aria-label", "Reproducir música");
        }
    });
}

if (audio && progressBar) {
    audio.addEventListener("timeupdate", () => {
        if (!audio.duration) return;

        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
    });

    audio.addEventListener("ended", () => {
        if (musicButton) {
            musicButton.textContent = "▶";
            musicButton.setAttribute("aria-label", "Reproducir música");
        }
    });
}

const viewsElement = document.getElementById("views");

if (viewsElement) {
    fetch("https://abacus.jasoncameron.dev/hit/eurus-hanma-site/views")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al conectar con el contador");
            }

            return response.json();
        })
        .then(data => {
            const count = Number(data.value);

            if (Number.isFinite(count)) {
                viewsElement.textContent = count.toLocaleString("es-ES");
            } else {
                viewsElement.textContent = "0";
            }
        })
        .catch(error => {
            console.error("Error del contador:", error);
            viewsElement.textContent = "0";
        });
}