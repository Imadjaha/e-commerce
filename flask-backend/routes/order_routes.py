from flask import Blueprint, jsonify
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.order import Order
from models.order_item import OrderItem
from models.cart import Cart
from models.product import Product
from models.user import User

bp = Blueprint("order", __name__)


@bp.route("/", methods=["POST"])
@jwt_required()
def create_order():
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    cart = Cart.query.filter_by(userId=user.userId).first()
    if not cart or not cart.items:
        return jsonify({"message": "Cart is empty"}), 400

    # calculate total price
    total_price = 0.0
    order = Order(userId=user.userId, items=[])
    db.session.add(order)
    db.session.commit()

    for cart_item in cart.items:
        item_price = cart_item.product.price * cart_item.quantity
        total_price += item_price

        product = Product.query.get(cart_item.productId)

        order_item = OrderItem(
            orderId=order.orderId,
            productId=cart_item.productId,
            quantity=cart_item.quantity,
            price=product.price,
        )
        db.session.add(order_item)

    order.total_price = total_price
    db.session.commit()

    # Clear cart after creating the order
    db.session.delete(cart)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "Order created successfully",
                "orderId": order.orderId,
                "totalPrice": total_price,
            }
        ),
        201,
    )


@bp.route("/", methods=["GET"])
@jwt_required()
def get_orders():
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    orders = Order.query.filter_by(userId=user.userId).all()
    results = []

    for order in orders:
        item_list = []
        for item in order.items:
            item_list.append(
                {
                    "productId": item.productId,
                    "quantity": item.quantity,
                    "productName": item.product.productName,
                    "productPrice": item.product.price,
                }
            )
        results.append(
            {
                "orderId": order.orderId,
                "totalPrice": order.total_price,
                "status": order.status.value,
                "items": item_list,
            }
        )

    return jsonify({"orders": results}), 200


@bp.route("/<int:orderId>/cancel", methods=["POST"])
@jwt_required()
def cancel_order(orderId):
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    order = Order.query.filter_by(userId=user.userId, orderId=orderId).first()
    if not order:
        return jsonify({"message": "Order not found"}), 404

    if order.status == "PENDING":
        order.status = "CANCELLED"
        db.session.commit()
        return jsonify({"message": "Order cancelled successfully"}), 200
    else:
        return (
            jsonify(
                {
                    "message": f"Order cannot be cancelled, current status is {order.status}"
                }
            ),
            400,
        )
