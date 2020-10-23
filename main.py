from flask import Flask, request, session, url_for, render_template, redirect
import pymysql
import json

app = Flask(__name__)
app.secret_key = b'myspecialkey'
db = pymysql.connect(
    user='hail', 
    passwd='1234', 
    host='127.0.0.1', 
    db='english_note', 
    charset='utf8'
)

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    session['username'] = username
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

        session['userid'] = result['userid']

    return redirect(url_for('index'))

@app.route('/logout')
def logout():
    session.pop('username')
    session.pop('userid')
    return redirect(url_for('index'))

@app.route('/')
def index():
    if 'username' in session:
        with db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = 'select * from post where userid=%s'
            cursor.execute(sql, session['userid'])
            result = cursor.fetchall()
        return render_template('index.html', posts=result)
    else:
        return render_template('login.html')

@app.route('/post', methods=['GET'])
def create_post_render():
    return render_template('create_post.html')

@app.route('/post', methods=['POST'])
def create_post_action():
    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        sql = 'insert into post(userid, title, videolink, memo, korean, english) values(%s, %s, %s, %s, %s, %s)'
        cursor.execute(sql, (session['userid'],
            request.form.get('title'),
            request.form.get('videolink'),
            request.form.get('memo'),
            request.form.get('korean'),
            request.form.get('english')))
        db.commit()

        sql = 'select last_insert_id() postid'
        cursor.execute(sql)
        result = cursor.fetchone()
    return result

@app.route('/post/<int:postid>')
def view_post_render(postid):
    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        sql = 'select * from post where postid=%s'
        cursor.execute(sql, postid)
        result = cursor.fetchone()
    return render_template('view_post.html', post=result)

@app.route('/modifypost/<int:postid>')
def modify_post_render(postid):
    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        sql = 'select * from post where postid=%s'
        cursor.execute(sql, postid)
        result = cursor.fetchone()
    return render_template('modify_post.html', post=result)

@app.route('/post/<int:postid>', methods=['PUT'])
def modify_post_action(postid):
    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        sql = 'update post set title=%s, videolink=%s, memo=%s, korean=%s, english=%s where postid=%s'
        cursor.execute(sql,
            (request.form.get('title'),
            request.form.get('videolink'),
            request.form.get('memo'),
            request.form.get('korean'),
            request.form.get('english'),
            postid))
        db.commit()
    return {'postid' : postid}\

@app.route('/post/<int:postid>', methods=['DELETE'])
def delete_post_action(postid):
    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        sql = 'delete from post where postid=%s'
        cursor.execute(sql, postid)
    db.commit()
    return 'success'

if __name__ == '__main__':
    app.run(host='192.168.200.172', port='13300')