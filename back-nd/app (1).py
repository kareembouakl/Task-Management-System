from flask_sqlalchemy import SQLAlchemy
from flask import Flask,request,jsonify,abort
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from .db_config import DB_CONFIG
import jwt
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONFIG
db = SQLAlchemy(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
CORS(app)
migrate = Migrate(app, db)
from .model.manager import manager, manager_schema
from .model.employee import employee, employees_schema
from .model.task import task, tasks_schema
SECRET_KEY = "b'|\xe7\xbfU3`\xc4\xec\xa7\xa9zf:}\xb5\xc7\xb9\x139^3@Dv'"


def create_token(manager_id):
    payload = {
        'sub': manager_id
    }
    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm='HS256'
    )

def extract_auth_token(authenticated_request):
    auth_header = authenticated_request.headers.get('Authorization')
    if auth_header:
        return auth_header.split(" ")[1]
    else:
        return None

def decode_token(token):
    payload = jwt.decode(token, SECRET_KEY, 'HS256')
    return payload['sub']


@app.route('/employee', methods=['POST'])
def add_employee():    
    if not request: 
        return jsonify({'Error': 'Input empty'})
    if not isinstance(request.json, dict):
        return jsonify({'Error': 'Input must be in JSON format'})
    employee_name = request.json["name"]
    employee_phone = request.json["phone"]
    employee_address = request.json["address"]
    employee_department = request.json["department"]

    if not employee_name: 
        return jsonify({'Error': 'employee_name field empty'})
    if not employee_phone:
        return jsonify({'Error': 'employee_phone field empty'})
    if not employee_address: 
        return jsonify({'Error': 'employee_address field empty'})
    if not employee_department:
        return jsonify({'Error': 'employee_department field empty'})
   
    token = extract_auth_token(request)
    
    if token:
        try:
            manager_id = decode_token(token)
            
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            abort(403)
    else:
        manager_id = None

    t = employee(employee_name, employee_phone, employee_address, employee_department,manager_id)

    db.session.add(t)
    db.session.commit()
    return jsonify(employees_schema.dump(t))

@app.route('/employee', methods=['GET'])
def get_employees():
    token = extract_auth_token(request)
    if not token:
        abort(403)
    else:
        try:
            manager_id = decode_token(token)
            print(manager_id)
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            abort(403)
    employees = employee.query.filter_by(manager_id=manager_id)
    return jsonify(employees_schema.dump(employees,many=True))


@app.route('/employee/<int:employee_id>/task', methods=['POST'])
def add_task(employee_id):    
    if not request: 
        return jsonify({'Error': 'Input empty'})
    if not isinstance(request.json, dict):
        return jsonify({'Error': 'Input must be in JSON format'})
    task_name = request.json["task"]
    task_deadline = request.json["deadline"]
    task_commit = request.json["commit"]
    task_percentage = request.json["percentage"]

    if not task_name: 
        return jsonify({'Error': 'task_name field empty'})
    if not task_deadline:
        return jsonify({'Error': 'task_deadline field empty'})
    if not  task_commit: 
        return jsonify({'Error': 'task_commit field empty'})
    if not task_percentage:
        return jsonify({'Error': 'task_percentage field empty'})
   
    token = extract_auth_token(request)
    
    if token:
        try:
            manager_id = decode_token(token)
            
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            abort(403)
    else:
        manager_id = None

    t = task(task_name, task_deadline, task_commit,task_percentage,employee_id)

    db.session.add(t)
    db.session.commit()
    return jsonify(tasks_schema.dump(t))

@app.route('/employee/<int:employee_id>/task', methods=['GET'])
def get_tasks(employee_id):
    token = extract_auth_token(request)
    if not token:
        abort(403)
    else:
        try:
            manager_id = decode_token(token)
            print(manager_id)
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            abort(403)
    tasks = task.query.filter_by(employee_id=employee_id)
    return jsonify(tasks_schema.dump(tasks,many=True))

'''
@app.route('/exchangeRate', methods=['GET'])
def get_exchange_rate():
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(hours=72)
    employees = employee.query.filter(employee.added_date.between(start_date, end_date), employee.usd_to_lbp == True).all()
    sum = 0
    i = 0
    for t in employees:
        sum += t.lbp_amount / t.usd_amount
        i += 1
    if i != 0:
        sell_usd_rate = sum / i
    else: 
        sell_usd_rate = None

    employees = employee.query.filter(employee.added_date.between(start_date, end_date), employee.usd_to_lbp == False).all()
    sum = 0
    i = 0
    for t in employees:
        sum += t.lbp_amount / t.usd_amount
        i += 1
    if i != 0:
        buy_usd_rate = sum / i
    else: 
        buy_usd_rate = None
    
    rates = { "usd_to_lbp" : sell_usd_rate, "lbp_to_usd" : buy_usd_rate }
    return jsonify(rates)
'''
@app.route('/manager', methods=['POST'])
def add_manager():
    if not request: 
        return jsonify({'Error': 'Input empty'})
    if not isinstance(request.json, dict):
        return jsonify({'Error': 'Input must be in JSON format'})

    manager_name = request.json["manager_name"]
    password = request.json["password"]

    if not manager_name: 
        return jsonify({'Error': 'manager_name field empty'})
    if not password:
        return jsonify({'Error': 'Password field empty'})
    u = manager(manager_name,password)
    
    db.session.add(u)
    db.session.commit()
    message = jsonify(manager_schema.dump(u))

    return message

@app.route('/authentication', methods=['POST'])
def authenticate():
    if not request: 
        return jsonify({'Error': 'Input empty'})
    if not isinstance(request.json, dict):
        return jsonify({'Error': 'Input must be in JSON format'})

    manager_name = request.json["manager_name"]
    password = request.json["password"]
    manager_instance  = manager.query.filter_by(manager_name=manager_name).first()

    if not manager_name or not password: 
        abort(400)
    if not manager_instance:
        abort(403)
    if not bcrypt.check_password_hash(manager_instance.hashed_password, password):
        abort(403)
    
    token = create_token(manager_instance.id)

    
    return jsonify({"token": token})
