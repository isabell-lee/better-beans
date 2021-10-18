import Header from './Components/Header';
import Footer from './Components/Footer';
import Search from './Components/Search';

import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className="container">
      <Header />
      <div className="main">
        {/* <Search /> */}
      </div>
      <Footer />
    </div>
  );
}
