import { MouseEvent, useContext, useEffect, useState } from "react";
import { ProductModel } from "../models/ProductModel";
import { getAllProducts } from "../core/services/Products";
import { ArrowDropDownCircleOutlined } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { AppContext } from "../store/AppContext";
import { routes } from "../utils/Routes";
import { Link } from "react-router-dom";
import CartModal from "../models/CartModel";
import Lottie from "lottie-react";
import loading from "../assets/animations/loading.json";

function Home() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filteredProducts, setFilteredProducts] = useState<ProductModel[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addToCart, setSingleSelectedItem } = useContext(AppContext);

  useEffect(() => {
    async function fetchProducts() {
      const fetchedProducts = await getAllProducts();
      const fetchedCategories = fetchedProducts.map(
        (product) => product.category
      );
      const uniqueCategories = Array.from(new Set(fetchedCategories));

      setFilteredProducts(fetchedProducts);
      setCategories(uniqueCategories);
      setProducts(fetchedProducts);
      setIsLoading(false);
    }
    const time = setTimeout(() => {
      fetchProducts();
    }, 1000);

    return () => clearTimeout(time);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full">
        <div className="flex items-center justify-center h-screen">
          <Lottie
            animationData={loading}
            loop={true}
            style={{
              width: "30%",
              height: "30%",
            }}
          />
        </div>
      </div>
    );
  }
  function handleDropDownClick(e: MouseEvent<SVGSVGElement>) {
    setAnchorEl(e.currentTarget as unknown as HTMLElement);
  }

  const handleSetSingleSelectedItem = (item: ProductModel) => {
    const cartItem: CartModal = {
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    };
    setSingleSelectedItem(cartItem);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="flex items-center mb-6">
        <div className="flex-1"></div>
        <h1 className="text-3xl flex-1 font-bold text-center text-black">
          Our Products
        </h1>
        <div className="flex-1 flex items-center justify-end gap-2">
          <p className="text-gray-700">Filter by {selectedCategory}:</p>
          <ArrowDropDownCircleOutlined
            fontSize="medium"
            className="cursor-pointer"
            onClick={handleDropDownClick}
          />
        </div>
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        className="max-h-[600px]"
      >
        <MenuItem
          onClick={() => {
            setFilteredProducts(products);
            setSelectedCategory("All");
            setAnchorEl(null);
          }}
        >
          All
        </MenuItem>
        {categories.map((category) => (
          <MenuItem
            key={category}
            className="flex justify-between"
            onClick={() => {
              setFilteredProducts(
                products.filter((product) => product.category === category)
              );
              setSelectedCategory(category);
              setAnchorEl(null);
            }}
          >
            <p>{category}</p>
          </MenuItem>
        ))}
      </Menu>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 flex flex-col justify-between  shadow-lg rounded-lg"
          >
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-contain rounded-lg mb-4"
            />

            {/* Product Title */}
            <h2 className="text-xl font-bold text-black mb-2">
              {product.title}
            </h2>

            {/* Product Price */}
            <p className="text-lg font-semibold text-gray-700 mb-2">
              ${product.price.toFixed(2)}
            </p>

            {/* Product Rating */}
            <div className="flex items-center mb-2">
              <span className="text-yellow-500">★</span>
              <p className="ml-1 text-sm text-gray-700">
                {product.rating.rate} ({product.rating.count} reviews)
              </p>
            </div>

            {/* Product Description */}
            <p className="text-sm text-gray-600">
              {product.description.slice(0, 100)}...
            </p>

            {/* Add to Cart Button */}
            <div className="flex gap-2">
              <button
                onClick={() => addToCart(product)}
                className="mt-4 w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:scale-105"
              >
                Add to Cart
              </button>
              <Link
                to={routes.billing}
                onClick={() => handleSetSingleSelectedItem(product)}
                className="mt-4 w-full text-center bg-black text-yellow-500 font-bold py-2 rounded-lg hover:scale-105"
              >
                Buy Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
