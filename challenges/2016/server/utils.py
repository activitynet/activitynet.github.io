# -*- coding: utf-8 -*-
"""
Created on Tue Feb 23 16:21:31 2016


@author: Wayner Barrios
@email: waybarrios@gmail.com// wayner.barriosquiroga@kaust.edu.sa
Utils for Activity Net Challenge Server

"""
#Python libs

import MySQLdb

#Initialize database params
DB_HOST = 'localhost' 
DB_USER = 'root' 
DB_PASS = '' 
DB_NAME = 'challenge16' 


def verif_loggin(email,password):
    """
    Check user password in mysql database    
    
    Input: (str) email, (str) password
    Return  (boolean) loggin_status (True:Loggin // False:Passwords dont match)
    
    """
    #params
    database_params = [DB_HOST, DB_USER, DB_PASS, DB_NAME] 
        
    cmd="select aes_decrypt('%s','k@ust.16vcc') as encriptado from users where email='%s';
    
    #Connect to database
    conn = MySQLdb.connect(*database_params)
    #create cursor
    cursor = conn.cursor()  
    # execute cursor
    cursor.execute(query, (password, email))
    
    if query.upper().startswith('SELECT'): 
        data = cursor.fetchall() 
    else:
        conn.commit()              
        data = None 
    #close cursor
    cursor.close()                  
    #close connection
    conn.close()                   
    
    print data
    
    
    return 