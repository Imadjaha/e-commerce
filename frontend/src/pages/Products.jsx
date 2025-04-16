import React from "react";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchProduct } from "../slices/productSlice";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Products() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);
  
  const [filter,setFilter] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "failed") {
    return <p>{error}</p>;
  }
  
  const filteredProducts = items.filter((product) =>{
    const searchQuery = filter.toLowerCase();
    return (
      product.productName.toLowerCase().includes(searchQuery) || product.description.toLowerCase().includes(searchQuery)
    )
  })

  return (
    <div>
    <h2 className="w-full text-2xl font-semibold mb-4 text-center">
        Products
      </h2>
      
      {/* Filter Input */}
      
      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search for products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-1/2 p-2.5 mb-5 border border-[#433232] rounded-md focus:ring-2 focus:ring-[#8707ff] focus:outline-none"
        />
      </div>
    <div className="flex flex-wrap justify-center gap-4 p-4">

      {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (filteredProducts.map((product) => (
          <div
            key={product._id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
          >
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                sx={{
                  height: 200,
                  width: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
                image={
                  product.images[0].startsWith("http")
                    ? product.images[0]
                    : `http://localhost:3000${product.images[0].replace(
                        "./",
                        "/"
                      )}`
                }
                alt={product.productName}
              />
              <CardContent>
                <div className="flex items-center justify-between">
                  <Typography variant="h6" component="h3">
                    {product.productName}
                  </Typography>
                  <Typography
                    className="font-semibold px-2 py-1 rounded-full bg-gray-200 text-gray-800"
                    variant="body2"
                    component="span"
                  >
                    ${product.price}
                  </Typography>
                </div>
                <Typography variant="body2" color="text.secondary">
                  {product.description.slice(0, 100)}...
                </Typography>
                <Link
                  to={`/product/${product._id}`}
                  className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  View Details
                </Link>
              </CardContent>
            </Card>
          </div>
      ))) :(
        <p>No products found.</p>
      )}
        
    </div>
    </div>
  );
}

export default Products;
