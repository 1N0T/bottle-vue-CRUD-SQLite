#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import time
import datetime
import subprocess
import sqlite3

from bottle import route, run, response, request, abort, error, static_file
from utils  import utilidades

@route('/api/proyectos/', method='OPTIONS') 
def enable_CORS_proyectos():
    utilidades.permitir_CORS()
    return {'status': 'OK', 'mensajes': ['OK'], 'datos': []}

@route('/api/proyectos/<id>', method='OPTIONS')
def enable_CORS_proyectos(id):
    utilidades.permitir_CORS()
    return {'status': 'OK', 'mensajes': ['OK'], 'datos': []}

@route('/api/proyectos/qry/<qry>', method='OPTIONS')
def enable_CORS_proyectos(qry):
    utilidades.permitir_CORS()
    return {'status': 'OK', 'mensajes': ['OK'], 'datos': []}



#===============================================================================
# Consulta de todos los registros
# curl -i http://localhost:6789/api/proyectos/ -H "Content-type: application/json" -X GET
#===============================================================================
@route('/api/proyectos/', method='GET')
def get_proyectos():
    utilidades.permitir_CORS()
    registros = []
    SQL = """
          SELECT id,
                 descripcion,
                 estado,
                 responsable,
                 fecha_peticion,
                 fecha_inicio,
                 fecha_fin
            FROM proyectos
        ORDER BY id,
                 descripcion
          """
    for fila in cursor.execute(SQL):
        columnas = [columna[0] for columna in cursor.description]
        registros.append(utilidades.fila_a_diccionario(columnas, fila))

    if registros:
        return {'status': 'OK', 'mensajes': ['Selección realizada con éxito'], 'datos': registros}        
    else:
        return {'status': 'OK', 'mensaje': ['No existen registros para la selección'], 'datos': registros}



#===============================================================================
# Consulta de un registro concreto.
# curl -i http://localhost:6789/api/proyectos/GMIK231 -H "Content-type: application/json" -X GET
#===============================================================================
@route('/api/proyectos/<id>', method='GET')
def get_proyectos(id):
    utilidades.permitir_CORS()
    SQL = """
          SELECT id,
                 descripcion,
                 estado,
                 responsable,
                 fecha_peticion,
                 fecha_inicio,
                 fecha_fin
            FROM proyectos
           WHERE id = ?
        ORDER BY id,
                 descripcion
          """

    registros = []
    cursor.execute(SQL, (id,))
    fila = cursor.fetchone()
    if fila:
        columnas = [columna[0] for columna in cursor.description]
        registros.append(utilidades.fila_a_diccionario(columnas, fila))

    if registros:
        return {'status': 'OK', 'mensajes': ['Selección realizada con éxito'], 'datos': registros}        
    else:
        return {'status': 'OK', 'mensajes': ['No existen registros para la selección'], 'datos': registros}



#===============================================================================
# Consulta de registros que cumplen las condiciones recibidas como parametro.
# curl -i http://localhost:6789/api/proyectos/QRY/'\{"descripcionLIKE":"Reg"\}' -H "Content-type: application/json" -X GET
#===============================================================================
@route('/api/proyectos/qry/<qry>', method='GET')
def get_qry(qry):
    utilidades.permitir_CORS()
    SQL = """
          SELECT id,
                 descripcion,
                 estado,
                 responsable,
                 fecha_peticion,
                 fecha_inicio,
                 fecha_fin
            FROM proyectos
           WHERE 1 = 1
          """

    datos_json = qry
    objeto_datos = json.loads(datos_json.decode("utf-8"))
    if 'idEQ' in objeto_datos:
        SQL = SQL + " AND id = '" + objeto_datos['idEQ'] + "' "    
    if 'idGE' in objeto_datos:
        SQL = SQL + " AND id >= '" + objeto_datos['idGE'] + "' "    
    if 'idLE' in objeto_datos:
        SQL = SQL + " AND id <= '" + objeto_datos['idLE'] + "' "    
    if 'idLIKE' in objeto_datos:
        SQL = SQL + " AND id LIKE '%" + objeto_datos['idLIKE'] + "%' "    
    if 'descripcionLIKE' in objeto_datos:
        SQL = SQL + " AND descripcion LIKE '%" + objeto_datos['descripcionLIKE'] + "%' "    
    
    SQL = SQL + " ORDER BY id, descripcion"

    registros = []
    for fila in cursor.execute(SQL):
        columnas = [columna[0] for columna in cursor.description]
        registros.append(utilidades.fila_a_diccionario(columnas, fila))

    if registros:
        return {'status': 'OK', 'mensajes': ['Selección realizada con éxito'], 'datos': registros}        
    else:
        return {'status': 'OK', 'mensajes': ['No existen registros para la selección'], 'datos': registros}



