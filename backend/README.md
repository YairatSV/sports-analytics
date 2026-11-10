# Backend

El backend se implementará con Python y una API HTTP (por ejemplo, FastAPI).

Responsabilidades previstas:
- Consultar proveedores de datos deportivos para fútbol, NFL y NBA.
- Normalizar equipos, competiciones, temporadas, partidos y eventos.
- Ejecutar modelos estadísticos y registrar sus versiones.
- Exponer endpoints para partidos, estadísticas, predicciones y estado de actualización.
- Mantener las claves de proveedores exclusivamente en variables de entorno del servidor.

No hay conexión en vivo configurada todavía. La elección del proveedor debe preceder a la implementación de sus adaptadores.

## Endpoints previstos

- GET /health
- GET /sports
- GET /matches? sport=soccer
- GET /matches/{match_id}
- GET /predictions/{match_id}
