from extensions import db


class Cart(db.Model):
    __tablename__ = "cart"

    cartId = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey("users.userId"), nullable=False)
    # Relationship to CartItem
    items = db.relationship("CartItem", backref="cart", cascade="all, delete-orphan")
