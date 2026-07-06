# RK Liebres · Reparto de Leads

App interna de RK Palanca Fontestad para registrar y repartir captaciones entre agentes, según su nivel de acceso (ranking mensual), con visualización de equidad en tiempo real.

## Bloques / pestañas

1. **Generación Staff** — abierto a todos los agentes
2. **Verónica (Telemarketing)** — Top Producer, Consultor Senior, Consultor Junior
3. **Oficina Foios** — Top Producer, Consultor Senior
4. **Oficina Meliana** — Top Producer, Consultor Senior
5. **Oficina Tavernes Blanques** — Top Producer, Consultor Senior
6. **Oficina Massamagrell** — Top Producer, Consultor Senior
7. **Gerencia (VIP)** — Top Producer únicamente

Los niveles y agentes están definidos en `src/data/agents.js`, según el `RANKING 05/2026`. Cuando cambie el ranking mensual, solo hay que actualizar ese archivo (nivel de cada agente).

## Funcionamiento

- Cualquier persona del staff puede añadir una nueva captación en cualquier pestaña, asignándola a un agente **con acceso a esa fuente**.
- La tabla es editable en línea: los cambios se guardan al momento y se ven reflejados para todos (sincronización cada 4 segundos vía polling sobre Upstash Redis).
- Cada pestaña muestra una gráfica que compara cuántas captaciones ha recibido cada agente **en el mes en curso**, marcando quién recibe más (🔥) y quién menos (⚖️), para ayudar a repartir de forma equitativa.
- Sin login ni PIN: acceso abierto para todo el staff.

## Stack

- React + Vite
- Recharts (gráficas)
- Vercel (hosting + serverless functions en `/api`)
- Upstash Redis (persistencia compartida, mismo patrón que `rk-vacaciones-aliados` y `rk-firmas-notaria`)

## Despliegue

1. Sube esta carpeta al repo de GitHub `agalvez-tech` (nuevo repo, ej. `rk-captaciones`).
2. Importa el repo en Vercel.
3. En **Vercel → Storage**, crea o conecta una base de datos **Upstash Redis** (o reutiliza la misma que usas en `rk-vacaciones-aliados` si quieres compartir instancia — las claves llevan el prefijo `rk-captaciones:` así que no chocan con otras apps).
4. Asegúrate de que las variables de entorno `KV_REST_API_URL` y `KV_REST_API_TOKEN` estén disponibles en el proyecto (Vercel las inyecta automáticamente al conectar el Upstash Redis add-on).
5. Deploy. Listo — comparte la URL con todo el equipo.

## Actualizar el ranking mensual

Cuando llegue el nuevo `RANKING MM/AAAA`, edita `src/data/agents.js`:
- Actualiza el `level` de cada agente si ha cambiado (`top`, `senior`, `junior`, `agente`).
- Si entra o sale alguien del equipo, añade/quita su línea en el array `AGENTS`.

No hace falta tocar nada más — los permisos por pestaña (`SOURCE_LEVEL_ACCESS`) ya están definidos según la lógica del ranking (Verónica, Oficina, Gerencia).
