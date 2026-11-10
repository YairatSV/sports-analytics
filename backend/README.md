# Backend API

Backend Python con FastAPI. La API normaliza marcadores de fútbol, NFL y NBA desde un adaptador ESPN de uso experimental.

## Endpoints

- `GET /health`: estado del servicio.
- `GET /api/v1/sports`: deportes y ligas admitidas.
- `GET /api/v1/matches?sport=soccer&league=mex.1`: partidos por competición.
- `GET /api/v1/matches?sport=nfl`: marcador NFL.
- `GET /api/v1/matches?sport=nba`: marcador NBA.

## Ejecutar en un entorno Python

Desde la carpeta del repositorio:

```bash
pip install -r backend/requirements.txt
uvicorn app.main:app --app-dir backend --reload
```

La documentación interactiva estará en `/docs`.

## Fuente y limitaciones

ESPN se consume mediante endpoints públicos no oficiales/no documentados como API para desarrolladores. No hay garantía de disponibilidad, cobertura, latencia ni autorización para uso comercial. La caché en memoria dura 30 segundos y se pierde al reiniciar el proceso. El frontend consulta aproximadamente cada 60 segundos. Esto no es streaming ni tiempo real garantizado.

## Despliegue gratuito

Se añadió `render.yaml` con un servicio web Render Free. En el panel de Render se puede crear un Blueprint desde este repositorio y elegir la rama `develop`. El servicio gratuito puede suspenderse por inactividad y tardar en despertar. No publiques secretos en el repositorio.

Configura `CORS_ORIGINS` con el dominio exacto del frontend cuando se conozca. El valor comodín actual es solo para el prototipo.

## PostgreSQL

El esquema inicial está en `backend/schema.sql`. Todavía no se ejecutan escrituras en la base de datos: primero se debe crear la instancia PostgreSQL y configurar su URL privada como variable de entorno. El servicio API actual funciona como proxy de consulta con caché efímera.
