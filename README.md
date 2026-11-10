# SPORTS ANALYTICS

Plataforma en desarrollo para análisis estadístico de fútbol, NFL y NBA.

## Estado de `develop`

- Frontend modular con marcadores de los tres deportes.
- Fuente de datos experimental: endpoints públicos no oficiales de ESPN.
- Actualización periódica aproximada de 60 segundos en la interfaz.
- Backend Python/FastAPI con endpoints normalizados y caché en memoria.
- Adaptador frontend configurable para usar el backend cuando esté desplegado.
- Esquema inicial PostgreSQL en `backend/schema.sql`.
- Motores matemáticos iniciales separados por deporte.

**Limitaciones:** no hay garantía de tiempo real, cobertura completa o estabilidad del proveedor. PostgreSQL está diseñado pero aún no conectado ni recibiendo registros. El backend aún no está desplegado.

## Estructura

```
frontend/
  index.html
  css/styles.css
  js/app.js
  js/config.js
  js/live-scores.js
  js/soccer.js
  js/nfl.js
  js/nba.js
backend/
  app/main.py
  app/config.py
  app/schemas.py
  app/providers/espn.py
  requirements.txt
  schema.sql
render.yaml
```

## Despliegue

El archivo `render.yaml` prepara un servicio web gratuito en Render. Selecciona la rama `develop` al crear el Blueprint. Después de desplegar, copia la URL del servicio en `frontend/js/config.js` como `API_BASE` para que la interfaz consulte el backend.

El esquema PostgreSQL debe aplicarse a una instancia creada por separado. No se deben incluir contraseñas ni cadenas de conexión en GitHub.

## Modelos iniciales

- Fútbol: Poisson independiente.
- NFL: aproximación normal de diferencia de puntos.
- NBA: estimación basada en posesiones y puntos por posesión.

Los modelos requieren calibración histórica y validación antes de considerarse fiables.
