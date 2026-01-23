# Prompt para Stitch: Diseño UI/UX para HR Payroll System

## 🎯 Objetivo Principal

Diseñar una interfaz moderna, profesional y accesible para un sistema de gestión de nómina (HR Payroll System) que incluya **autenticación JWT**, gestión de empleados, contratos, cálculo de nómina y reglas de cálculo.

**PRIORIDAD #1:** Resolver problemas críticos de contraste y legibilidad (violaciones WCAG AA).

---

## 📋 Contexto del Proyecto

### Stack Tecnológico
- **Backend:** NestJS + PostgreSQL + Prisma ORM
- **Frontend:** Angular 17 (standalone components)
- **Arquitectura:** Clean Architecture (domain/application/infrastructure/presentation)
- **Autenticación:** JWT con usuario administrador predeterminado

### Funcionalidades Implementadas

#### 1. **Autenticación (HU-10)** ✅
- Login con usuario/contraseña (admin/admin123)
- JWT con expiración de 8 horas
- Protección de todos los endpoints excepto `/auth/login` y `/payroll/health`
- **Estado:** Backend implementado, falta UI de login

#### 2. **Gestión de Empleados (HU-06, HU-07)**
- Crear empleado (nombre, email)
- Listar empleados con información completa
- Validaciones de datos

#### 3. **Gestión de Contratos (HU-08)**
- Crear contrato asociado a empleado
- Tipos: EMPLOYEE (empleado) o CONTRACTOR (contratista)
- Campos: tipo, salario base, estado activo/inactivo
- Validación de contrato activo antes de calcular nómina (HU-09)

#### 4. **Cálculo de Nómina (HU-03, HU-04, HU-05, HU-09)**
- Calcular nómina para empleados y contratistas
- Validaciones: contrato existe, pertenece al empleado, está activo
- Cálculo automático de deducciones (salud, pensión, retención)
- Persistencia de corridas de nómina
- Visualización de breakdown detallado

#### 5. **Reglas de Cálculo (HU-02)**
- CRUD completo de reglas de nómina
- Reglas reales almacenadas en base de datos
- Tipos: porcentaje o monto fijo
- Aplicables por tipo de contrato

#### 6. **Health Check (HU-01)**
- Endpoint público para verificar estado del servicio

---

## 🚨 Problemas Actuales de UI (CRÍTICOS)

### Contraste Insuficiente (Violaciones WCAG AA)
```css
/* PROBLEMÁTICO: Contraste insuficiente */
--text: #e7ecff;        /* Texto principal sobre fondo oscuro */
--muted: #a9b3d6;       /* Texto secundario - BAJO CONTRASTE */
--bg: #0b1020;          /* Fondo principal muy oscuro */
--panel: #121a33;       /* Paneles - poco contraste con bg */
--border: rgba(255,255,255,.10);  /* Bordes casi invisibles */
```

