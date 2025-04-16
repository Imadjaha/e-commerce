from extensions import db


class CartItem(db.Model):
    cartItemId = db.Column(db.Integer, primary_key=True)
    cartId = db.Column(db.Integer, db.ForeignKey("cart.cartId"), nullable=False)
    productId = db.Column(
        db.Integer, db.ForeignKey("products.productId"), nullable=False
    )
    quantity = db.Column(db.Integer, default=1)

    product = db.relationship("Product", lazy="joined")
