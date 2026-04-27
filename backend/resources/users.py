from flask.views import MethodView
from flask_smorest import abort, Blueprint
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import (
    create_access_token, 
    get_jwt, 
    jwt_required, 
    create_refresh_token, 
    get_jwt_identity
)
from sqlalchemy.exc import SQLAlchemyError

from blocklist import BLOCKLIST
from models.user_model import UserModel
from schemas import JobSchema, UserSchema, UserLoginSchema, UserUpdateSchema
from db import db

blp = Blueprint("Users", "users", description="Users endpoints")

@blp.route("/users")
class Users(MethodView):

    @blp.response(200, UserSchema(many=True))
    def get(self):
        """Show all users"""
        return UserModel.query.all()

@blp.route("/users/<int:user_id>")
class User(MethodView):

    @blp.response(200, UserSchema)
    def get(self, user_id):
        """Get a user by its id from DB"""

        user = UserModel.query.get_or_404(user_id)
        return user

    @blp.arguments(UserUpdateSchema)
    @blp.response(200, UserSchema)
    def put(self, user_data, user_id):
        """Edit user data"""
        
        user = UserModel.query.get_or_404(user_id)

        user.name = user_data.get("name", user.name)
        user.email = user_data.get("email", user.email)
        user.phone_number = user_data.get("phone_number", user.phone_number)
        user.company_name = user_data.get("company_name", user.company_name)
        
        try:
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="Error while updating the user basic information.")

        return user
    
@blp.route("/register")
class UserRegister(MethodView):
    
    @blp.arguments(UserSchema)
    def post(self, user_data):
        """Register a user"""

        if UserModel.query.filter(UserModel.name == user_data['name']).first():
            abort(409, message="User already exists.")

        user = UserModel(
                name=user_data['name'], 
                email=user_data['email'], 
                password=pbkdf2_sha256.hash(user_data['password']),
                role=user_data['role']
            )
        db.session.add(user)
        db.session.commit()

        return {"message" : "User has been sucessfully created."}, 201

@blp.route("/login")
class UserLogin(MethodView):

    @blp.arguments(UserLoginSchema)
    def post(self, user_data):
        """Login"""
        
        user = UserModel.query.filter(UserModel.email == user_data['name']).first()

        if user and pbkdf2_sha256.verify(user_data["password"], user.password):
            ## creating access token if user exists in db and passwords match
            access_token = create_access_token(identity=str(user.id), fresh=True)
            refresh_token = create_refresh_token(identity=str(user.id))
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user_id": user.id
            }, 200

        abort(401, message="Invalid credentials")
            
@blp.route("/logout")
class UserLogout(MethodView):

    @jwt_required()
    def delete(self):
        """Logout"""

        jti = get_jwt()["jti"]
        BLOCKLIST.add(jti)
        return {"message": "Logout successful."}, 200

@blp.route("/refresh")
class TokenRefresh(MethodView):

    @jwt_required(refresh=True) # In order to refresh a token the token should be fresh
    def post(self):
        """Refresh token"""

        current_user = get_jwt_identity()

        new_token = create_access_token(identity=current_user, fresh=False)

        return {
            "access_token": new_token
        }, 200

@blp.route("/users/<int:user_id>/followed_jobs")
class UserFollowedJobs(MethodView):

    @blp.response(200, JobSchema(many=True))
    def get(self, user_id):
        """Get all followed jobs for a specific user"""
        user = UserModel.query.get_or_404(user_id)
        return user.followed_jobs

@blp.route("/users/<int:user_id>/followed_jobs/<int:job_id>")
class UserFollowedJob(MethodView):

    @blp.response(200, JobSchema)
    def get(self, user_id, job_id):
        """Check if specific job is followed by user"""
        user = UserModel.query.get_or_404(user_id)

        # Szukamy konkretnej oferty w polubionych tego użytkownika
        job = next((j for j in user.followed_jobs if j.id == job_id), None)

        if not job:
            return {"is_following": False, "message": "User does not follow this job."}, 200

        return job

@blp.route("/user/<int:user_id>/jobs")
class UserJobs(MethodView):

    @jwt_required()

    @blp.response(200, JobSchema(many=True))
    def get(self, user_id):
        """Get all job offers of a user"""

        user = UserModel.query.get_or_404(user_id)
        return user.jobs
