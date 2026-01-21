# Plan de Implementación - Mejoras UI/UX

## 📊 Análisis de Mockups

### Mockup 1: Login Page (code.html)
**Elementos clave:**
- Fondo oscuro con gradiente mesh (#0a0d14)
- Color primario: #5a4ea6 (violeta)
- Card con border sutil y sombra
- Inputs con iconos Material Symbols
- Estados focus con ring primary
- Badges de seguridad (AES-256, ISO 27001)

### Mockup 2: Employees Page (code1.html)
**Elementos clave:**
- Navbar sticky con glassmorphism
- Stats cards (bento grid) con métricas
- Tabla con hover states (#242938)
- Avatares con iniciales
- Badges para estados (active/inactive)
- Paginación
- Búsqueda y filtros

### Mockup 3: Payroll Runs Page (code2.html)
**Elementos clave:**
- Sidebar de navegación
- Hero card para Net Pay (fondo primary)
- Grid de detalles (Gross Pay / Deductions)
- Toast notifications
- Breakdown detallado con iconos
- Employer contributions

---

## 🎨 Paleta de Colores Extraída (WCAG AA Compliant)

```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0d14;        /* Fondo principal oscuro */
  --bg-secondary: #191f2e;      /* Fondo secundario */
  --bg-panel: #161b26;          /* Cards/Panels */
  --bg-panel-alt: #1f2535;      /* Panels alternos */
  --bg-input: #1f2633;          /* Inputs */
  --bg-hover: #242938;          /* Hover en tablas */
  
  /* Text (WCAG AA) */
  --text-primary: #f9fafb;      /* Texto principal (ratio >7:1) */
  --text-secondary: #e7ecff;    /* Texto secundario */
  --text-muted: #a7a5b1;        /* Texto terciario (ratio >4.5:1) */
  --text-disabled: #6b7280;     /* Texto deshabilitado */
  
  /* Borders */
  --border-primary: #2d3446;    /* Bordes principales */
  --border-secondary: #3b4254;  /* Bordes secundarios */
  --border-muted: rgba(255,255,255,0.10); /* Bordes sutiles */
  
  /* Primary Color */
  --primary: #5a4ea6;           /* Violeta principal */
  --primary-hover: #6d5fb8;     /* Hover */
  --primary-light: rgba(90,78,166,0.1);  /* Fondo sutil */
  --primary-border: rgba(90,78,166,0.2); /* Border sutil */
  
  /* Semantic Colors */
  --success: #10b981;           /* Verde éxito */
  --success-light: rgba(16,185,129,0.1);
  --success-border: rgba(16,185,129,0.2);
  
  --error: #ef4444;             /* Rojo error */
  --error-light: rgba(239,68,68,0.1);
  --error-border: rgba(239,68,68,0.2);
  
  --warning: #f59e0b;           /* Amarillo advertencia */
  --warning-light: rgba(245,158,11,0.1);
  --warning-border: rgba(245,158,11,0.2);
  
  --info: #3b82f6;              /* Azul info */
  --info-light: rgba(59,130,246,0.1);
  --info-border: rgba(59,130,246,0.2);
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);
  --shadow-primary: 0 10px 30px rgba(90,78,166,0.2);
}
```

---

## 🔧 Estrategia de Implementación

### Fase 1: Actualizar Paleta y Estilos Base ✅
- [x] Actualizar `styles.css` con nueva paleta
- [x] Mantener clases existentes pero mejorar contraste
- [x] Agregar nuevas clases de utilidad

### Fase 2: Crear Componentes Reutilizables
- [ ] `shared/components/button.component.ts` (primary, secondary, danger)
- [ ] `shared/components/input.component.ts` (text, email, number, select)
- [ ] `shared/components/badge.component.ts` (status, type)
- [ ] `shared/components/toast.component.ts` (success, error, warning, info)
- [ ] `shared/components/loading.component.ts` (spinner)

### Fase 3: Implementar Login Page (NUEVA)
- [ ] `auth/login.page.ts` - Página de login
- [ ] `auth/auth.service.ts` - Servicio de autenticación
- [ ] `auth/auth.guard.ts` - Guard para rutas protegidas
- [ ] Integrar con backend JWT

### Fase 4: Mejorar Navbar
- [ ] Agregar botón de logout
- [ ] Agregar indicador de usuario
- [ ] Mejorar responsive (hamburger menu)
- [ ] Traducir al español

### Fase 5: Mejorar Employees Page
- [ ] Traducir labels y mensajes
- [ ] Agregar stats cards (opcional)
- [ ] Mejorar tabla con hover states
- [ ] Agregar avatares con iniciales
- [ ] Agregar toasts para feedback

### Fase 6: Mejorar Contracts Page
- [ ] Traducir labels y mensajes
- [ ] Mejorar badges de estado
- [ ] Mejorar tabla con hover states
- [ ] Agregar toasts para feedback

### Fase 7: Mejorar Payroll Runs Page
- [ ] Traducir labels y mensajes
- [ ] Mejorar visualización de breakdown
- [ ] Agregar hero card para net pay
- [ ] Agregar toasts para feedback

### Fase 8: Testing y Validación
- [ ] Verificar que no se rompió funcionalidad
- [ ] Validar contraste WCAG AA
- [ ] Testing responsive
- [ ] Testing en diferentes navegadores

---

## 📝 Traducciones Español

### Navbar
- "Employees" → "Empleados"
- "Contracts" → "Contratos"
- "Payroll Runs" → "Nóminas"
- "Payroll Rules" → "Reglas"
- "Health" → "Estado"
- "Logout" → "Cerrar Sesión"

### Employees Page
- "Create Employee" → "Crear Empleado"
- "Employee Directory" → "Directorio de Empleados"
- "Name" → "Nombre"
- "Email" → "Correo Electrónico"
- "Date Joined" → "Fecha de Ingreso"
- "Status" → "Estado"
- "Active" → "Activo"
- "Inactive" → "Inactivo"
- "Refresh" → "Actualizar"
- "Export" → "Exportar"
- "Processing..." → "Procesando..."
- "No employees yet" → "Aún no hay empleados"

### Contracts Page
- "Create Contract" → "Crear Contrato"
- "Contract Type" → "Tipo de Contrato"
- "Base Salary" → "Salario Base"
- "Active" → "Activo"
- "No contracts yet" → "Aún no hay contratos"

### Payroll Runs Page
- "Create Payroll Run" → "Crear Nómina"
- "Employee" → "Empleado"
- "Period" → "Período"
- "Contract" → "Contrato"
- "Bonuses" → "Bonos"
- "Other Deductions" → "Otras Deducciones"
- "Gross Pay" → "Salario Bruto"
- "Net Pay" → "Salario Neto"
- "Breakdown" → "Desglose"
- "No payroll runs yet" → "Aún no hay nóminas"

### Login Page
- "Administrator Login" → "Inicio de Sesión Administrador"
- "Secure access to employee and payroll records" → "Acceso seguro a registros de empleados y nómina"
- "Username" → "Usuario"
- "Password" → "Contraseña"
- "Sign In" → "Iniciar Sesión"
- "Forgot password?" → "¿Olvidaste tu contraseña?"
- "This is a secure system..." → "Este es un sistema seguro. Los intentos de acceso no autorizados son registrados y reportados."

---

## ⚠️ Restricciones Críticas

1. **NO ROMPER FUNCIONALIDAD:**
   - Mantener todos los FormGroups existentes
   - Mantener todos los signals y observables
   - Mantener todos los use cases
   - Mantener todas las rutas

2. **NO USAR TAILWIND:**
   - El proyecto usa CSS puro
   - Convertir clases Tailwind a CSS custom

3. **MANTENER ARQUITECTURA:**
   - Clean Architecture (domain/application/infrastructure/presentation)
   - Standalone components
   - Dependency injection

4. **ACCESIBILIDAD:**
   - Contraste mínimo 4.5:1
   - Labels asociados a inputs
   - Focus states visibles
   - Área de click mínima 44x44px

---

## 🚀 Orden de Ejecución

1. ✅ Actualizar `styles.css` con nueva paleta
2. Crear componentes compartidos (button, input, badge, toast)
3. Implementar login page + auth service + guard
4. Mejorar navbar (logout, usuario, español)
5. Mejorar employees page (español, toasts, avatares)
6. Mejorar contracts page (español, toasts, badges)
7. Mejorar payroll runs page (español, toasts, hero card)
8. Testing completo

---

## 📦 Archivos a Crear/Modificar

### Crear:
- `src/app/presentation/pages/login.page.ts`
- `src/app/core/auth/auth.service.ts`
- `src/app/core/auth/auth.guard.ts`
- `src/app/presentation/shared/button.component.ts`
- `src/app/presentation/shared/input.component.ts`
- `src/app/presentation/shared/badge.component.ts`
- `src/app/presentation/shared/toast.component.ts`
- `src/app/presentation/shared/loading.component.ts`

### Modificar:
- `src/styles.css` ✅
- `src/app/presentation/app.component.ts`
- `src/app/presentation/app.routes.ts`
- `src/app/presentation/pages/employees.page.ts`
- `src/app/presentation/pages/contracts.page.ts`
- `src/app/presentation/pages/payroll-runs.page.ts`
- `src/environments/environment.ts`

---

## ✅ Checklist Final

- [ ] Paleta de colores WCAG AA compliant
- [ ] Todos los textos en español
- [ ] Login funcional con JWT
- [ ] Navbar con logout y usuario
- [ ] Toasts para feedback
- [ ] Tablas con hover states
- [ ] Badges con buen contraste
- [ ] Responsive design
- [ ] No se rompió ninguna funcionalidad
- [ ] Tests pasan (si existen)
- [ ] Lint clean
