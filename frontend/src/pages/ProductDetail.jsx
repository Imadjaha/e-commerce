import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProduct } from "../slices/productSlice";
import { addToCart } from "../slices/cartSlice";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, status, error } = useSelector(
    (state) => state.products
  );
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    dispatch(fetchProduct(id));
    
  }, [dispatch, id]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (!selectedProduct) return <p>Product not found</p>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "slick-dots custom-dots",
  };

  const addProductToCart = async () => {
    try {
      await dispatch(
        addToCart({ productId: selectedProduct._id, quantity: 1 })
      ).unwrap();
      setSnackbar({
        open: true,
        message: `${selectedProduct.productName} added to cart`,
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: `${selectedProduct.productName} not added to cart`,
        severity: "error",
      });
    }
  };

  const product = selectedProduct;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        {product.productName}
      </h1>
      <Slider {...settings} className="mb-6 rounded-md">
        {product.images.map((image, index) => (
          <div key={index}>
            <img
              src={
                image.startsWith("http")
                  ? image
                  : `http://localhost:3000${image.replace("./", "/")}`
              }
              alt={`${product.productName} ${index + 1}`}
              className="w-full h-[400px] object-contain rounded-mg"
            />
          </div>
        ))}
      </Slider>
      <p className="text-gray-600 mb-2">
        <strong>Category:</strong> {product.category}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Price:</strong> ${product.price}
      </p>
      <p className="text-gray-800 mt-4 mb-4">{product.description}</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={addProductToCart}
      >
        Add to Cart
      </button>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 text-blue-600 hover:underline text-sm"
      >
        ← Back to Products
      </button>
      {/* {FeedBack } */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ProductDetail;
