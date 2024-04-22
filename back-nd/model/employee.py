from ..app import db, ma
from sqlalchemy.dialects.mysql import JSON
from datetime import date

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    salary = db.Column(db.Float, nullable=False)
    days_off = db.Column(db.Integer, default=12)
    address = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)  # New field for phone number
    email = db.Column(db.String(100), nullable=True)  # New field for email
    department = db.Column(db.String(100), nullable=True)  # New field for department
    date_of_birth = db.Column(db.String(100), nullable=True)  # New field for date of birth
    skills = db.Column(JSON)  # Storing skills as JSON array
    tasks = db.relationship('TaskAssignment', back_populates='employee', cascade="all, delete-orphan")



class employeeSchema(ma.Schema):
    class Meta:
        fields = ("id","name","salary","days_off","phone_number","email","department","address","skills")
        model = Employee
employee_schema = employeeSchema()
employees_schema = employeeSchema(many=True)