#===============================================================================
# Borramos un registro. 
# curl -i http://localhost:6789/api/proyectos/GMIK231 -H "Content-type: application/json" -X DELETE
#===============================================================================
@route('/api/proyectos/<id>', method='DELETE') 
def delete_proyectos(id):
    utilidades.permitir_CORS()
    try:
       cursor.execute("DELETE FROM proyectos WHERE id = ?", (id, ))
       conexion.commit()
       if cursor.rowcount == 0:
          abort(404, 'ERROR al borrar registro')

    except sqlite3.Error as err:
       return {'status': 'KO', 'mensajes': ['ERROR SQL al insertar los datos.', err.args[0]], 'datos': []}

    return {'status': 'OK', 'mensajes': ['Registro borrado'], 'datos': []}



#===============================================================================
# Añadimos el registro.
# curl -i http://localhost:6789/api/proyectos/ -H "Content-type: application/json" -X POST -d '{"id": "prj231", "descripcion": "Primer proyecto", "estado": 1, "responsable": 2, "fecha_peticion": "2018-01-05T12:23:15.000Z"}'
#===============================================================================
@route('/api/proyectos/', method='POST') 
def post_proyectos():
    utilidades.permitir_CORS()
    datos_json = request.body.read()
    if not datos_json:
        return {'status': 'KO', 'mensajes': ['No ha proporcionado datos. '], 'datos': []}
    else:
        objeto_datos = json.loads(datos_json.decode("utf-8"))
        if not 'id'          in objeto_datos   or \
           not 'descripcion' in objeto_datos:
           return {'status': 'KO', 'mensajes': ['Faltan datos obligatorios. '], 'datos': []}
        else:
            if  (not objeto_datos['id']          or objeto_datos['id']          == '' or 
                 not objeto_datos['descripcion'] or objeto_datos['descripcion'] == ''):
                return {'status': 'KO', 'mensajes': ['Faltan datos obligatorios. '], 'datos': []}
            try:
                SQLcol = "INSERT INTO proyectos (id, descripcion"
                SQLval = ") VALUES (?, ?"
                valores = [objeto_datos['id'],objeto_datos['descripcion']]
                if 'estado' in objeto_datos:
                    SQLcol += ", estado"
                    SQLval += ", ?"
                    if objeto_datos['estado']:
                        valores.append(objeto_datos['estado'])
                    else:
                        valores.append(None)
                if 'responsable' in objeto_datos:
                    SQLcol += ", responsable"
                    SQLval += ", ?"
                    if objeto_datos['responsable']:
                        valores.append(objeto_datos['responsable'])
                    else:
                        valores.append(None)
                if 'fecha_peticion' in objeto_datos:
                    SQLcol += ", fecha_peticion"
                    SQLval += ", ?"
                    if objeto_datos['fecha_peticion']:
                        valores.append(datetime.datetime.fromtimestamp(time.mktime(time.strptime(objeto_datos['fecha_peticion'], "%Y-%m-%d"))))
                    else:
                        valores.append(None)
                if 'fecha_inicio' in objeto_datos:
                    SQLcol += ", fecha_inicio"
                    SQLval += ", ?"
                    if objeto_datos['fecha_inicio']:
                        valores.append(datetime.datetime.fromtimestamp(time.mktime(time.strptime(objeto_datos['fecha_inicio'], "%Y-%m-%d"))))
                    else:
                        valores.append(None)
                if 'fecha_fin' in objeto_datos:
                    SQLcol += ", fecha_fin"
                    SQLval += ", ?"
                    if objeto_datos['fecha_fin']:
                        valores.append(datetime.datetime.fromtimestamp(time.mktime(time.strptime(objeto_datos['fecha_fin'], "%Y-%m-%d"))))
                    else:
                        valores.append(None)

                SQL = SQLcol + SQLval + ")"
                cursor.execute(SQL, valores)
                conexion.commit()

            except sqlite3.Error as err:
                return {'status': 'KO', 'mensajes': ['ERROR SQL al insertar los datos.', err.args[0]], 'datos': []}

        return {'status': 'OK', 'mensajes': ['Registro insertado correctamente.'], 'datos': []}



