from typing import final
from flask import Flask, Response
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

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')
    # if 'username' in session:
    #     db = None
    #     try:
    #         db = db_connect()
    #         with db.cursor(pymysql.cursors.DictCursor) as cursor:
    #             sql = 'select * from post where userid=%s'
    #             cursor.execute(sql, session['userid'])
    #             result = cursor.fetchall()
    #         if db != None:
    #             db.close()
    #         return render_template('index.html', posts=result)
    #     except:
    #         if db != None:
    #             db.close()
    #         return 'error'
    # else:
    #     return render_template('index.html')

@app.route('/signin', methods=['POST'])
def signin():
    db = None
    try:
        db = db_connect()
        username = request.get_json()['username']
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

        response = Response(
            json.dumps({
                'userid': result['userid'],
                'username': username
            }),
            status=200,
            mimetype='application/json'
        )
    except:
        response = Response(
            json.dumps({
                'message': 'The database cannot be accessed.',
            }),
            status=403,
            mimetype='application/json'
        )
    finally:
        if db != None:
            db.close()

        return response

@app.route('/signout', methods=['GET'])
def signout():
    session.pop('username')
    session.pop('userid')
    return redirect(url_for('index'))

@app.route('/post', methods=['GET'])
def get_posts():
    if 'username' in session:
        db = None
        try:
            db = db_connect()
            with db.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = 'select * from post where userid=%s'
                cursor.execute(sql, session['userid'])
                result = cursor.fetchall()

            response = Response(
                json.dumps({
                    'posts': result
                }),
                status=200,
                mimetype='application/json'
            )
        except:
            response = Response(
                json.dumps({
                    'message': 'The database cannot be accessed.',
                }),
                status=403,
                mimetype='application/json'
            )
        finally:
            if db != None:
                db.close()

            return response
    else:
        return Response(
            json.dumps({
                'message': 'The user was not found in the session.',
            }),
            status=404,
            mimetype='application/json'
        )

@app.route('/post/<int:postid>', methods=['GET'])
def get_post(postid):
    if 'username' in session:
        db = None
        try:
            db = db_connect()
            with db.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = 'select * from post where userid=%s and postid=%s'
                cursor.execute(sql, (session['userid'], postid))
                result = cursor.fetchone()

            response = Response(
                json.dumps({
                    **result
                }),
                status=200,
                mimetype='application/json'
            )
        except:
            response = Response(
                json.dumps({
                    'message': 'The database cannot be accessed.',
                }),
                status=403,
                mimetype='application/json'
            )
        finally:
            if db != None:
                db.close()

            return response
    else:
        return Response(
            json.dumps({
                'message': 'The user was not found in the session.',
            }),
            status=404,
            mimetype='application/json'
        )

@app.route('/post', methods=['POST'])
def create_post():
    if 'username' in session:
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
            
            response = Response(
                json.dumps({
                    **result
                }),
                status=200,
                mimetype='application/json'
            )

        except:
            response = Response(
                json.dumps({
                    'message': 'The database cannot be accessed.',
                }),
                status=403,
                mimetype='application/json'
            )

        finally:
            if db != None:
                db.close()

            return response
    else:
        return Response(
            json.dumps({
                'message': 'The user was not found in the session.',
            }),
            status=404,
            mimetype='application/json'
        )

@app.route('/post/<int:postid>', methods=['PUT'])
def update_post(postid):
    if 'username' in session:
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

                sql = 'select * from post where postid=%s'
                cursor.execute(sql, postid)
                result = cursor.fetchone()

            response = Response(
                json.dumps({
                    **result
                }),
                status=200,
                mimetype='application/json'
            )
            
        except:
            response = Response(
                json.dumps({
                    'message': 'The database cannot be accessed.',
                }),
                status=403,
                mimetype='application/json'
            )

        finally:
            if db != None:
                db.close()

            return response
    else:
        return Response(
            json.dumps({
                'message': 'The user was not found in the session.',
            }),
            status=404,
            mimetype='application/json'
        )

@app.route('/post/<int:postid>', methods=['DELETE'])
def delete_post(postid):
    if 'username' in session:
        db = None
        try:
            db = db_connect()
            with db.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = 'delete from post where postid=%s'
                cursor.execute(sql, postid)
            db.commit()

            response = Response(
                status=204,
            )
        except:
            response = Response(
                json.dumps({
                    'message': 'The database cannot be accessed.',
                }),
                status=403,
                mimetype='application/json'
            )

        finally:
            if db != None:
                db.close()

            return response
    else:
        return Response(
            json.dumps({
                'message': 'The user was not found in the session.',
            }),
            status=404,
            mimetype='application/json'
        )

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
