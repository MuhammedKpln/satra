import { Container, Dropdown, Navbar, Text, useTheme } from "@nextui-org/react";
import { Key, useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FiExternalLink } from "react-icons/fi";
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
  const isStaff = useAuthStore((state) => state.isStaff);
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
    i18n.changeLanguage(key as string);
  }, []);

  const userActions = useCallback((key: Key) => {
    switch (key) {
      case "panel":
        if (!isStaff) return;

        window.open(import.meta.env.VITE_PANEL_URL, "_blank");
        break;
      case "logout":
        logout();
        break;

      default:
        break;
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
                <Dropdown>
                  <Dropdown.Button light>{t("lang")}</Dropdown.Button>
                  <Dropdown.Menu onAction={changeLang}>
                    <Dropdown.Item key="sv">Svenska</Dropdown.Item>
                    <Dropdown.Item key="tr">Turkiska</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                  <Dropdown.Button shadow>{authUsername}</Dropdown.Button>
                  <Dropdown.Menu onAction={userActions}>
                    <Dropdown.Item
                      key="panel"
                      icon={<FiExternalLink size={15} />}
                    >
                      Panel
                    </Dropdown.Item>
                    <Dropdown.Item key="logout" withDivider color="error">
                      {t("logout")}
                    </Dropdown.Item>
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
