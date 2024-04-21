from ..app import db,ma
from sqlalchemy.dialects.mysql import JSON
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    skills_required = db.Column(JSON)  # Storing required skills as JSON array
    assignments = db.relationship('TaskAssignment', back_populates='task', cascade="all, delete-orphan")


class taskSchema(ma.Schema):
    class Meta:
        fields = ("id","title","skills_required")
        model = Task
task_schema = taskSchema()
tasks_schema = taskSchema(many=True)