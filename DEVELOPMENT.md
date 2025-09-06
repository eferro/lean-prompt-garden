# 🛠️ Development Guide

Este documento explica el flujo de desarrollo y las validaciones de calidad implementadas en el proyecto.

## 🚨 Prevención de Errores - Sistema de Validación

### Problema Resuelto
Anteriormente, errores como **imports no utilizados** y **errores de TypeScript** se "colaban" en los commits porque solo se ejecutaba el linter básico. Ahora tenemos múltiples capas de validación:

## 🔍 Capas de Validación

### 1. **Pre-commit Hook** (Validación Local)
Se ejecuta automáticamente antes de cada commit:

```bash
# Se ejecuta automáticamente al hacer commit
git commit -m "mi mensaje"

# O puedes ejecutarlo manualmente
./.githooks/pre-commit
```

**Valida:**
- ✅ ESLint (linting)
- ✅ TypeScript typecheck
- ✅ Tests unitarios
- ✅ Compilación exitosa

### 2. **GitHub Actions CI** (Validación Remota)
Se ejecuta automáticamente en cada push/PR:

**Workflow: Continuous Integration** (`.github/workflows/ci.yml`)
- ✅ Todas las validaciones del pre-commit
- ✅ Test de build de producción
- ✅ Se ejecuta en múltiples ramas

### 3. **Deployment Protegido**
El deployment solo ocurre si el CI pasa exitosamente.

## 🎯 Comandos de Desarrollo

### Validación Manual Completa
```bash
# Ejecuta todas las validaciones (recomendado antes de push)
npm run validate

# O individual:
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run test        # Tests
npm run build       # Build test
```

### Scripts de Testing
```bash
npm run test              # Tests básicos
npm run test:watch        # Tests en modo watch
npm run test:coverage     # Tests con cobertura
npm run test:ui          # Tests con UI interactiva
npm run test:unit        # Solo tests unitarios
npm run test:components  # Solo tests de componentes
```

### Scripts de Build
```bash
npm run build            # Build estándar
npm run build:pages      # Build para GitHub Pages
```

## 🚫 Errores que Ahora se Detectan Automáticamente

### Antes ❌
- Imports no utilizados pasaban desapercibidos
- Errores de TypeScript se committeaban
- Tests rotos llegaban a main
- Problemas de build solo se descubrían en CI

### Ahora ✅
- **Pre-commit hook**: Bloquea commits con problemas
- **TypeScript**: Detecta todos los errores de tipos
- **ESLint**: Configurado para detectar variables no utilizadas
- **Tests**: Obligatorios para commitear
- **CI completo**: Doble validación remota

## 🔧 Configuración de Quality Gates

### ESLint Configuración
```js
'@typescript-eslint/no-unused-vars': [
  'error',
  { 
    argsIgnorePattern: '^_',      // Ignora args que empiecen con _
    varsIgnorePattern: '^_',      // Ignora vars que empiecen con _
    ignoreRestSiblings: true      // Ignora destructuring rest
  }
],
```

### Git Hooks
Los hooks se configuran automáticamente con `npm install` via:
```bash
git config core.hooksPath .githooks
```

## 🎭 Flujo de Trabajo Recomendado

### 1. Durante Desarrollo
```bash
# Desarrollo normal
npm run dev

# Tests en background (opcional)
npm run test:watch
```

### 2. Antes de Commit
```bash
# Validación completa (recomendado)
npm run validate

# O confía en el pre-commit hook
git add .
git commit -m "feat: nueva funcionalidad"
# ☝️ Se ejecuta automáticamente todas las validaciones
```

### 3. Antes de Push
```bash
# Opcional: última validación
npm run validate

# Push seguro
git push
# ☝️ CI ejecutará todas las validaciones remotamente
```

## 🔍 Troubleshooting

### Si el pre-commit hook falla:
1. **Lee el error** - te dirá qué validación falló
2. **Arregla el problema**
3. **Vuelve a intentar el commit**

### Si quieres hacer commit sin validaciones (NO RECOMENDADO):
```bash
# Solo en emergencias
git commit --no-verify -m "hotfix: emergencia"
```

### Si el CI falla:
1. **Revisa los logs** en GitHub Actions
2. **Ejecuta localmente**: `npm run validate`
3. **Arregla los problemas**
4. **Push nuevamente**

## 📊 Métricas de Calidad

Con este sistema ahora tenemos:
- **0 errores de TypeScript** garantizado
- **0 tests rotos** en main
- **0 problemas de linting** en main
- **100% builds exitosos** en deployment

## 🎉 Beneficios

- **Calidad consistente**: No más "se me olvidó ejecutar los tests"
- **Deployment seguro**: Solo código validado llega a producción
- **Feedback rápido**: Errores detectados localmente antes del push
- **Menos debugging**: Problemas detectados en desarrollo, no en producción

---

¿Preguntas? El sistema está diseñado para ser transparente y ayudar, no obstaculizar el desarrollo.
