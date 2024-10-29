import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinners from "../../components/Spinners";

function ProductList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch from API if not found in localStorage
        const res = await fetch(
          "https://inventorymanagement-systemwithstrapi.onrender.com/api/products"
        );
        const data = await res.json();
        const productData = data.data || [];

        setProducts(productData);
        localStorage.setItem("products", JSON.stringify(productData));
      } catch (error) {
        console.log("Error Fetching Data", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };
    fetchProducts();
  }, []);

  const addProductSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name,
      price,
      category,
      brand,
      description,
      quantity,
    };

    try {
      const response = await fetch(
        "https://inventorymanagement-systemwithstrapi.onrender.com/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: productData }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("product created");
        console.log("result", result);
        
      }
      navigate("/productlist")
    } catch (error) {
      console.error("Error placing order", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setBrand(product.brand);
    setDescription(product.description);
    setQuantity(product.quantity); // Added quantity
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedProducts = products.map((product) =>
      product.id === editingProduct.id
        ? {
            ...product,
            name,
            price,
            category,
            brand,
            description,
            quantity, // Include quantity in the updated product
          }
        : product
    );

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setEditingProduct(null); // Close the editing form
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(
        `https://inventorymanagement-systemwithstrapi.onrender.com/api/products/${id}`,
        {
          method: "Delete",
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id));
        alert("product deleted successfully");
      } else {
        console.error("failed to delete product", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting the product:", error);
    }
  };

  if (loading) {
    return <Spinners loading={loading} />;
  }

  return (
    <div>
      <br />
      <br />
      <br />

      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        Create a Product
      </button>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Create Product
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={editingProduct ? handleUpdate : addProductSubmit}>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    placeholder="Enter product name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productPrice" className="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="productPrice"
                    placeholder="Enter product price"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="brand" className="form-label">
                    Product Brand
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="brand"
                    placeholder="Enter product brand"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productCategory" className="form-label">
                    Category
                  </label>
                  <select
                    className="form-select"
                    id="productCategory"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Choose category</option>
                    <option value="Agricultural Products">
                      Agricultural Products
                    </option>
                    <option value="Grocery Items">Grocery Items</option>
                    <option value="Household Essentials">
                      Household Essentials
                    </option>
                    <option value="Livestock & Poultry Supplies">
                      Livestock & Poultry Supplies
                    </option>
                    <option value="Textiles and Clothing">
                      Textiles and Clothing
                    </option>
                    <option value="Hardware and Building Materials">
                      Hardware and Building Materials
                    </option>
                    <option value="Fuel & Energy">Fuel & Energy</option>
                    <option value="Health and Wellness">
                      Health and Wellness
                    </option>
                    <option value="Small Appliances and Tools">
                      Small Appliances and Tools
                    </option>
                    <option value="Beverages">Beverages</option>
                    <option value="Personal Care and Beauty">
                      Personal Care and Beauty
                    </option>
                    <option value="Crafts and Handicrafts">
                      Crafts and Handicrafts
                    </option>
                    <option value="Electronic Accessories">
                      Electronic Accessories
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="productQuantity" className="form-label">
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="productQuantity"
                    placeholder="Enter quantity"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="productDescription"
                    rows="3"
                    placeholder="What Does The Product Do...?"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <table className="table table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={index}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>
                  {product.quantity}
                  {product.quantity < 10 && (
                    <small className="text-danger d-block">Understocked</small>
                  )}
                  {product.quantity > 50 && (
                    <small className="text-success d-block">Overstocked</small>
                  )}
                </td>
                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="btn btn-danger btn-sm mx-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No Products Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
