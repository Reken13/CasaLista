# Casa Lista

Sitio web estatico para vender meal prep y comida casera.

## Como usarlo

Abre `index.html` en el navegador. El sitio detecta el idioma del navegador y puede enviar a:

- `index.html` para espanol
- `en.html` para ingles
- `pt.html` para portugues

Para activar pedidos reales por WhatsApp, cambia el valor
`businessWhatsAppNumber` en `script.js` por el numero del negocio en formato internacional,
sin espacios ni simbolos.

Ejemplo:

```js
const businessWhatsAppNumber = "15551234567";
```

Tambien puedes editar precios, platos, textos y correo directamente en `index.html`.
