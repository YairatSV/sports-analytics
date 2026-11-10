# Base de datos

Se prevé PostgreSQL como almacenamiento principal.

Entidades iniciales:
- sports: deportes soportados.
- competitions: ligas y torneos.
- teams: equipos.
- seasons: temporadas.
- matches: calendario, estado y marcador.
- match_events: goles, anotaciones y eventos en vivo.
- team_statistics: estadísticas por partido.
- predictions: probabilidades, variables de entrada y versión del modelo.
- data_sources: proveedor, identificadores externos y metadatos de sincronización.

Los registros deberán conservar la fuente y la hora de consulta para distinguir datos confirmados, retrasados y estimados. El esquema SQL se definirá junto con el proveedor seleccionado.
