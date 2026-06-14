# NIV'Pop 🍦

Plataforma de helado artesanal con tests psicológicos.  
**NIV** = Nieve · **POP** = Personalización y Perfección

---

## Estructura del proyecto

```
nivpop/
├── index.html              ← Kiosco (página principal)
├── pages/
│   └── dashboard.html      ← Panel de administración
├── css/
│   ├── kiosk.css           ← Estilos del kiosco
│   └── dashboard.css       ← Estilos del dashboard
├── js/
│   ├── db.js               ← Capa de datos compartida (localStorage)
│   ├── kiosk.js            ← Lógica del kiosco y tests
│   └── dashboard.js        ← Lógica del dashboard y gráficas
├── .vscode/
│   └── settings.json       ← Configuración de VS Code
└── README.md
```

---

## Cómo correr el proyecto en VS Code

### Opción 1 — Live Server (recomendado)
1. Instala la extensión **Live Server** (Ritwick Dey) en VS Code
2. Click derecho en `index.html` → **Open with Live Server**
3. Para el dashboard: click derecho en `pages/dashboard.html` → **Open with Live Server**

### Opción 2 — Abrir directo en el navegador
1. Abre `index.html` directamente en Chrome/Edge/Firefox
2. Para el dashboard abre `pages/dashboard.html`

> ⚠️ **Nota:** Los dos archivos deben abrirse desde el **mismo navegador** para que compartan el localStorage y el kiosco pueda enviar resultados al dashboard en tiempo real.

---

## Cómo funciona la conexión kiosco ↔ dashboard

```
                    localStorage
  [ Kiosco ]  ──────────────────→  [ Dashboard ]
  Completa test        NivDB         Lee resultados
  Guarda resultado     db.js         Actualiza KPIs
```

1. El cliente completa un test en el **kiosco** (`index.html`)
2. Al finalizar, `db.js` guarda el resultado en `localStorage` bajo la clave `nivpop_results`
3. Se dispara el evento `nivpop:nuevo` en el navegador
4. El **dashboard** (`pages/dashboard.html`) escucha ese evento y actualiza la tabla, KPIs y gráficas **en tiempo real** — sin recargar la página

### Datos del resultado guardado
```js
{
  id:          1234567890,       // timestamp único
  fecha:       "22/3/2026",      // fecha local
  hora:        18,               // hora (0-23)
  min:         35,
  timeStr:     "18:35",
  modo:        "solo",           // "solo" | "duo" | "estado"
  flavorId:    "mango",          // ID del sabor
  sabor:       "Mango Solar",    // nombre del sabor
  flavorColor: "#f09233",
  nombre1:     "Ana",
  nombre2:     null,             // solo en modo dúo
  compat:      null,             // porcentaje, solo en modo dúo
}
```

---

## Stack

| Capa | Tecnología |
|------|-----------|
| UI Kiosco | HTML5 + CSS3 + JavaScript vanilla |
| UI Dashboard | HTML5 + CSS3 + Chart.js 4.4.1 |
| Datos | localStorage (via db.js) |
| Tipografía | Cormorant Garamond + Outfit (kiosco) · Syne + DM Sans (dashboard) |
| Gráficas | Chart.js — línea, doughnut, barras, sparklines |

---

## Próximos pasos (migración a Next.js)

- [ ] Migrar a **Next.js 14** con App Router
- [ ] Reemplazar localStorage con **Supabase** (PostgreSQL)
- [ ] Convertir kiosco a `src/app/page.tsx`
- [ ] Convertir dashboard a `src/app/admin/page.tsx`
- [ ] Agregar autenticación para el panel de admin

---

*NIV'Pop · Ingeniería de Software · 2026*
