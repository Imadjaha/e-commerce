from flask import Blueprint, request, jsonify
from extensions import db
from models.product import Product
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User, Role

bp = Blueprint("product", __name__)


@bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()
    product_list = []
    for product in products:
        product_list.append(
            {
                "productId": product.productId,
                "productName": product.productName,
                "description": product.description,
                "price": product.price,
                "category": product.category,
                "image": product.image,
            }
        )
    return jsonify({"products": product_list}), 200


@bp.route("/<int:productId>", methods=["GET"])
def get_product_by_id(productId):
    product = Product.query.get_or_404(productId)
    return (
        jsonify(
            {
                "productId": product.productId,
                "productName": product.productName,
                "description": product.description,
                "price": product.price,
                "category": product.category,
                "image": product.image,
            }
        ),
        200,
    )


@bp.route("/", methods=["POST"])
@jwt_required()
def add_product():
    print("POST /api/products was hit")
    data = request.get_json()
    print("Received data:", data)
    # Check if the user is an admin
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    if user.role != Role.ADMIN:
        return jsonify({"message": "Forbidden - Admin access required"}), 403

    data = request.get_json()
    new_product = Product(
        productName=data["productName"],
        description=data["description"],
        price=data["price"],
        category=data["category"],
        image=data["image"] if "image" in data else None,
    )

    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product added successfully"}), 201