#===============================================================================
# Actualizamos la información del registro 
# curl -i http://localhost:6789/api/proyectos/ -H "Content-type: application/json" -X PUT -d '{"id": "prj231", "descripcion": "Primer proyecto", "estado": 1, "responsable": 2, "fecha_peticion": "2018-01-05T12:23:15.000Z"}'
#===============================================================================
@route('/api/proyectos/', method='PUT') 
def put_proyectos():
    utilidades.permitir_CORS()
    datos_json = request.body.read()
    if not datos_json:
        return {'status': 'KO', 'mensajes': ['No ha proporcionado datos. '], 'datos': []}
    else:
        objeto_datos = json.loads(datos_json.decode("utf-8"))
        if  (not objeto_datos['id']          or objeto_datos['id']          == '' or 
                not objeto_datos['descripcion'] or objeto_datos['descripcion'] == ''):
            return {'status': 'KO', 'mensajes': ['Faltan datos obligatorios. '], 'datos': []}
        else:
            try:
                SQLcol = "UPDATE proyectos SET id = ?, descripcion = ?"
                SQLfin = " WHERE id = ?"
                valores = [objeto_datos['id'],objeto_datos['descripcion']]
                if 'estado' in objeto_datos:
                    SQLcol += ", estado = ?"
                    if objeto_datos['estado']:
                        valores.append(objeto_datos['estado'])
                    else:
                        valores.append(None)
                if 'responsable' in objeto_datos:
                    SQLcol += ", responsable = ?"
                    if objeto_datos['responsable']:
                        valores.append(objeto_datos['responsable'])
                    else:
                        valores.append(None)
                if 'fecha_peticion' in objeto_datos:
                    SQLcol += ", fecha_peticion = ?"
                    if objeto_datos['fecha_peticion']:
                        valores.append(datetime.datetime.fromtimestamp(time.mktime(time.strptime(objeto_datos['fecha_peticion'], "%Y-%m-%d"))))
                    else:
                        valores.append(None)
                if 'fecha_inicio' in objeto_datos:
                    SQLcol += ", fecha_inicio = ?"
                    if objeto_datos['fecha_inicio']:
                        valores.append(datetime.datetime.fromtimestamp(time.mktime(time.strptime(objeto_datos['fecha_inicio'], "%Y-%m-%d"))))
                    else:
                        valores.append(None)
                if 'fecha_fin' in objeto_datos:
                    SQLcol += ", fecha_fin = ?"
                    if objeto_datos['fecha_fin']:
                        valores.append(datetime.datetime.fromtimestamp(time.mktime(time.strptime(objeto_datos['fecha_fin'], "%Y-%m-%d"))))
                    else:
                        valores.append(None)

                valores.append(objeto_datos['id'])

                SQL = SQLcol + SQLfin
                cursor.execute(SQL, valores)
                conexion.commit()

            except sqlite3.Error as err:
                return {'status': 'KO', 'mensajes': ['ERROR SQL al modificar los datos.', err.args[0]], 'datos': []}

        return {'status': 'OK', 'mensajes': ['Registro modificado correctamente.'], 'datos': []}



#===============================================================================
# Creamos la base de datos y la tabla, si procede.
#===============================================================================
conexion = sqlite3.connect('proyectos.db')
cursor   = conexion.cursor()
SQL      = """
           CREATE TABLE IF NOT EXISTS proyectos (
                  id                    VARCHAR PRIMARY KEY NOT NULL UNIQUE,
                  descripcion           VARCHAR             NOT NULL,
                  estado                INTEGER             NOT NULL DEFAULT 0,
                  responsable           INTEGER             NOT NULL DEFAULT 0,
                  fecha_peticion        DATETIME            NOT NULL DEFAULT (datetime('now','localtime')),
                  fecha_inicio          DATETIME,
                  fecha_fin             DATETIME
           )
           """

cursor.execute(SQL)
conexion.commit()



#===============================================================================
# Cerramos las conexiones.
#===============================================================================
def end():
    cursor.close()
    conexion.close()
