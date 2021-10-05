from typing import final
from flask import Flask
from flask import request, session
from flask import url_for, render_template, redirect, jsonify
import pymysql
import json
import sys

from pymysql import connections

app = Flask(__name__, static_url_path='/dist', static_folder='fe_dist')
app.secret_key = b'myspecialkey'

def db_connect():
    return pymysql.connect(
        user='root', 
        passwd='1234', 
        host='127.0.0.1', 
        db='english_note', 
        charset='utf8'
    )

@app.route('/posts', methods=['GET'])
def get_posts():
    if 'username' in session:
        db = None
        response_data = None
        try:
            db = db_connect()
            with db.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = 'select * from post where userid=%s'
                cursor.execute(sql, session['userid'])
                result = cursor.fetchall()
            response_data = {
                'state': 'success',
                'posts': result
            }
        except:
            response_data = {
                'state': 'error'
            }
        finally:
            if db != None:
                db.close()
            return response_data
    else:
        return {
            'state': 'error'
        }

@app.route('/post/<int:postid>', methods=['GET'])
def get_post(postid):
    if 'username' in session:
        db = None
        response_data = None
        try:
            db = db_connect()
            with db.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = 'select * from post where userid=%s and postid=%s'
                cursor.execute(sql, (session['userid'], postid))
                result = cursor.fetchone()
            response_data = {
                'state': 'success',
                **result
            }
        except:
            response_data = {
                'state': 'error'
            }
        finally:
            if db != None:
                db.close()
            return response_data
    else:
        return {
            'state': 'error'
        }

@app.route('/login', methods=['POST'])
def login():
    db = None
    response_data = None
    try:
        db = db_connect()
        username = request.get_json()['username']
        print(username)
        with db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = 'select * from user where username=%s'
            cursor.execute(sql, username)
            result = cursor.fetchone()
            if result == None:
                sql = 'insert into user(username) values (%s)'
                cursor.execute(sql, username)
                db.commit()

                sql = 'select * from user where username=%s'
                cursor.execute(sql, username)
                result = cursor.fetchone()
            
            session['username'] = username
            session['userid'] = result['userid']

        response_data = {
            'state': 'success',
            'username': username
        }
    except:
        response_data = {
            'state': 'error'
        }
    finally:
        if db != None:
            db.close()
        return response_data

@app.route('/logout')
def logout():
    session.pop('username')
    session.pop('userid')
    return redirect(url_for('index'))

@app.route('/')
def index():
    if 'username' in session:
        db = None
        try:
            db = db_connect()
            with db.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = 'select * from post where userid=%s'
                cursor.execute(sql, session['userid'])
                result = cursor.fetchall()
            if db != None:
                db.close()
            return render_template('index.html', posts=result)
        except:
            if db != None:
                db.close()
            return 'error'
    else:
        return render_template('__login.html')

# @app.route('/post', methods=['GET'])
# def create_post_render():
#     return render_template('create_post.html')

@app.route('/post', methods=['POST'])
def create_post_action():
    db = None
    try:
        db = db_connect()
        data = request.get_json()
        with db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = 'insert into post(userid, title, videolink, memo, korean, english) values(%s, %s, %s, %s, %s, %s)'
            cursor.execute(sql, (session['userid'],
                data.get('title'),
                data.get('videolink'),
                data.get('memo'),
                data.get('korean'),
                data.get('english')))
            db.commit()

            sql = 'select last_insert_id() postid'
            cursor.execute(sql)
            result = cursor.fetchone()

        if db != None:
            db.close()
        return result
    except:
        if db != None:
            db.close()
        return {
            'state': 'error'
        }

# @app.route('/post/<int:postid>')
# def view_post_render(postid):
#     db = None
#     try:
#         db = db_connect()
#         with db.cursor(pymysql.cursors.DictCursor) as cursor:
#             sql = 'select * from post where postid=%s'
#             cursor.execute(sql, postid)
#             result = cursor.fetchone()

#         if db != None:
#             db.close()
#         return render_template('view_post.html', post=result)
#     except:
#         if db != None:
#             db.close()
#         return 'error'

# @app.route('/modifypost/<int:postid>')
# def modify_post_render(postid):
#     db = None
#     try:
#         db = db_connect()
#         with db.cursor(pymysql.cursors.DictCursor) as cursor:
#             sql = 'select * from post where postid=%s'
#             cursor.execute(sql, postid)
#             result = cursor.fetchone()
        
#         if db != None:
#             db.close()
#         return render_template('modify_post.html', post=result)
#     except:
#         if db != None:
#             db.close()
#         return 'error'

@app.route('/post/<int:postid>', methods=['PUT'])
def modify_post_action(postid):
    db = None
    try:
        db = db_connect()
        data = request.get_json()
        with db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = 'update post set title=%s, videolink=%s, memo=%s, korean=%s, english=%s where postid=%s'
            cursor.execute(sql,
                (data.get('title'),
                data.get('videolink'),
                data.get('memo'),
                data.get('korean'),
                data.get('english'),
                postid))
            db.commit()
        
        if db != None:
            db.close()
        return {'postid' : postid}
    except:
        if db != None:
            db.close()
        return {
            'state': 'error'
        }

@app.route('/post/<int:postid>', methods=['DELETE'])
def delete_post_action(postid):
    db = None
    try:
        db = db_connect()
        with db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = 'delete from post where postid=%s'
            cursor.execute(sql, postid)
        db.commit()

        if db != None:
            db.close()
        return {
            'state': 'success'
        }
    except:
        if db != None:
            db.close()
        return {
            'state': 'error'
        }

if __name__ == '__main__':
    if len(sys.argv) == 3:
        host = sys.argv[1]
        port = sys.argv[2]
    elif len(sys.argv) == 2:
        host = sys.argv[1]
        port = '8000'
    else:
        host = '127.0.0.1'
        port = '8000'
    app.run(host=host, port=port, debug=True)
