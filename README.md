# SPORTS ANALYTICS

Plataforma en desarrollo para análisis estadístico de fútbol, NFL y NBA.

## Estado actual

- `main` conserva la versión inicial del prototipo.
- `develop` contiene la nueva estructura modular.
- La interfaz modular está en `frontend/`.
- Los modelos matemáticos iniciales están separados por deporte.
- Backend y PostgreSQL están documentados como siguientes componentes.
- **Todavía no hay datos en vivo ni un proveedor API conectado.**

## Estructura

```
frontend/
  index.html
  css/styles.css
  js/
    app.js
    soccer.js
    nfl.js
    nba.js
backend/README.md
database/README.md
```

## Modelos iniciales

- Fútbol: Poisson independiente, con masa de probabilidad cubierta y masa omitida reportadas.
- NFL: aproximación normal para la diferencia de puntos.
- NBA: estimación de puntos a partir de posesiones y puntos por posesión.

Son motores matemáticos iniciales. Antes de publicar pronósticos deben calibrarse y validarse con datos históricos y métricas fuera de muestra.

## Próximas etapas

1. Seleccionar proveedores de datos para fútbol, NFL y NBA.
2. Construir backend y adaptadores de datos.
3. Crear esquema PostgreSQL y sincronización de partidos.
4. Implementar actualizaciones periódicas y, cuando el proveedor lo permita, eventos en tiempo real.
5. Validar y calibrar los modelos por deporte.
6. Desplegar frontend y backend.
