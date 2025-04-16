import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{os.environ.get('DB_USER')}:{os.environ.get('DB_PASS')}@{os.environ.get('DB_HOST')}/{os.environ.get('DB_NAME')}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False  # used for error handling in flask
    PROPAGATE_EXCEPTIONS = True  # used for error handling in flask
    DEBUG = os.environ.get("FLASK_ENV") == "development"
