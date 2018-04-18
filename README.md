![logo](https://raw.github.com/1N0T/images/master/global/1N0T.png)
# bottleCRUD
Ejemplo **RESTFull** con **python bottle** y **SQLite**.

[Bottle](https://bottlepy.org/docs/dev/) es un microframework de python que, en un único fichero de unos cuantos KB., contiene todo lo necesario para crear un seridow WEB que propocione **servicios REST**.

Para ejecutar el servidor:

    python main.py

Esto levanta un servidor WEB que escucha en [http://localhost:6789](http://localhost:6789) y que responde a los guientes comandos:

#### Añadir un registro a la tabla SQLite.

    curl -i http://localhost:6789/OT/ -H "Content-type: application/json" -X POST -d '{"ot": "GMIK231", "descripcion": "Reg: 1", "tipo": "w", "orden": 10, "ultimo_transporte": "2018-01-05T12:23:15.000Z"}'

#### Modificar el registro anterior.

    curl -i http://localhost:6789/OT/ -H "Content-type: application/json" -X PUT -d '{"ot": "GMIK231", "descripcion": "Reg: 1 modificado", "tipo": "c", "orden": 11, "ultimo_transporte": "2018-01-05T12:28:15.000Z"}'
    
#### Recuperar todos los registros.

    curl -i http://localhost:6789/OT/ -H "Content-type: application/json" -X GET
    
#### Recuperar un registro determinado.

    curl -i http://localhost:6789/OT/GMIK231 -H "Content-type: application/json" -X GET
    
#### Recuperar los registros que cumplen las condiciones.

    curl -i http://localhost:6789/OT/QRY/'\{"descripcionLike":"Reg"\}' -H "Content-type: application/json" -X GET
    
#### Borrar un registro determinado.

    curl -i http://localhost:6789/OT/GMIK231 -H "Content-type: application/json" -X DELETE
    
    
