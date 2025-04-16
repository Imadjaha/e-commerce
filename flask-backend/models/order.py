from extensions import db
import enum
from sqlalchemy import Enum


class OrderStatus(enum.Enum):
    PENDING = "PENDING"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"


class Order(db.Model):

    __tablename__ = "orders"

    orderId = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey("users.userId"), nullable=False)
    total_price = db.Column(db.Float, default=0.0)
    status = db.Column(Enum(OrderStatus), default=OrderStatus.PENDING)

    # Relationship to OrderItem
    items = db.relationship("OrderItem", backref="order", cascade="all, delete-orphan")
