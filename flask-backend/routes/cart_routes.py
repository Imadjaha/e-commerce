from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.cart import Cart
from models.cart_item import CartItem
from models.product import Product
from models.user import User

bp = Blueprint("cart", __name__)


@bp.route("/", methods=["GET"])
@jwt_required()
def get_cart():
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    cart = Cart.query.filter_by(userId=user.userId).first()
    if not cart:
        return jsonify({"cartItems": []}), 200

    items_data = []
    for item in cart.items:
        items_data.append(
            {
                "productId": item.productId,
                "quantity": item.quantity,
                "productName": item.product.productName,
                "productPrice": item.product.price,
            }
        )

    return jsonify({"cartItems": items_data}), 200


@bp.route("/", methods=["POST"])
@jwt_required()
def add_to_cart():
    data = request.get_json()
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    product_id = data["productId"]
    quantity = data.get("quantity", 1)

    product = Product.query.get(product_id)

    if not product:
        return jsonify({"message": "Product not found"}), 404

    cart = Cart.query.filter_by(userId=user.userId).first()

    if not cart:
        cart = Cart(userId=user.userId)
        db.session.add(cart)
        db.session.commit()

    # Check if item already exists in the cart

    cart_item = CartItem.query.filter_by(
        cartId=cart.cartId, productId=product_id
    ).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(
            cartId=cart.cartId, productId=product_id, quantity=quantity
        )
        db.session.add(cart_item)

    db.session.commit()

    return jsonify({"message": "Product added to cart successfully"}), 201


@bp.route("/remove", methods=["DELETE"])
@jwt_required()
def remove_from_cart():
    data = request.get_json()
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    product_id = data["productId"]

    cart = Cart.query.filter_by(userId=user.userId).first()
    if not cart:
        return jsonify({"message": "Cart empty"}), 404

    cart_item = CartItem.query.filter_by(
        cartId=cart.cartId, productId=product_id
    ).first()
    if not cart_item:
        return jsonify({"message": "Item not found in cart"}), 404

    db.session.delete(cart_item)
    db.session.commit()

    return jsonify({"message": "Item removed from cart successfully"}), 200


@bp.route("/clear", methods=["DELETE"])
@jwt_required()
def clear_cart():
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    cart = Cart.query.filter_by(userId=user.userId).first()
    if not cart:
        return jsonify({"message": "Cart already empty"}), 404

    db.session.delete(cart)
    db.session.commit()

    return jsonify({"message": "Cart cleared successfully"}), 200
