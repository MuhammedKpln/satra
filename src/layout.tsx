import { Container, Dropdown, Navbar, Text, useTheme } from "@nextui-org/react";
import { Key, useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./global.css";
import styles from "./layout.module.css";
import { RoutePath } from "./routes";
import { LoginState, useAuthStore } from "./stores/auth.store";

function AppLayout(): JSX.Element {
  const { theme } = useTheme();
  const [hideNavbar, setHideNavbar] = useState<boolean>(false);
  const loginState = useAuthStore((state) => state.loginState);
  const authUsername = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
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

  const changeLang = useCallback((key: Key) => {
    if (key != undefined) {
      i18n.changeLanguage(key as string);
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      {!hideNavbar && (
        <nav className="app-navbar">
          <Navbar>
            <Navbar.Brand>
              <Link to={RoutePath.Root}>
                <Text h4>{import.meta.env.VITE_APP_NAME}</Text>
              </Link>
            </Navbar.Brand>

            {loginState == LoginState.loggedIn ? (
              <Navbar.Content>
                <Navbar.Link onClick={logout}>{authUsername}</Navbar.Link>
                <Dropdown>
                  <Dropdown.Button flat>{t("lang")}</Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Static Actions"
                    onAction={changeLang}
                  >
                    <Dropdown.Item key="new">New file</Dropdown.Item>
                    <Dropdown.Item key="copy">Copy link</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Navbar.Content>
            ) : null}
          </Navbar>
        </nav>
      )}

      <main
        className="content-area"
        // If hiding navbar == is on test page, therefore change the background color
        style={hideNavbar ? { backgroundColor: "#e8f2fe" } : {}}
      >
        <Container lg>
          <Outlet />
        </Container>
      </main>
      <footer
        className={styles.footer}
        style={{ boxShadow: theme?.shadows.lg.value }}
      >
        <Container className={styles.footer}>
          <Text>Made by {import.meta.env.VITE_AUTHOR}</Text>
        </Container>
      </footer>

      <Toaster />
    </div>
  );
}

export default AppLayout;
