from datetime import timedelta
import os
from flask import Flask, jsonify 
from flask_smorest import Api 
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate

from blocklist import BLOCKLIST
from resources.users import blp as Users
from resources.jobs import blp as Jobs
from db import db
import models

# App initialization
app = Flask(__name__, static_folder='static')

CORS(app, 
     resources={r"/*": {"origins": ["http://localhost:3000"]}},
     supports_credentials=True)

# App configuration
app.config["PROPAGATE_EXCEPTIONS"] = True
app.config["API_TITLE"] = "E-commerce REST API"
app.config["API_VERSION"] = "v1"
app.config["OPENAPI_VERSION"] = "3.0.3"
app.config["OPENAPI_URL_PREFIX"] = "/"
app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL",  "sqlite:///pivotsy.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "pivotsy_app"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

# JWT initialization
jwt = JWTManager(app)

# JWT callbacks difinition
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    return jwt_payload["jti"] in BLOCKLIST

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return (jsonify({"message": "The token has been revoked", "error": "token_revoked"}), 401)

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return (jsonify({"message": "The provided token is expired.", "error": "token_expired"}), 401)

@jwt.invalid_token_loader
def invalid_token_loader_callback(error):
    return {"message": "Signature verification failed.", "error": "invalid_token"}, 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return (jsonify({"message": "Request does not contain request token", "error": "authorization_required"}), 401)

@jwt.needs_fresh_token_loader
def token_not_fresh_callback(jwt_header, jwt_payload):
    return (jsonify({"message": "The token is not fresh", "error": "fresh_token_required"}), 401)


# DB initialization
db.init_app(app)
migrate = Migrate(app, db)

# Flask Smorest API initialization
api = Api(app)   

# Register the blueprints
api.register_blueprint(Users)
api.register_blueprint(Jobs)


if __name__ == "__main__":
    app.run()