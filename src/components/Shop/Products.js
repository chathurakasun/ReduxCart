import ProductItem from "./ProductItem";
import classes from "./Products.module.css";

const Products = (props) => {
  const DUMMY_PRODUCTS = [
    {
      id: "p1",
      price: 240,
      title: "Apple Laptop",
      description: "MacBook Pro 13",
    },
    {
      id: "p2",
      price: 137,
      title: "Dell Laptop",
      description: "Dell XPS 13 9310",
    },
  ];
  return (
    <section className={classes.products}>
      <h2>Buy your favorite Laptops</h2>
      <ul>
        {DUMMY_PRODUCTS.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            description={product.description}
          />
        ))}
      </ul>
    </section>
  );
};

export default Products;
