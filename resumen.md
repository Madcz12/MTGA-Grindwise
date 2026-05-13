# Resumen de Cambios - Grindwise (13 de Mayo, 2026)

## 🎨 Rediseño y UI (Gaming-Tech)
- **Fondo de Aplicación Global:** Se añadió un fondo de pantalla personalizado (`grindwise-background.jpeg`) con ajustes de contraste y transparencia para el modo oscuro en toda la aplicación.
- **Limpieza de Interfaz:** Se centralizó el logo, se optimizaron los espacios del layout (padding/margin) y se eliminaron encabezados globales innecesarios. Se actualizó la información de metadatos del footer.
- **Componente Loading (ImportDeck):** Se rediseñó y simplificó el loader durante la importación del mazo, mostrando ahora el texto interactivo "consultando..." en lugar del diseño previo.
- **Previsualización de Cartas (Hover):** Se integró una función de previsualización que muestra el arte en alta resolución de las cartas al hacer hover sobre los listados de la interfaz.

## ⚙️ Funcionalidades y Componentes
- **Ingreso Manual de Oro:** Se convirtió el campo "Oro Actual" en un input editable. Los usuarios ahora pueden ingresar su oro directamente (en `AccountState.tsx` e `ImportDeck.tsx`), actualizándose en el estado global (`useDeckState`).
- **Internacionalización (i18n):** Se completó la implementación de soporte i18n para inglés y español en todas las vistas de la app. Las cadenas dinámicas de duración en el generador del Roadmap ahora se localizan apropiadamente.
- **Mejoras en el Scryfall API Parser:** Se resolvieron problemas de validación de datos para soportar la importación de formatos de mazo simplificados (sin código de set ni número de coleccionista).
- **Ajustes de Cálculo (Roadmap & Wildcards):** Se auditó y optimizó la lógica matemática en `roadmapCalc.ts`. Los cálculos de brechas de comodines y estimación de tiempo ahora son más precisos y realistas, respondiendo dinámicamente a la economía del juego.

## 🛠️ Correcciones Técnicas y Rendimiento
- **Fix de Sintaxis:** Se solucionó un error de sintaxis en el componente `ImportDeck.tsx` causado por llaves residuales en el árbol JSX.
- **Pruebas de Rendimiento (QA):** Se validó la eficiencia computacional y el manejo de casos borde en las funciones core, asegurando la solidez para el entorno de producción.

## 📁 Archivos Modificados Principales
- `src/App.tsx`, `src/index.css`, `src/types/index.ts`
- **Componentes:** `CardRow.tsx`, `Layout.tsx`, `RarityBadge.tsx`, `RoadmapTimeline.tsx`, `WildcardCounter.tsx`
- **Páginas:** `AccountState.tsx`, `BudgetView.tsx`, `ImportDeck.tsx`, `Results.tsx`
- **Utilidades:** `roadmapCalc.ts`, `scryfallApi.ts`
- **Nuevos Assets/Directorios:** `src/i18n/`, `public/grindwise-background.jpeg`
