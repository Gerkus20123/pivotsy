from flask.views import MethodView
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_smorest import abort, Blueprint
from sqlalchemy.exc import SQLAlchemyError

from models.user_model import UserModel
from models.job_model import JobModel
from schemas import JobSchema
from db import db

blp = Blueprint("Jobs", "jobs", description="Jobs endpoints")

@blp.route("/jobs")
class Jobs(MethodView):
    
    @blp.response(200, JobSchema(many=True))
    def get(self):
        """Show all jobs"""
        return JobModel.query.all()

    @jwt_required()
    @blp.arguments(JobSchema)
    @blp.response(201, JobSchema)
    def post(self, job_data):
        """Create a job"""

        current_user_id = get_jwt_identity()

        job_db = JobModel(**job_data, author_id=current_user_id)

        try:
            db.session.add(job_db)
            db.session.commit()
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            abort(500, message="An error occured while creating a job")

        return job_db

@blp.route("/jobs/<int:job_id>")
class Job(MethodView):

    @blp.response(200, JobSchema)
    def get(self, job_id):
        """Get a job by its id from DB"""
        return JobModel.query.get_or_404(job_id)

    def delete(self, job_id):
        """Delete job"""
        job = JobModel.query.get_or_404(job_id)
        db.session.delete(job)
        db.session.commit()
        return {"message": "Job has been successfully deleted."}

    @blp.arguments(JobSchema)
    @blp.response(200, JobSchema)
    def put(self, job_data, job_id):
        """Update a job"""

        job = JobModel.query.get_or_404(job_id)

        if job:
            job.short_description = job_data["short_description"]
            job.long_description = job_data["long_description"]
            job.category = job_data["category"]
            job.subcategory = job_data["subcategory"]
            job.image = job_data["image"]
            job.payment = job_data["payment"]
            job.currency = job_data["currency"]
            job.agreement_type = job_data["agreement_type"]
            job.schedule = job_data["schedule"]
            job.location = job_data["location"]
            job.experience_requirement = job_data["experience_requirement"]
            job.transport_availability = job_data["transport_availability"]
            job.additional_requirements = job_data["additional_requirements"]
            job.type_of_work = job_data["type_of_work"]
            job.job_author_name = job_data["job_author_name"]
            job.job_phone_number = job_data["job_phone_number"]
            job.job_company_name = job_data["job_company_name"]
        else:
            job = JobModel(id=job_id,**job_data)

        try:
            db.session.add(job)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="Error while updating the job.")

        return job

@blp.route("/jobs/<int:job_id>/follow")
class JobFollow(MethodView):

    @jwt_required()
    def post(self, job_id):
        """Follow the job offer"""
       
        # Getting user_id from user sesson
        user_id = get_jwt_identity()

        # User
        user = UserModel.query.get_or_404(user_id)

        # Job
        job = JobModel.query.get_or_404(job_id)

        if job in user.followed_jobs:
            user.followed_jobs.remove(job) # Unfollow
            message = "Unfollowed"
        else:
            user.followed_jobs.append(job) # Follow
            message = "Followed"

        db.session.commit()
        return {"message": message}
