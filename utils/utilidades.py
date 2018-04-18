#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bottle import response



#===============================================================================
# Convertimos una lista en un diccionario, utilizando la lista pasada en el 
# primer parámetro como la relación de claves del diccionario.
#===============================================================================
def fila_a_diccionario(atributos, fila):
    diccionario = {}
    posicion    = 0
    for atributo in atributos:
        diccionario[atributo] = fila[posicion]
        posicion = posicion + 1

    return diccionario



#===============================================================================
# Permitimos las peticiones desde otros dominios.
#===============================================================================
def permitir_CORS():
    response.set_header('Access-Control-Allow-Origin', '*')    
    response.set_header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')    
    response.set_header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Token, X-Requested-With, X-CSRF-Token')    
