from ..app import db,ma

class employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_name = db.Column(db.String(255))
    employee_phone = db.Column(db.String(255))
    employee_address = db.Column(db.String(255))
    employee_department = db.Column(db.String(255))
    manager_id = db.Column(db.Integer, db.ForeignKey('manager.id'), nullable=True)
    def __init__(self, employee_name, employee_phone, employee_address,employee_department, manager_id=None):
        super(employee, self).__init__(employee_name=employee_name,
        employee_phone=employee_phone, employee_address=employee_address,
        employee_department=employee_department,
        manager_id=manager_id)
class employeeSchema(ma.Schema):
    class Meta:
        fields = ("id","employee_name","employee_phone","employee_address","employee_department","manager_id")
        model = employee
employees_schema = employeeSchema()