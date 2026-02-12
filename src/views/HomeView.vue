<script setup></script>

<template>
    <section class="home">
        <div class="hero">
            <div class="hero-text">
                <p class="kicker">11 de febrero de 2026</p>
                <h1>Encuentra tu proximo free tour</h1>
                <p class="lead">
                    Busca rutas por ciudad, tema o duracion. Descubre
                    experiencias guiadas con vistas inolvidables.
                </p>

                <div class="search" aria-label="Buscador de tours">
                    <input
                        type="search"
                        name="q"
                        placeholder="Ej: Granada, gastronomia, casco historico, montañas..."
                        aria-label="Buscar tours"
                    />
                    <button type="button">Buscar</button>
                </div>

                <div class="links" aria-label="Accesos visuales">
                    <button class="pill primary" type="button">
                        Iniciar sesion
                    </button>
                    <button class="pill ghost" type="button">Registro</button>
                </div>
            </div>

            <div class="carousel" aria-label="Carrusel de paisajes">
                <div class="slide slide-a">
                    <img
                        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                        alt="Montañas al amanecer"
                    />
                </div>
                <div class="slide slide-b">
                    <img
                        src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"
                        alt="Valle con neblina"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.home {
    padding: 2.5rem 1.25rem 3.5rem;
}

.hero {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    gap: 2rem;
    align-items: center;
}

.hero-text {
    display: grid;
    gap: 1rem;
}

.kicker {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.75rem;
    color: #2e2d2b;
}

.lead {
    max-width: 38ch;
    color: #1e1d1b;
    font-size: 1.1rem;
    line-height: 1.6;
}

.search {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: 1fr;
}

.search input {
    border: 1px solid #c9c3b8;
    border-radius: 999px;
    padding: 0.85rem 1.1rem;
    background: #fffdf8;
    font-size: 1rem;
}

.search button {
    border: none;
    border-radius: 999px;
    padding: 0.85rem 1.4rem;
    background: #0f1f2d;
    color: #f7f2e8;
    font-weight: 600;
    letter-spacing: 0.02em;
    cursor: pointer;
}

.links {
    display: flex;
    gap: 0.85rem;
    flex-wrap: wrap;
}

.pill {
    border-radius: 999px;
    padding: 0.65rem 1.4rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    cursor: pointer;
    border: 1px solid transparent;
    background: transparent;
}

.pill.primary {
    background: #0f1f2d;
    color: #f7f2e8;
}

.pill.ghost {
    border-color: #0f1f2d;
    color: #0f1f2d;
}

.carousel {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    box-shadow: 0 30px 70px rgba(15, 31, 45, 0.2);
}

.slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    animation: fade 10s infinite;
}

.slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.slide-a {
    animation-delay: 0s;
}

.slide-b {
    animation-delay: 5s;
}

@keyframes fade {
    0%,
    10% {
        opacity: 1;
    }
    45%,
    55% {
        opacity: 0;
    }
    90%,
    100% {
        opacity: 1;
    }
}

@media (min-width: 900px) {
    .hero {
        grid-template-columns: 1.1fr 0.9fr;
    }

    .search {
        grid-template-columns: 1fr auto;
        align-items: center;
    }
}

@media (prefers-reduced-motion: reduce) {
    .slide {
        animation: none;
        opacity: 1;
    }
    .slide-b {
        display: none;
    }
}
</style>
