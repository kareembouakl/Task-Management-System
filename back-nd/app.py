from flask_sqlalchemy import SQLAlchemy
from flask import Flask,request,jsonify,abort
from flask_cors import CORS
from datetime import datetime
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from sqlalchemy import and_
from .db_config import DB_CONFIG
import requests
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONFIG
db = SQLAlchemy(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
CORS(app)
migrate = Migrate(app, db)

from .model.employee import Employee, employees_schema,employee_schema
from .model.task import Task, task_schema,tasks_schema
from .model.TaskAssignment import TaskAssignment,taskassignment_schema,taskassignments_schema

from .model.inbox import Inbox

SECRET_KEY = "b'|\xe7\xbfU3`\xc4\xec\xa7\xa9zf:}\xb5\xc7\xb9\x139^3@Dv'"
MAILGUN_API_KEY = '8e9ffcdc379e599d43efd143bb5c5fab-2175ccc2-d48d9cf1'
MAILGUN_DOMAIN = 'sandbox9b16936d482a430d84d82709e8c43122.mailgun.org'
MAILGUN_API_URL = f'https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages'

@app.route('/manager', methods=['POST'])
def login():
    user_name = request.json.get('user_name')
    password = request.json.get('password')

    if not user_name or not password:
        return jsonify({"message": "Missing Username or Password"}), 403

    if user_name not in ['Eric', 'Yehya', 'Kareem'] or password != 'manager123':
        return jsonify({"message": "Invalid username or password"}), 403
    else:
        # Allow access or perform other actions
        return jsonify({"message": "User authenticated successfully"}), 200

@app.route('/employees', methods=['POST'])
def add_employee():
    data = request.get_json()

    # Validate email
    if 'email' in data:
        if not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
            return jsonify({"error": "Invalid email format"}), 400

    # Create a new Employee instance
    employee = Employee(
        name=data['name'],
        salary=data['salary'],
        days_off=data['days_off'],
        address=data['address'],
        phone_number=data.get('phone_number'),  # Use .get for optional fields
        email=data.get('email'),
        department=data.get('department'),
        date_of_birth=data.get('date_of_birth'),  # Directly assign the string
        skills=data['skills']
    )

    # Add to the database and commit
    db.session.add(employee);
    db.session.commit();

    # Return the newly created employee
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



@app.route('/tasks', methods=['GET'])
def get_all_tasks():
    all_tasks = Task.query.all()
    return jsonify(tasks_schema.dump(all_tasks))

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    task = Task(title=data['title'], skills_required=data['skills_required'])
    db.session.add(task)
    db.session.commit()
    return jsonify(task_schema.dump(task)), 201

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'})

@app.route('/employee_tasks/<int:employee_id>', methods=['GET'])
def get_employee_tasks(employee_id):
    # Find all task assignments for the given employee ID
    task_assignments = TaskAssignment.query.filter_by(employee_id=employee_id).all()



    # Prepare the response data including task details and completion/assigned percentages
    response_data = []
    for assignment in task_assignments:
        task_data = {
            'id': assignment.id,
            'task_id': assignment.task.id,
            'title': assignment.task.title,
            'completion_percentage': assignment.completion_percentage,
            'assigned_percentage': assignment.assigned_percentage
        }
        response_data.append(task_data)

    return jsonify(response_data), 200


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
        #completed_percentage = assignment_data['completed_percentage']

        employee = Employee.query.get(employee_id)
        if not employee:
            return jsonify({'message': f'Employee with ID {employee_id} not found'}), 404

        assignment = TaskAssignment(
            task_id=task_id,
            employee_id=employee_id,
            assigned_percentage=assigned_percentage
        )
        db.session.add(assignment)

    db.session.commit()
    return jsonify({'message': 'Task assigned successfully'}), 201

from flask import jsonify

@app.route('/update_task_completion/<int:assignment_id>', methods=['PUT'])
def update_task_completion(assignment_id):
    data = request.get_json()
    completion_percentage = data.get('completion_percentage')

    if completion_percentage is None:
        completion_percentage=0

    if completion_percentage>100:
        completion_percentage=100

    try:
        completion_percentage = float(completion_percentage)
    except ValueError:
        return jsonify({'error': 'Completion percentage must be a number'}), 400

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


@app.route('/messages', methods=['GET'])
def get_all_messages():
    messages = Inbox.query.all()
    message_list = [{
        'message_id': message.message_id,
        'subject': message.subject,
        'message_content': message.message_content,
        'date_added': message.date_added
    } for message in messages]
    return jsonify(message_list)



@app.route('/messages', methods=['POST'])
def post_message():
    print('called')
    if not request.json or 'subject' not in request.json or 'message_content' not in request.json:
        return jsonify({'error': 'Missing subject or message content'}), 400
    
    subject = request.json['subject']
    message_content = request.json['message_content']
    
    # Check if a message with the same subject and content already exists
    existing_message = Inbox.query.filter(and_(Inbox.subject == subject, Inbox.message_content == message_content)).first()
    if existing_message:
        return jsonify({'message': 'Similar message already exists'}), 409  # Conflict status code
    
    employees_with_few_days_off = Employee.query.filter(Employee.days_off < 5).all()
    if employees_with_few_days_off:
        subject = "Alert: Employees with Few Days Off"
        message_content = "The following employees have fewer than 5 days off:\n"
        for employee in employees_with_few_days_off:
            message_content += f"- {employee.name}\n"
        new_message = Inbox(subject=subject, message_content=message_content)
        db.session.add(new_message)
    
    total_salary = db.session.query(db.func.sum(Employee.salary)).scalar()
    if total_salary and total_salary > 500000:
        subject = "Alert: Total Salary Exceeds 500,000"
        message_content = f"The total salary of all employees exceeds 100,000. Total Salary: {total_salary}"
        new_message = Inbox(subject=subject, message_content=message_content)
        db.session.add(new_message)
    
    db.session.commit()

    return jsonify({'message': 'Message(s) added successfully'}), 201



@app.route('/payroll', methods=['GET'])
def get_employee_payroll():
    employees = Employee.query.with_entities(Employee.name, Employee.salary).all()
    payroll_data = [{'name': emp.name, 'salary': emp.salary} for emp in employees]
    return jsonify(payroll_data)

def send_email(subject, recipient, content):
    """Send an email using the Mailgun API."""
    return requests.post(
        MAILGUN_API_URL,
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": f"Manager <manager@{MAILGUN_DOMAIN}>",
            "to": [recipient],
            "subject": subject,
            "text": content
        }
    )

@app.route('/send-mail', methods=['POST'])
def send_mail():
    """API endpoint to send emails. Expects JSON input with subject, recipient, and content."""
    data = request.get_json()
    if not data or not all(k in data for k in ('subject', 'recipient', 'content')):
        return jsonify({"error": "Missing data, please provide subject, recipient, and content"}), 400

    subject = data['subject']
    recipient = data['recipient']
    content = data['content']
    
    response = send_email(subject, recipient, content)
    if response.status_code == 200:
        return jsonify({"message": "Email sent successfully!"}), 200
    else:
        return jsonify({"error": "Failed to send email", "details": response.text}), response.status_code



