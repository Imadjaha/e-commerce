from extensions import db


class Product(db.Model):

    __tablename__ = "products"

    productId = db.Column(db.Integer, primary_key=True)
    productName = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String(255), nullable=True)
