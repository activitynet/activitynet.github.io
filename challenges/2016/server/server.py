# -*- coding: utf-8 -*-
"""
Created on Tue Feb 23 15:53:35 2016
@author: Wayner Barrios
@email: waybarrios@gmail.com// wayner.barriosquiroga@kaust.edu.sa

Server logic for Activity Net Challenge

"""
import cgi, json

from utils import verif_loggin

def user_loggin(form):
    email = form.getvalue('email')
    password = form.getvalue('password')
    validate_loggin = verif_loggin(email,password)
    print 'Content-Type: application/json\n\n'
    print json.dumps(validate_loggin)
    
if __name__ == '__main__':
    #form = cgi.FieldStorage()
    #action = form.getvalue('action')
    action='user_loggin'
    if action == 'user_loggin':
        email= input("Email: ")
        password= input ("Password: ")
        user_loggin(email,password)        
        #user_loggin(form)
        
    else:
        print 'Content-Type: application/json\n\n'
        print json.dumps('ERROR')