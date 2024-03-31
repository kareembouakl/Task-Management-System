from ..app import db,ma

class task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(255))
    task_deadline = db.Column(db.String(255))
    task_commit = db.Column(db.String(255))
    task_percentage = db.Column(db.String(255))
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=True)
    def __init__(self, task_name,task_deadline, task_commit,task_percentage, employee_id=None):
        super(task, self).__init__(
        task_name=task_name,
        task_deadline=task_deadline,
        task_commit=task_commit,
        task_percentage=task_percentage,
        employee_id=employee_id)
class taskSchema(ma.Schema):
    class Meta:
        fields = ("id","task_name","task_deadline","task_commit","task_percentage","employee_id")
        model = task
tasks_schema = taskSchema()