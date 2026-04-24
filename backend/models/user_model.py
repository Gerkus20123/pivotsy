from db import db
from . import job_model

user_followed_jobs = db.Table(
    "user_followed_jobs",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("job_id", db.Integer, db.ForeignKey("jobs.id"), primary_key=True)
)

class UserModel(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(80), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    company_name = db.Column(db.String(160), nullable=True)

    followed_jobs = db.relationship(
        "JobModel", 
        secondary=user_followed_jobs, 
        backref=db.backref("followed_by", lazy="dynamic")
    )