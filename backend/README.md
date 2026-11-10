# Backend

El backend previsto es Python con FastAPI y PostgreSQL.

## Primera fuente de marcadores (prototipo)

El frontend de `develop` consulta directamente los endpoints públicos de scoreboard de ESPN para probar la experiencia sin coste ni clave API:
- NFL: `football/nfl/scoreboard`
- NBA: `basketball/nba/scoreboard`
- Fútbol: `soccer/{league}/scoreboard` (por ejemplo `eng.1`, `esp.1`, `mex.1`).

**Advertencia:** son endpoints públicos no oficiales/no documentados como API de desarrolladores. No existe garantía de estabilidad, cobertura, disponibilidad, latencia ni permiso de uso comercial. Antes de un despliegue público serio se deben revisar los términos aplicables y validar cada competición. La interfaz no debe describirlos como un feed oficial ni garantizar tiempo real.

## Responsabilidades del backend

- Consumir proveedores desde el servidor cuando se requieran claves o protección de credenciales.
- Normalizar equipos, competiciones, temporadas, partidos y eventos.
- Cachear respuestas y registrar `source`, `fetched_at` y `provider_updated_at`.
- Distinguir estado en vivo, final, programado, retrasado y fuente no disponible.
- Ejecutar modelos estadísticos y registrar sus versiones.
- Exponer endpoints: `GET /health`, `GET /sports`, `GET /matches?sport=soccer`, `GET /matches/{match_id}`, `GET /predictions/{match_id}`.

## Estrategia de actualización

El prototipo consulta cada 60 segundos mientras la página está abierta. Esto es sondeo periódico, no streaming ni garantía de actualización inmediata. El backend futuro debe aplicar límites por proveedor, caché, reintentos con espera progresiva y controles de antigüedad para evitar saturación.
