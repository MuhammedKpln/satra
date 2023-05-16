import { Container } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/footer/footer.component";
import Nav from "./components/navbar/navbar.component";
import "./global.css";
import styles from "./layout.module.css";
import { RoutePath } from "./routes";
import { LoginState, useAuthStore } from "./stores/auth.store";

function AppLayout(): JSX.Element {
  const [hideNavbar, setHideNavbar] = useState<boolean>(false);
  const loginState = useAuthStore((state) => state.loginState);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Hide navbar on test page.
    if (location.pathname == `/${RoutePath.SlutProv}`) {
      setHideNavbar(true);

      return;
    }

    if (hideNavbar) {
      setHideNavbar(false);
    }
  }, [location]);

  useEffect(() => {
    if (loginState == LoginState.none) {
      navigate("/login");
    }
  }, [loginState]);

  return (
    <div className={styles.wrapper}>
      <Nav hideNavbar={hideNavbar} />

      <main
        className="content-area"
        // If hiding navbar == is on test page, therefore change the background color
        style={hideNavbar ? { backgroundColor: "#e8f2fe" } : {}}
      >
        <Container lg>
          <Outlet />
        </Container>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default AppLayout;
