from flask import request
from flask.views import MethodView
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_smorest import abort, Blueprint
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename
import os
import uuid

from models.user_model import UserModel
from models.job_model import JobModel
from schemas import JobPaginationSchema, JobQueryArgsSchema, JobSchema
from db import db

blp = Blueprint("Jobs", "jobs", description="Jobs endpoints")

UPLOAD_FOLDER = 'static/uploads'
@blp.route("/jobs")
class Jobs(MethodView):
    
    @blp.response(200, JobSchema(many=True))
    @blp.arguments(JobQueryArgsSchema, location="query")
    @blp.response(200, JobPaginationSchema)
    def get(self, args):
        """Show all jobs with pagination and filters"""

        # Query initiation
        query = JobModel.query
        
        # Filter by category and subcategory
        if args.get('category'):
            query = query.filter(func.lower(JobModel.category) == func.lower(args['category']))
        
        if args.get('subcategory'):
            query = query.filter(func.lower(JobModel.subcategory) == func.lower(args['subcategory']))

        pagination = query.paginate(
            page=args['page'], 
            per_page=args['per_page'], 
            error_out=False
        )

        return {
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page,
            "items": pagination.items
        }

    @jwt_required()
    @blp.response(201, JobSchema)
    def post(self):
        """Create a job"""

        current_user_id = get_jwt_identity()

        raw_data = request.form.to_dict()

        if "author_info" in raw_data:
            try:
                import json
                raw_data["author_info"] = json.loads(raw_data["author_info"])
            except json.JSONDecodeError:
                abort(400, message="Invalid author_info format")

        # 3. Walidacja danych przez Schemę
        schema = JobSchema()
        try:
            job_data = schema.load(raw_data)
        except Exception as err:
            abort(422, message=str(err))

        logo_file = request.files.get('logo')
        bg_file = request.files.get('background_image')
        
        logo_url = None
        if logo_file:
            logo_filename = f"{uuid.uuid4().hex}_{secure_filename(logo_file.filename)}"
            logo_file.save(os.path.join(UPLOAD_FOLDER, logo_filename))
            logo_url = f"/static/uploads/{logo_filename}"
        
        bg_url = None
        if bg_file:
            bg_filename = f"{uuid.uuid4().hex}_{secure_filename(bg_file.filename)}"
            bg_file.save(os.path.join(UPLOAD_FOLDER, bg_filename))
            bg_url = f"/static/uploads/{bg_filename}"

        job_db = JobModel(
            **job_data, 
            author_id=current_user_id, 
            logo=logo_url,
            background_image=bg_url
        )

        try:
            db.session.add(job_db)
            db.session.commit()
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            abort(500, message="An error occured while creating a job")

        return job_db

@blp.route("/jobs/stats")
class JobNumber(MethodView):

    def get(self):
        """Show the number of jobs per category and subcategory"""

        statsCat = db.session.query(JobModel.category, func.count(JobModel.id)).group_by(JobModel.category).all()
        statsSubcat = db.session.query(JobModel.subcategory, func.count(JobModel.id)).group_by(JobModel.subcategory).all()

        return {
            "categories": { cat: count for cat, count in statsCat if cat },
            "subcategories": { subcat: count for subcat, count in statsSubcat if subcat }
        }, 200

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
            job.logo = job_data["logo"]
            job.background_image = job_data["background_image"]
            job.payment = job_data["payment"]
            job.currency = job_data["currency"]
            job.agreement_type = job_data["agreement_type"]
            job.schedule = job_data["schedule"]
            job.location = job_data["location"]
            job.experience_requirement = job_data["experience_requirement"]
            job.transport_availability = job_data["transport_availability"]
            job.additional_requirements = job_data["additional_requirements"]
            job.type_of_work = job_data["type_of_work"]
            job.job_author_name = job_data.get("job_author_name", job.job_author_name)
            job.job_phone_number = job_data.get("job_phone_number", job.job_phone_number)
            job.job_company_name = job_data.get("job_company_name", job.job_company_name)
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
