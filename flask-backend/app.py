from flask import Flask
from config import Config
from extensions import db, jwt
from routes import auth_routes, product_routes, cart_routes, order_routes


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize Flask extensions here
    db.init_app(app)
    jwt.init_app(app)

    # Register blueprints here
    app.register_blueprint(auth_routes, url_prefix="/api/auth")
    app.register_blueprint(product_routes, url_prefix="/api/products")
    app.register_blueprint(cart_routes, url_prefix="/api/cart")
    app.register_blueprint(order_routes, url_prefix="/api/orders")

    @app.route("/")
    def index():
        return {"message": "Welcome to Flask E-COMMERCE API"}

    return app


if __name__ == "__main__":
    flask_app = create_app()
    with flask_app.app_context():
        db.create_all()
    flask_app.run(host="0.0.0.0", port=5000)
