"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Star,
  ShoppingCart,
  Eye,
  Loader,
  AlertCircle,
  Heart,
  Search,
  Filter,
  X,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import "./App.css";

// Toast Notification Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === "success" ? (
          <Check className="toast-icon" />
        ) : (
          <AlertCircle className="toast-icon" />
        )}
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="toast-close">
        <X size={16} />
      </button>
    </div>
  );
}

// Quick View Modal Component
function QuickViewModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="modal-body">
          <div className="modal-image">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
            />
          </div>
          <div className="modal-info">
            <div className="product-category">{product.category}</div>
            <h2 className="modal-title">{product.title}</h2>
            <div className="rating-container">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`star-icon ${
                      i < Math.floor(product.rating.rate) ? "filled" : "empty"
                    }`}
                  />
                ))}
              </div>
              <span className="rating-text">{product.rating.rate}</span>
              <span className="rating-count">
                ({product.rating.count} reviews)
              </span>
            </div>
            <p className="modal-description">{product.description}</p>
            <div className="price-container">
              <span className="current-price">${product.price.toFixed(2)}</span>
              <span className="original-price">
                ${(product.price * 5).toFixed(2)}
              </span>
            </div>
            <button
              className="add-to-cart-btn modal-cart-btn"
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
            >
              <ShoppingCart className="cart-icon" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Sidebar Component
function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h3>Shopping Cart ({cartItems.length})</h3>
        <button onClick={onClose} className="cart-close">
          <X size={24} />
        </button>
      </div>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={48} />
            <p>Your cart is empty</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <h4 className="cart-item-title">{item.title}</h4>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
                    }
                    className="quantity-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="remove-item"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="cart-footer">
          <div className="cart-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}

