from ..app import db,ma


class TaskAssignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'))
    assigned_percentage = db.Column(db.Float, default=0)  # Percentage of the task assigned to the employee
    completion_percentage = db.Column(db.Float, default=0)  # Percentage of the assigned task completed

    task = db.relationship('Task', back_populates='assignments')
    employee = db.relationship('Employee', back_populates='tasks')


class taskassignmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TaskAssignment
        include_fk = True  # Includes foreign keys in the serialized output
        fields = ("id", "task_id", "employee_id", "assigned_percentage", "completion_percentage")
taskassignment_schema = taskassignmentSchema()
taskassignments_schema = taskassignmentSchema(many=True)