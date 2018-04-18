export function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}



export function searchIgnoringAccents(cadena, aBuscar) {
  cadena  = cadena.toLowerCase()
  aBuscar = aBuscar.toLowerCase()

  // Ignoraremos acentos
  cadena = cadena.replace(/[áäâà]/gi,"a")
  cadena = cadena.replace(/[éëêè]/gi,"e")
  cadena = cadena.replace(/[íïîì]/gi,"i")
  cadena = cadena.replace(/[óöôò]/gi,"o")
  cadena = cadena.replace(/[úüûù]/gi,"u")
  cadena = cadena.replace(/ñ/gi,"n")
  cadena = cadena.replace(/ç/gi,"c")

  aBuscar = aBuscar.replace(/[áäâà]/gi,"a")
  aBuscar = aBuscar.replace(/[éëêè]/gi,"e")
  aBuscar = aBuscar.replace(/[íïîì]/gi,"i")
  aBuscar = aBuscar.replace(/[óöôò]/gi,"o")
  aBuscar = aBuscar.replace(/[úüûù]/gi,"u")
  aBuscar = aBuscar.replace(/ñ/gi,"n")
  aBuscar = aBuscar.replace(/ç/gi,"c")
  
  let expresionRegular = new RegExp(aBuscar, "i")
  if ( expresionRegular.test(cadena) || aBuscar == '' ) {
    return true;
  } else {
    return false;
  }
}


export function objetoContieneValor( valor, objeto ) {
  if ( typeof valor != 'string' ) {
     return false;
  }

  for ( var propiedad in objeto ) {
     if ( typeof objeto[propiedad] == 'object' || typeof objeto[propiedad] == 'array' ) {
        return objetoContieneValor( valor, objeto[propiedad] )
     } else {
        if ( typeof objeto[propiedad] == 'string' ) {
           if ( objeto[propiedad].toLowerCase().indexOf(valor.toLowerCase()) > -1 ) {
              return true;
           }
        } else {
           if ( typeof objeto[propiedad] == 'number' ) {
              if ( objeto[propiedad].toString().toLowerCase().indexOf(valor.toLowerCase()) > -1 ) {
                 return true;
              }
           }
        }
     }
  }
  return false;
}