// Search and Filter Component
function SearchFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) {
  return (
    <div className="search-filter-container">
      <div className="search-box">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="filter-box">
        <Filter className="filter-icon" />
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// REUSABLE COMPONENT 1: ProductCard
function ProductCard({
  product,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {!imageLoaded && !imageError && (
          <div className="image-placeholder">
            <Loader className="placeholder-spinner" />
          </div>
        )}

        {imageError ? (
          <div className="image-error">
            <AlertCircle className="error-icon" />
            <span>Image not available</span>
          </div>
        ) : (
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className={`product-image ${imageLoaded ? "loaded" : ""}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageLoaded ? "block" : "none" }}
          />
        )}

        <div className="discount-badge">80% OFF</div>
        <div className="product-overlay">
          <button
            className="quick-view-btn"
            onClick={() => onQuickView(product)}
          >
            <Eye className="eye-icon" />
            Quick View
          </button>
        </div>
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-title" title={product.title}>
          {product.title}
        </h3>
        <div className="rating-container">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`star-icon ${
                  i < Math.floor(product.rating.rate) ? "filled" : "empty"
                }`}
              />
            ))}
          </div>
          <span className="rating-text">{product.rating.rate}</span>
          <span className="rating-count">({product.rating.count} reviews)</span>
        </div>
        <div className="price-container">
          <span className="current-price">${product.price.toFixed(2)}</span>
          <span className="original-price">
            ${(product.price * 5).toFixed(2)}
          </span>
          <span className="savings">
            Save ${(product.price * 5 - product.price).toFixed(2)}
          </span>
        </div>
        <div className="button-container">
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="cart-icon" />
            Add to Cart
          </button>
          <button
            className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
            onClick={() => onToggleWishlist(product)}
          >
            <Heart className={`heart-icon ${isInWishlist ? "filled" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

// REUSABLE COMPONENT 2: ProductGrid
function ProductGrid({
  products,
  title,
  loading,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistItems,
}) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-container">
          <Loader className="loading-spinner" />
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <p className="loading-text">Loading amazing products...</p>
        <p className="loading-subtext">Finding the best deals for you</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🛍️</div>
        <h3 className="empty-title">No products found</h3>
        <p className="empty-message">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="title-underline"></div>
        <p className="section-subtitle">
          Showing {products.length} premium products with ratings above 4.0
        </p>
      </div>
      <div className="products-grid">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="product-wrapper"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductCard
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isInWishlist={wishlistItems.some(
                (item) => item.id === product.id
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Statistics Component
function StatsSection({
  totalProducts,
  filteredProducts,
  loading,
  cartItemsCount,
}) {
  const stats = [
    {
      number: totalProducts,
      label: "Total Products",
      icon: "📦",
      color: "blue",
      description: "Available in store",
    },
    {
      number: filteredProducts,
      label: "High-Rated Products",
      icon: "⭐",
      color: "green",
      description: "Rating above 4.0",
    },
    {
      number: cartItemsCount,
      label: "Items in Cart",
      icon: "🛒",
      color: "purple",
      description: "Ready to checkout",
    },
  ];

  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="stat-card loading">
            <div className="stat-skeleton"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`stat-card ${stat.color}`}
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-number">{stat.number}</div>
          <div className="stat-label">{stat.label}</div>
          <div className="stat-description">{stat.description}</div>
        </div>
      ))}
    </div>
  );
}

// MAIN APP COMPONENT
function App() {
  // 1. STATE MANAGEMENT dengan useState
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("fakestore-cart");
    const savedWishlist = localStorage.getItem("fakestore-wishlist");

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Save to localStorage when cart or wishlist changes
  useEffect(() => {
    localStorage.setItem("fakestore-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("fakestore-wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // 1. FETCH DATA dengan useEffect dan useState
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔄 Fetching data from FakeStore API...");
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("✅ Data fetched successfully:", data.length, "products");
        // Simulate loading time for better UX
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array = runs once on mount

  // 2. REDUCE PRICES to 20% using map method
  const reducedPriceProducts = products.map((product) => {
    console.log(
      `💰 Original price: $${product.price} → Reduced: $${(
        product.price * 0.2
      ).toFixed(2)}`
    );
    return {
      ...product,
      price: product.price * 0.2, // 20% of original price
    };
  });

  // 3. FILTER PRODUCTS with rating > 4.0 and search/category filters
  const filteredProducts = reducedPriceProducts.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const isHighRated = product.rating.rate > 4.0;

    if (isHighRated && matchesSearch && matchesCategory) {
      console.log(
        `⭐ High-rated product: ${product.title} (${product.rating.rate})`
      );
    }
    return matchesSearch && matchesCategory && isHighRated;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  console.log(
    `📊 Total products: ${products.length} | High-rated: ${filteredProducts.length}`
  );

  // Cart functions
  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setToast({
      message: `${product.title} added to cart!`,
      type: "success",
    });
  }, []);

  const updateCartQuantity = useCallback((id, quantity) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Wishlist functions
  const toggleWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      const isInWishlist = prev.some((item) => item.id === product.id);
      if (isInWishlist) {
        setToast({
          message: `${product.title} removed from wishlist`,
          type: "success",
        });
        return prev.filter((item) => item.id !== product.id);
      } else {
        setToast({
          message: `${product.title} added to wishlist!`,
          type: "success",
        });
        return [...prev, product];
      }
    });
  }, []);

  // Quick view functions
  const openQuickView = useCallback((product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
  }, []);

  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // ERROR HANDLING
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-animation">
            <AlertCircle className="error-icon-large" />
          </div>
          <h2 className="error-title">Oops! Something went wrong</h2>
          <p className="error-message">{error}</p>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* HEADER */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-top">
            <div className="header-badge">✨ New Collection Available</div>
            <div className="header-actions">
              <button
                className="cart-toggle"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="cart-count">{cartItemsCount}</span>
                )}
              </button>
              <button className="wishlist-toggle">
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="wishlist-count">{wishlistItems.length}</span>
                )}
              </button>
            </div>
          </div>
          <h1 className="app-title">🛍️ FakeStore Premium</h1>
          <p className="app-subtitle">
            Discover amazing products with incredible discounts up to 80% off!
          </p>
          <div className="header-features">
            <span className="feature">🚚 Free Shipping</span>
            <span className="feature">🔄 Easy Returns</span>
            <span className="feature">⭐ Premium Quality</span>
          </div>
        </div>
        <div className="header-decoration"></div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* SEARCH AND FILTER */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        {/* STATS SECTION */}
        <StatsSection
          totalProducts={products.length}
          filteredProducts={filteredProducts.length}
          loading={loading}
          cartItemsCount={cartItemsCount}
        />

        {/* 4. DISPLAY DATA using map method through ProductGrid component */}
        <ProductGrid
          products={filteredProducts}
          title={
            loading ? "Loading Products..." : "🌟 Premium Products Collection"
          }
          loading={loading}
          onQuickView={openQuickView}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          wishlistItems={wishlistItems}
        />
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <h3 className="footer-title">🛍️ FakeStore Premium</h3>
              <p className="footer-description">
                Your trusted marketplace for premium products at unbeatable
                prices.
              </p>
            </div>
            <div className="footer-stats">
              <div className="footer-stat">
                <span className="footer-stat-number">10K+</span>
                <span className="footer-stat-label">Happy Customers</span>
              </div>
              <div className="footer-stat">
                <span className="footer-stat-number">99%</span>
                <span className="footer-stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-text">
              Built with ❤️ using React & FakeStore API
            </p>
            <p className="footer-subtitle">
              Data processed: Prices reduced to 20% • Filtered by rating &gt;
              4.0
            </p>
          </div>
        </div>
      </footer>

      {/* MODALS AND OVERLAYS */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
        onAddToCart={addToCart}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />

      {/* TOAST NOTIFICATIONS */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
