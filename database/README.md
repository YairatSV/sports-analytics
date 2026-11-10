# Base de datos

PostgreSQL será el almacenamiento principal.

## Entidades previstas
- sports: deportes soportados.
- competitions: ligas y torneos.
- teams: equipos.
- seasons: temporadas.
- matches: calendario, estado y marcador.
- match_events: goles, anotaciones y eventos.
- team_statistics: estadísticas por partido.
- predictions: probabilidades, variables de entrada y versión del modelo.
- data_sources: proveedor, identificadores externos y metadatos de sincronización.

## Calidad y trazabilidad

Cada dato sincronizado deberá conservar:
- proveedor y su identificador externo;
- hora de consulta UTC (`fetched_at`);
- hora de actualización informada por el proveedor, si existe;
- estado de validación y antigüedad;
- payload original o referencia auditable cuando sea legal y viable.

Los datos de marcador, las estadísticas y las predicciones deben almacenarse por separado. Una predicción nunca debe sobrescribir un resultado del proveedor.
