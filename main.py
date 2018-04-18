#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from bottle import route, run, request, abort, error, static_file
from api    import dbProyectos



#===============================================================================
# Configuramos directorios.
#===============================================================================
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')



#===============================================================================
# Definimos el formato de las salidas para las páginas de error.
#===============================================================================
@error(400)
def status_error_400(mensaje_error):
   codigo = 400
   return {'status': codigo, 'mensaje': 'KO'}

@error(401)
def status_error_401(mensaje_error):
   codigo = 401
   return {'status': codigo, 'mensaje': 'KO, cliente no autorizado'}

@error(404)
def status_error_404(mensaje_error):
   codigo = 404
   return {'status': codigo, 'mensaje': 'KO, no existe el registro'}



#===============================================================================
# Mapeamos el contenido estático.
#===============================================================================
@route('/')
def recursos():
    return static_file('index.html', root = BASE_DIR)

@route('/static/<fichero:path>')
def recursos(fichero):
    return static_file(fichero, root = STATIC_DIR)



#===============================================================================
# Iniciamos el servidor web que expone las funciones en todas sus direcciones
# de red.
#===============================================================================
run(reloader = True, debug = True, host = "0.0.0.0", port = 6789)
dbProyectos.end()
