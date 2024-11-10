import Product from "../../models/Product.js";

const getFilterProducts = async (req, res) => {
  try {
 
    const { category = "", brand = "", sortBy = "price-lowtohigh" } = req.query;
   
    let filters = {};
  
   
  
if (category) {
  filters.category = {
    $in: category
      .split(",") 
      .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)), 
  };
}

if (brand) {
  filters.brand = {
    $in: brand
      .split(",") 
      .map((br) => br.charAt(0).toUpperCase() + br.slice(1)), 
  };
}

console.log("Filters applied:", filters);


    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    // Fetch products based on filters and sorting criteria
    const products = await Product.find(filters).sort(sort);
    res.status(200).json({
      success: true,
      data: products,
    });
    
  } catch (e) {
    console.error("Error fetching products:", e);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
    });
  }
};

const getProductDetails = async(req, res)=> {
  try{

    const {id} = req.params;
    const product = await Product.findById(id);

    if(!product) return res.status(400).json({
      success: false,
      message: 'Product not found!'
    })

    res.status(200).json({
      success: true,
      data: product
    })

  }catch(e){
    console.error("Error fetching products:", e);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
    });
  }
}

export { getFilterProducts, getProductDetails };
