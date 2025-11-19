# ¿Por qué tu web se ve en blanco al desplegar en Vercel con Vite?

El problema que describes (pantalla blanca sin errores visibles y la sensación de que solo se genera el HTML) se debe casi con total seguridad a cómo se están manejando las **variables de entorno** en tu código.

Aquí tienes la explicación técnica y la solución:

## 1. El error principal: `process.env` no existe en el navegador

En tu archivo `services/gemini.ts`, tienes esta línea:

```typescript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

Al hacer un **Vite Build**, el código se empaqueta para ejecutarse en el navegador. Los navegadores no tienen acceso al objeto global `process` (que es exclusivo de Node.js).

Cuando la web intenta cargar, el código JavaScript se detiene inmediatamente al encontrar `process.env` porque lanza un error del tipo `ReferenceError: process is not defined`. Como este error ocurre antes de que React pueda "montar" la aplicación (`root.render`), el `div id="root"` se queda vacío y ves la pantalla blanca.

## 2. Cómo funciona Vite con Variables de Entorno

Vite tiene una forma específica de manejar variables de entorno para asegurarse de que no filtres secretos de servidor al cliente por accidente:

1.  **Prefijo Obligatorio:** Las variables deben empezar con `VITE_`.
2.  **Acceso:** Se accede a ellas mediante `import.meta.env`.

## Solución paso a paso

Para arreglarlo, debes hacer dos cambios:

### A. Cambia el código
En `services/gemini.ts`, cambia la forma de acceder a la variable:

**Incorrecto (actual):**
```typescript
apiKey: process.env.API_KEY
```

**Correcto (Vite):**
```typescript
apiKey: import.meta.env.VITE_API_KEY || ''
```

### B. Configura Vercel correctamente
1. Ve a tu proyecto en Vercel > Settings > Environment Variables.
2. Crea una nueva variable llamada **`VITE_API_KEY`** (es crucial que empiece con `VITE_`).
3. Pega ahí tu clave de Gemini.
4. **Redespliega** el proyecto (haz un nuevo commit o dale a "Redeploy" en Vercel).

---

## ¿Por qué crees que "solo se crea un index.html"?

Probablemente Vite sí está generando los archivos JavaScript (en la carpeta `/assets` dentro de `/dist`), pero como el script falla al inicio por el error de `process`, el navegador solo renderiza el HTML base, dándote la impresión de que el resto no existe.