**Problemas específicos:**
- Texto `--muted` (#a9b3d6) sobre `--bg` (#0b1020): ratio ~4.5:1 (límite WCAG AA)
- Labels de formularios difíciles de leer
- Bordes de inputs/cards casi invisibles
- Texto en pills/badges con bajo contraste

### Otros Problemas
- Falta página de login con formulario
- No hay feedback visual para estados de carga
- No hay mensajes de error/éxito consistentes (toasts)
- Tablas con IDs largos (UUIDs) dificultan lectura
- No hay estados hover/focus claros en elementos interactivos

---

## 🎨 Requisitos de Diseño

### 1. Paleta de Colores (WCAG AA Compliant)

**Inspiración:** Linear, Stripe Dashboard, Vercel, Notion

**Requisitos obligatorios:**
- Contraste mínimo 4.5:1 para texto normal (WCAG AA)
- Contraste mínimo 3:1 para texto grande y elementos UI
- Paleta elegante, profesional, moderna
- Soporte para tema oscuro (preferido)
- Colores semánticos claros: success, error, warning, info

**Sugerencias:**
- Fondo principal: gris oscuro profundo pero no negro puro
- Paneles: contraste sutil pero visible con el fondo
- Texto principal: blanco/gris muy claro (ratio >7:1)
- Texto secundario: gris medio con ratio >4.5:1
- Acentos: azul vibrante o violeta para acciones primarias
- Bordes: visibles pero sutiles (alpha 0.15-0.25)

### 2. Tipografía
- **Familia:** System fonts (Inter, SF Pro, Segoe UI)
- **Tamaños:**
  - Headings: 24px (h1), 20px (h2), 16px (h3)
  - Body: 14px
  - Small: 12px
  - Buttons: 14px
- **Pesos:** Regular (400), Medium (500), Semibold (600), Bold (700)
- **Line height:** 1.5 para texto, 1.2 para headings

### 3. Espaciado y Layout
- **Sistema de espaciado:** 4px base (4, 8, 12, 16, 24, 32, 48, 64)
- **Contenedor principal:** max-width 1200px, padding 24px
- **Cards:** padding 20-24px, border-radius 12-16px
- **Inputs:** padding 12px, border-radius 8-12px
- **Buttons:** padding 10-12px horizontal, 8-10px vertical

### 4. Componentes Reutilizables

#### Botones
- **Primary:** Acción principal (crear, guardar, login)
- **Secondary:** Acciones secundarias (cancelar, volver)
- **Danger:** Acciones destructivas (eliminar)
- **Ghost:** Acciones terciarias (ver detalles)
- Estados: default, hover, active, disabled, loading

#### Inputs y Forms
- Text input, email input, number input, select/dropdown
- Estados: default, focus, error, disabled
- Labels claros y visibles
- Mensajes de error inline
- Validación visual inmediata

#### Cards
- Card básico para contenido
- Card con header y footer
- Card con acciones
- Sombras sutiles para profundidad

#### Tablas
- Header sticky en scroll
- Filas con hover state
- Paginación (si aplica)
- Acciones por fila (editar, eliminar)
- Manejo de UUIDs largos (truncar con tooltip)

#### Badges/Pills
- Estados: active/inactive, success/error/warning
- Tipos de contrato: EMPLOYEE/CONTRACTOR
- Contraste suficiente con fondo

#### Toasts/Notifications
- Success: operación exitosa
- Error: operación fallida
- Warning: advertencia
- Info: información general
- Posición: top-right o bottom-right
- Auto-dismiss después de 4-5 segundos

#### Modals
- Login modal (si se usa modal en lugar de página)
- Confirmación de eliminación
- Formularios complejos
- Overlay oscuro con blur

---

## 📱 Páginas a Diseñar

### 1. **Login Page** (NUEVA - PRIORIDAD ALTA)

**Elementos:**
- Logo/branding del sistema
- Formulario centrado con:
  - Input de username (label visible)
  - Input de password (con toggle show/hide)
  - Botón "Iniciar Sesión" (primary)
  - Mensaje de error si credenciales inválidas
- Fondo elegante (gradiente sutil o patrón)
- Responsive: mobile-first

**Flujo:**
1. Usuario ingresa credenciales
2. Click en "Iniciar Sesión"
3. Loading state en botón
4. Si error: mostrar mensaje claro
5. Si éxito: redirect a dashboard/employees

**Notas:**
- Usuario predeterminado: admin / admin123
- No hay registro ni recuperación de contraseña
- Mantener diseño simple y profesional

### 2. **Dashboard/Home** (OPCIONAL - puede ser redirect a Employees)

**Elementos:**
- Resumen de métricas clave:
  - Total de empleados
  - Contratos activos
  - Nóminas procesadas este mes
  - Estado del sistema (health check)
- Cards con información resumida
- Accesos rápidos a funcionalidades principales

### 3. **Employees Page**

**Elementos actuales:**
- Lista de empleados en tabla (id, nombre, email, fecha creación)
- Formulario para crear empleado (nombre, email)
- Botón "Crear Empleado"

**Mejoras de diseño:**
- Tabla con mejor contraste y hover states
- Formulario en card separado o modal
- Feedback visual al crear (toast success)
- Manejo de errores (toast error)
- Loading state durante fetch
- Empty state si no hay empleados

### 4. **Contracts Page**

**Elementos actuales:**
- Lista de contratos en tabla (id, employeeId, tipo, salario, activo, fechas)
- Formulario para crear contrato (employeeId, tipo, salario base)

**Mejoras de diseño:**
- Badge para tipo de contrato (EMPLOYEE/CONTRACTOR)
- Badge para estado (Activo/Inactivo)
- Formateo de salario (separadores de miles)
- Selector de empleado con búsqueda/autocomplete
- Validación visual de campos
- Confirmación antes de crear

### 5. **Payroll Runs Page**

**Elementos actuales:**
- Lista de corridas de nómina en tabla
- Formulario para crear corrida (employeeId, contractId, period, bonuses, otherDeductions)
- Visualización de breakdown (gross, net, deducciones)

**Mejoras de diseño:**
- Tabla con columnas colapsables para breakdown
- Formateo de montos (COP con separadores)
- Selector de período (date picker)
- Cálculo en tiempo real (preview antes de guardar)
- Desglose visual de deducciones (gráfico o lista)
- Filtros por empleado, período, contrato

### 6. **Payroll Rules Page**

**Elementos actuales:**
- Lista de reglas en tabla (key, label, tipo contrato, unidad, valor, habilitado)
- CRUD completo (crear, editar, eliminar)

**Mejoras de diseño:**
- Toggle para habilitar/deshabilitar regla
- Badge para tipo de unidad (PERCENT/AMOUNT)
- Formulario inline o modal para editar
- Confirmación antes de eliminar
- Agrupación por tipo de contrato
- Indicador visual de reglas activas vs inactivas

### 7. **Health Check Page**

**Elementos actuales:**
- Mensaje simple de estado del servicio

**Mejoras de diseño:**
- Card con estado visual (verde/rojo)
- Información adicional (versión, uptime, etc.)
- Botón para refrescar estado
- Indicadores de conectividad con servicios externos

---

## 🎯 Componentes Comunes (Navbar, etc.)

### Navbar
**Elementos actuales:**
- Logo/brand "HR Payroll UI"
- Links de navegación: Employees, Contracts, Payroll Runs, Payroll Rules, Health

**Mejoras de diseño:**
- Agregar botón de "Cerrar Sesión" (logout)
- Indicador de usuario actual (username + role)
- Active state más visible en links
- Responsive: hamburger menu en mobile
- Sticky al hacer scroll
- Backdrop blur para efecto glassmorphism

---

## ♿ Requisitos de Accesibilidad (WCAG AA)

### Contraste
- Texto normal: mínimo 4.5:1
- Texto grande (18px+): mínimo 3:1
- Elementos UI (botones, inputs): mínimo 3:1

### Tamaños
- Texto mínimo: 14px (12px solo para metadata)
- Área de click mínima: 44x44px (botones, links)
- Inputs: altura mínima 40px

### Estados
- Focus visible en todos los elementos interactivos
- Hover states claros
- Disabled states visualmente distintos
- Loading states con indicadores

### Semántica
- Labels asociados a inputs (for/id)
- Botones con texto descriptivo
- Alt text en imágenes (si aplica)
- Headings jerárquicos (h1, h2, h3)

---

## 📐 Responsive Design

### Breakpoints
- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+

### Comportamiento
- **Mobile:**
  - Navbar colapsado (hamburger menu)
  - Tablas con scroll horizontal
  - Formularios en columna única
  - Cards apilados verticalmente

- **Tablet:**
  - Navbar expandido
  - Tablas con scroll si necesario
  - Formularios en 2 columnas
  - Cards en grid 2 columnas

- **Desktop:**
  - Layout completo
  - Tablas sin scroll (o con scroll interno)
  - Formularios en 2-3 columnas
  - Cards en grid 3 columnas

---

## 🎨 Inspiración de Diseño

### Referencias de estilo
1. **Linear:** Paleta oscura elegante, contraste perfecto, tipografía limpia
2. **Stripe Dashboard:** Tablas claras, formularios bien espaciados, feedback visual
3. **Vercel:** Minimalismo, bordes sutiles, sombras suaves
4. **Notion:** Jerarquía visual clara, estados interactivos, iconografía simple

### Elementos a emular
- Sombras sutiles para profundidad (no exageradas)
- Bordes visibles pero no dominantes
- Espaciado generoso (no apretado)
- Animaciones micro (hover, focus, transitions)
- Feedback inmediato en interacciones

---

## 📦 Entregables Esperados

### 1. Paleta de Colores Completa
```css
:root {
  /* Backgrounds */
  --bg-primary: ...;
  --bg-secondary: ...;
  --bg-tertiary: ...;
  
  /* Text */
  --text-primary: ...;
  --text-secondary: ...;
  --text-tertiary: ...;
  
  /* Borders */
  --border-primary: ...;
  --border-secondary: ...;
  
  /* Semantic */
  --color-success: ...;
  --color-error: ...;
  --color-warning: ...;
  --color-info: ...;
  
  /* Interactive */
  --color-primary: ...;
  --color-primary-hover: ...;
  --color-secondary: ...;
  
  /* Shadows */
  --shadow-sm: ...;
  --shadow-md: ...;
  --shadow-lg: ...;
}
```

### 2. Mockups de Páginas
- Login page (desktop + mobile)
- Employees page (desktop + mobile)
- Contracts page (desktop + mobile)
- Payroll Runs page (desktop + mobile)
- Payroll Rules page (desktop + mobile)
- Health page (desktop)

### 3. Componentes Reutilizables
- Botones (todos los tipos y estados)
- Inputs (todos los tipos y estados)
- Cards (variantes)
- Tablas (con datos de ejemplo)
- Badges/Pills
- Toasts/Notifications
- Modals
- Navbar (desktop + mobile)

### 4. Guía de Componentes
- Especificaciones de cada componente
- Variantes y estados
- Espaciado y dimensiones
- Código CSS sugerido (si aplica)

### 5. Especificaciones de Implementación
- Estructura HTML recomendada
- Clases CSS sugeridas
- Consideraciones de accesibilidad
- Notas de responsive design

---

## ⚠️ Restricciones y Consideraciones

### NO Romper Funcionalidad Existente
- Mantener todas las rutas actuales
- No cambiar estructura de datos
- No modificar lógica de negocio
- Solo mejorar UI/UX

### Prioridades
1. **Contraste y legibilidad** (CRÍTICO)
2. **Login page** (ALTA)
3. **Componentes reutilizables** (ALTA)
4. **Mejoras en páginas existentes** (MEDIA)
5. **Dashboard opcional** (BAJA)

### Tecnología
- Angular 17 standalone components
- CSS puro (no frameworks CSS externos)
- Variables CSS para theming
- Sin dependencias adicionales

---

## 🚀 Próximos Pasos (Implementación)

1. **Fase 1:** Implementar nueva paleta de colores en `styles.css`
2. **Fase 2:** Crear componentes reutilizables (buttons, inputs, cards)
3. **Fase 3:** Implementar login page y lógica de autenticación
4. **Fase 4:** Mejorar páginas existentes con nuevos componentes
5. **Fase 5:** Testing de accesibilidad y responsive

---

## 📝 Notas Adicionales

- El backend ya está implementado y funcionando
- JWT ya está configurado (8h expiration)
- Usuario admin hardcodeado (no hay registro)
- Todas las validaciones están en backend
- Frontend solo consume API REST

**¿Preguntas o aclaraciones?** Estoy disponible para iterar sobre el diseño.
