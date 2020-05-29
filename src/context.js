import React, { Component } from 'react';
import { storeProducts, detailProduct } from './data';

const ProductContext = React.createContext();

class ProductProvider extends Component {
	state = {
		products: [],
		detailProduct: detailProduct,
		cart: storeProducts,
		modalOpen: false,
		modalProdact: detailProduct,
		cartSubTotal: 0,
		cartTax: 0,
		cartTotle: 0
	};
	componentDidMount() {
		this.setProducts();
	}
	setProducts = () => {
		let temproducts = [];
		storeProducts.forEach(item => {
			const singleitem = { ...item };
			temproducts = [...temproducts, singleitem];
		});
		this.setState(() => {
			return { products: temproducts };
		});
	};

	getItem = id => {

		const product = this.state.products.find(item => item.id === id);
		return product;
	};

	handelDetail = id => {
		const product = this.getItem(id);
		this.setState(() => {
			return { detailProduct: product };
		});
	};
	addToCart = id => {
		let temproducts = [...this.state.products];
		const index = temproducts.indexOf(this.getItem(id));
		const product = temproducts[index];
		product.inCart = true;
		product.count = 1;
		const price = product.price;
		product.total = price;
		this.setState(
			() => {
				return { products: temproducts, cart: [...this.state.cart, product] };
			},
			() => {
				this.addTotals();
			},
		);
	};
	openModal = id => {
		const product = this.getItem(id);
		this.setState(() => {
			return { modalProdact: product, modalOpen: true };
		});
	};
	closeModal = id => {
		this.setState(() => {
			return { modalOpen: false };
		});
	};
	increment = id => {
		let tempCart = [...this.state.cart]
		const selectedProducts = tempCart.find(item => item.id === id)
		const index = tempCart.indexOf(selectedProducts)
		const product = tempCart[index];
		product.count = product.count + 1;
		product.total = product.count * product.price
		this.setState(() => {
			return { cart: [...tempCart] }
		}, () => {
			this.addTotals();
		})
	};
	decrement = id => {
		let tempCart = [...this.state.cart]
		const selectedProducts = tempCart.find(item => item.id === id)
		const index = tempCart.indexOf(selectedProducts)
		const product = tempCart[index];
		product.count = product.count - 1
	};
	removeItem = id => {
		let temproducts = [...this.state.products];
		let tempCart = [...this.state.cart]
		tempCart = tempCart.filter(item => item.id !== id);
		const index = temproducts.indexOf(this.getItem(id));
		let removedProduct = temproducts[index]
		removedProduct.inCart = false;
		removedProduct.count = 0;
		removedProduct.total = 0;
		this.setState(() => {
			return {
				cart: [...tempCart],
				prodcts: [...temproducts]
			}
		})

	};
	clearcart = id => {
		this.setState(() => {
			return { cart: [] };
		}, () => {
			this.setProducts();
			this.addTotals();
		})
	};
	addTotals = () => {
		let subTotal = 0;
		this.state.cart.map(item => (subTotal += item.total));
		const tempTax = subTotal * 0.1;
		const tax = parseFloat(tempTax.toFixed(2));
		const total = subTotal + tax
		this.setState(() => {
			return {
				cartSubTotal: subTotal,
				cartTax: tax,
				cartTotal: total
			}
		})
	}
	render() {
		return (
			<ProductContext.Provider
				value={{
					...this.state,
					handelDetail: this.handelDetail,
					addToCart: this.addToCart,
					openModal: this.openModal,
					closeModal: this.closeModal,
					increment: this.increment,
					decrement: this.decrement,
					removeItem: this.removeItem,
					clearcart: this.clearcart,
				}}>
				{this.props.children}
			</ProductContext.Provider>
		);
	}
}
const ProductConsumer = ProductContext.Consumer;
export { ProductConsumer, ProductProvider };