from extensions import db


class OrderItem(db.Model):
    __tablename__ = "order_items"

    orderItemId = db.Column(db.Integer, primary_key=True)
    orderId = db.Column(db.Integer, db.ForeignKey("orders.orderId"), nullable=False)
    productId = db.Column(
        db.Integer, db.ForeignKey("products.productId"), nullable=False
    )
    quantity = db.Column(db.Integer, default=1)
    price = db.Column(db.Float, nullable=False)

    product = db.relationship("Product", lazy="joined")
