/* ==========================================================================
   App.jsx: the layout and the list of pages ("routes")
   --------------------------------------------------------------------------
   The header, footer and basket drawer appear on every page. Between them,
   <Routes> picks ONE page to show, based on the address in the browser:

     /                       → Home
     /shop                   → Shop (filters live in the address, e.g.
                               /shop?category=lighting&sort=price-asc)
     /product/rowan-dining-chair → ProductPage (":slug" is a URL parameter)
     /basket                 → Basket
     /checkout               → Checkout
     /order-confirmed        → OrderConfirmed
     anything else           → NotFound (404)
   ========================================================================== */
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Basket from "./pages/Basket.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderConfirmed from "./pages/OrderConfirmed.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmed" element={<OrderConfirmed />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
