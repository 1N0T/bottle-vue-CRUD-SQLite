// Esta función devuelve la posición exacta de la esquina superior
// izquierda (respecto al inicio de la ventana, así como el alto y 
// ancho de la ventana del navegador

// Código extraido de https://getpocket.com/a/read/302539924 
export function getPosition(el) {
   var xPos = 0;
   var yPos = 0;

   while (el) {
      if (el.tagName == "BODY") {
         // Recuperamos el número de pixels que el página está desplazado
         // horizontal y verticalmente (scrolled).
         // Tenemos en consideración las particalirades de diversos navegadores.
         var xScroll = el.scrollLeft || document.documentElement.scrollLeft
         var yScroll = el.scrollTop  || document.documentElement.scrollTop

         xPos += (el.offsetLeft - xScroll + el.clientLeft)
         yPos += (el.offsetTop  - yScroll + el.clientTop)
      } else {
         // for all other non-BODY elements
         xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft)
         yPos += (el.offsetTop  - el.scrollTop  + el.clientTop)
      }

      el = el.offsetParent
   }
   return {
      elX: xPos,
      elY: yPos,
      windowX: window.innerWidth,
      windowY: window.innerHeight
   }
}
 
 // Ejemplo de uso
 // window.addEventListener("scroll", updatePosition, false);
 // window.addEventListener("resize", updatePosition, false);
 
 // function updatePosition() {
   // add your code to update the position when your browser
   // is resized or scrolled
 // }