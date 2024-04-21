from app import db,ma,bcrypt
class manager(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    manager_name = db.Column(db.String(30), unique=True)
    hashed_password = db.Column(db.String(128))
    def __init__(self, manager_name, password):
        super(manager, self).__init__(manager_name=manager_name)
        self.hashed_password = bcrypt.generate_password_hash(password)
class managerSchema(ma.Schema):
    class Meta:
        model = manager
        fields = ("id", "manager_name")
manager_schema = managerSchema()