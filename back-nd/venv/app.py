from flask_sqlalchemy import SQLAlchemy
from flask import Flask,request,jsonify,abort
from flask_cors import CORS
from datetime import datetime
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@localhost:3306/exchange'
db = SQLAlchemy(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
CORS(app)
migrate = Migrate(app, db)

from employee import Employee, employees_schema,employee_schema
from task import Task, tasks_schema
from TaskAssignment import TaskAssignment,taskassignment_schema,taskassignments_schema

SECRET_KEY = "b'|\xe7\xbfU3`\xc4\xec\xa7\xa9zf:}\xb5\xc7\xb9\x139^3@Dv'"

@app.route('/employees', methods=['POST'])
def add_employee():
    data = request.get_json()
    employee = Employee(name=data['name'], salary=data['salary'], days_off=data['days_off'], address=data['address'], skills=data['skills'])
    db.session.add(employee)
    db.session.commit()
    return jsonify(employee_schema.dump(employee)), 201

@app.route('/employees/<int:id>', methods=['GET'])
def get_employee(id):
    employee = Employee.query.get_or_404(id)
    return jsonify(employee_schema.dump(employee))

@app.route('/employees', methods=['GET'])
def get_all_employees():
    employees = Employee.query.all()
    return jsonify(employees_schema.dump(employees))

@app.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    employee = Employee.query.get_or_404(id)
    data = request.get_json()
    employee.name = data.get('name', employee.name)
    employee.salary = data.get('salary', employee.salary)
    employee.days_off = data.get('days_off', employee.days_off)
    employee.address = data.get('address', employee.address)
    employee.skills = data.get('skills', employee.skills)
    db.session.commit()

    # Correct use of dump for a single object
    return jsonify(employee_schema.dump(employee))

@app.route('/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    employee = Employee.query.get_or_404(id)
    db.session.delete(employee)
    db.session.commit()
    return jsonify({'message': 'Employee removed'})

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    task = Task(title=data['title'], skills_required=data['skills_required'])
    db.session.add(task)
    db.session.commit()
    return jsonify(tasks_schema.dump(task)), 201

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'})
@app.route('/assign_task', methods=['POST'])
def assign_task():
    data = request.get_json()
    task_id = data['task_id']
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'message': 'Task not found'}), 404

    for assignment_data in data['assignments']:
        employee_id = assignment_data['employee_id']
        assigned_percentage = assignment_data['assigned_percentage']
        completed_percentage = assignment_data['completed_percentage']

        employee = Employee.query.get(employee_id)
        if not employee:
            return jsonify({'message': f'Employee with ID {employee_id} not found'}), 404

        assignment = TaskAssignment(
            task_id=task_id,
            employee_id=employee_id,
            completion_percentage=completed_percentage
        )
        db.session.add(assignment)

    db.session.commit()
    return jsonify({'message': 'Task assigned successfully'}), 201

@app.route('/update_task_completion/<int:assignment_id>', methods=['PUT'])
def update_task_completion(assignment_id):
    data = request.get_json()
    completion_percentage = data.get('completion_percentage')

    assignment = TaskAssignment.query.get_or_404(assignment_id)
    assignment.completion_percentage = completion_percentage
    db.session.commit()

    return jsonify({'message': 'Task completion updated successfully'}), 200

@app.route('/auto_assign_task', methods=['POST'])
def auto_assign_task():
    data = request.get_json()
    task_id = data['task_id']
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'message': 'Task not found'}), 404

    # Find employees whose skills match the task's required skills
    matched_employees = Employee.query.filter(
        Employee.skills.contains(task.skills_required)
    ).all()

    if not matched_employees:
        return jsonify({'message': 'No suitable employees found'}), 404

    # Optionally, implement logic to select the best match or distribute the task
    for employee in matched_employees:
        assignment = TaskAssignment(
            task_id=task_id,
            employee_id=employee.id,
            completion_percentage=0
        )
        db.session.add(assignment)

    db.session.commit()
    return jsonify({'message': 'Task auto-assigned successfully'}), 201
