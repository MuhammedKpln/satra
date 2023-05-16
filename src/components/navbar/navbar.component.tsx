import { RoutePath } from "@/routes";
import { LoginState, useAuthStore } from "@/stores/auth.store";
import { Dropdown, Link, Navbar, Text } from "@nextui-org/react";
import { Key, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiExternalLink } from "react-icons/fi";

interface IProps {
  hideNavbar: boolean;
}

export default function Nav({ hideNavbar }: IProps) {
  const loginState = useAuthStore((state) => state.loginState);
  const authUsername = useAuthStore((state) => state.username);
  const isStaff = useAuthStore((state) => state.isStaff);
  const logout = useAuthStore((state) => state.logout);
  const { t, i18n } = useTranslation();

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
    <>
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
    </>
  );
}
