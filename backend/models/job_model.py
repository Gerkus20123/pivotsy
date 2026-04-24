from datetime import datetime, timezone
from db import db

class JobModel(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    short_description = db.Column(db.String(160), nullable=False)
    long_description = db.Column(db.String(1000), nullable=False)
    experience_requirement = db.Column(db.String(250), nullable=False)
    category = db.Column(db.String(250), nullable=False)
    subcategory = db.Column(db.String(250), nullable=False)
    image = db.Column(db.String(), nullable=True)
    payment = db.Column(db.Integer, nullable=True)
    currency = db.Column(db.String(160), nullable=True)
    agreement_type = db.Column(db.String(160), nullable=True)
    schedule = db.Column(db.String(250), nullable=True)
    location = db.Column(db.String(250), nullable=True)
    transport_availability = db.Column(db.String(250), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), 
                            onupdate=lambda: datetime.now(timezone.utc))
    additional_requirements = db.Column(db.String(500), nullable=True)
    type_of_work = db.Column(db.String(160), nullable=True)
    job_author_name = db.Column(db.String(100), nullable=False) 
    job_phone_number = db.Column(db.String(20), nullable=False)
    job_company_name = db.Column(db.String(150), nullable=True)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("UserModel", backref="jobs")
