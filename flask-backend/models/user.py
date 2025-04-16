from extensions import db
import bcrypt
import enum
from sqlalchemy import Enum


class Role(enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class User(db.Model):
    __tablename__ = "users"

    userId = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    role = db.Column(Enum(Role), default=Role.USER)

    def set_password(self, raw_password):
        # Hash password with bcrypt
        self.password = bcrypt.hashpw(
            raw_password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    def check_password(self, raw_password):
        return bcrypt.hashpw(
            raw_password.encode("utf-8"), self.password.encode("utf-8")
        ) == self.password.encode("utf-8")
