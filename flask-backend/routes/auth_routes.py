from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import create_access_token
from models.user import User, Role
import os
from dotenv import load_dotenv

load_dotenv()


bp = Blueprint("auth", __name__)


@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 400

    elif User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "Username already exists"}), 400

    admins = os.getenv("ADMINS").split(",")
    if data["role"] == "ADMIN" and data["username"] not in admins:
        return jsonify({"message": "Unauthorized access"}), 403

    assigned_role = Role.ADMIN if data["username"] in admins else Role.USER

    user = User(
        username=data["username"],
        email=data["email"],
        role=assigned_role,
        address=data["address"],
    )

    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    user = User.query.filter_by(username=data["username"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"message": "Invalid username or password"}), 401

    # Generate JWT token
    additional_claims = {"role": user.role.value}
    access_token = create_access_token(
        identity=user.username, additional_claims=additional_claims
    )
    return jsonify({"access_token": access_token}), 200
