## Formateo y Linting

Este proyecto usa **Prettier**, **ESLint**, **Husky** y **lint-staged** en conjunto para mantener el código formateado y libre de errores comunes antes de cada commit.

### Herramientas involucradas

- **Prettier**: formatter. Se encarga únicamente de la forma del código (indentación, comillas, longitud de línea, etc.), sin opinar sobre la lógica.
- **ESLint**: linter. Detecta errores reales o patrones riesgosos en el código (variables no usadas, hooks mal utilizados, imports rotos, etc.). Usamos `eslint-config-prettier` para desactivar las reglas de formato de ESLint que podrían chocar con Prettier, evitando que ambas herramientas compitan entre sí.
- **Husky**: permite versionar y ejecutar _git hooks_ dentro del repo. Sin Husky, los hooks viven en `.git/hooks`, una carpeta que no se sube a Git, por lo que cada persona tendría que configurarlos manualmente. Husky los guarda en `.husky/`, que sí viaja en el repositorio.
- **lint-staged**: filtra sobre qué archivos corren las herramientas anteriores. En vez de formatear/lintear todo el proyecto en cada commit, corre los comandos configurados solo sobre los archivos que están en el _staging area_ (los agregados con `git add`).

### Cómo se encadenan

1. Al ejecutar `git commit`, Git dispara el hook `pre-commit`.
2. Ese hook, configurado por Husky (`.husky/pre-commit`), ejecuta `npx lint-staged`.
3. `lint-staged` obtiene la lista de archivos en staging y los cruza contra los patrones definidos en la sección `"lint-staged"` de `package.json`.
4. Para cada patrón que matchea, ejecuta el comando correspondiente (en nuestro caso, `prettier --write --ignore-unknown`) pasándole solo esos archivos como argumento.
5. Si el comando modifica los archivos, `lint-staged` los vuelve a agregar automáticamente al staging area, para que el commit incluya la versión ya formateada.
6. Si el comando falla (por ejemplo, un error de ESLint que no se puede autocorregir), el commit se aborta hasta que se resuelva el problema.

**Configuración en `package.json`:**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,css}": ["eslint --fix", "prettier --write"]
  }
}
```

Esto quiere decir que para todos los archivos que tengan una extensión de las que estan listadas ahí y esten en el staging area para ser
commiteados, se les aplicaran los comandos `eslint --fix` y `prettier --write`.

### Comandos disponibles

| Comando                | Qué hace                                                                      |
| ---------------------- | ----------------------------------------------------------------------------- |
| `npm run format`       | Formatea todo el proyecto con Prettier                                        |
| `npm run format:check` | Verifica que el proyecto esté formateado, sin modificar archivos (útil en CI) |

### Activar el hook después de `git pull`

Los hooks de Husky se activan automáticamente al instalar dependencias, gracias al script `prepare` que `husky init` agrega a `package.json`:

```bash
git pull
npm install
```

Con eso alcanza: el hook `pre-commit` queda operativo y se va a disparar automáticamente en el próximo `git commit`, sin pasos adicionales.
